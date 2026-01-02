const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const {validate, calculateExpiry, sendError, sendSuccess} = require("../utils/validation");
const {checkRateLimit} = require("../utils/rateLimit");

// Product IDs for validation
const PRODUCT_IDS = ["yanAvatar", "yanDraw", "yanPhotobooth"];

// =============================================================================
// USER-FACING OPERATIONS
// =============================================================================

/**
 * POST /licenses/check
 * Unity verifies user has valid license
 */
async function check(req, res) {
    const db = admin.firestore();
    const {userId, productId, email} = req.body;

    try {
        validate(req.body, ["userId", "productId"]);

        if (!PRODUCT_IDS.includes(productId)) {
            return sendError(res, 400, `Invalid product: ${productId}`);
        }

        const allowed = await checkRateLimit(db, userId, "checkLicense");
        if (!allowed) {
            return sendError(res, 429, "Rate limit exceeded. Please wait.");
        }

        // Auto-create user if doesn't exist
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            const now = admin.firestore.Timestamp.now();
            await userRef.set({
                email: email || "unknown",
                createdAt: now,
                updatedAt: now,
                isActive: true,
                isSuspended: false,
            });
            logger.info(`Auto-created user: ${userId}`);
        }

        // Check if user is suspended
        const userData = await userRef.get();
        if (userData.exists && userData.data().isSuspended === true) {
            return sendSuccess(res, {
                userId,
                productId,
                status: "SUSPENDED",
                isValid: false,
                isSuspended: true,
                message: "Account is suspended",
            });
        }

        const licenseRef = db.collection("licenses").doc(userId);

        return await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(licenseRef);

            if (!doc.exists) {
                return sendSuccess(res, {
                    userId,
                    productId,
                    status: "NOT_FOUND",
                    isValid: false,
                });
            }

            const license = doc.data()[productId];

            if (!license || !license.isActive) {
                return sendSuccess(res, {
                    userId,
                    productId,
                    status: "NOT_FOUND",
                    isValid: false,
                });
            }

            const now = admin.firestore.Timestamp.now();
            const isExpired = license.expiryDate < now;

            if (isExpired) {
                transaction.update(licenseRef, {
                    [`${productId}.isActive`]: false,
                });
                return sendSuccess(res, {
                    userId,
                    productId,
                    status: "EXPIRED",
                    isValid: false,
                    expiryDate: license.expiryDate,
                });
            }

            return sendSuccess(res, {
                userId,
                productId,
                status: "VALID",
                isValid: true,
                expiryDate: license.expiryDate,
            });
        });
    } catch (error) {
        logger.error("checkLicense error:", error);
        return sendError(res, 500, "Failed to check license");
    }
}

// =============================================================================
// ADMIN OPERATIONS
// =============================================================================

/**
 * POST /licenses/grant
 * Admin manually grants license
 */
async function grant(req, res) {
    const db = admin.firestore();
    const {userId, productId, days} = req.body;

    try {
        validate(req.body, ["userId", "productId", "days"]);

        if (!PRODUCT_IDS.includes(productId)) {
            return sendError(res, 400, `Invalid product: ${productId}`);
        }

        const daysNum = parseInt(days);
        if (isNaN(daysNum) || daysNum < -3650 || daysNum > 3650 || daysNum === 0) {
            return sendError(res, 400, "Days must be between -3650 and 3650 (not 0)");
        }

        const licenseRef = db.collection("licenses").doc(userId);
        const licenseDoc = await licenseRef.get();
        const existingLicenses = licenseDoc.exists ? licenseDoc.data() : {};
        const existing = existingLicenses[productId];

        let newExpiry;
        const now = admin.firestore.Timestamp.now();

        if (existing && existing.expiryDate && existing.isActive) {
            const existingDate = existing.expiryDate.toDate();
            existingDate.setDate(existingDate.getDate() + daysNum);
            newExpiry = admin.firestore.Timestamp.fromDate(existingDate);
        } else {
            newExpiry = calculateExpiry(daysNum, admin);
        }

        // Check if license should be active (expiry is in future)
        const isActive = newExpiry > now;

        await licenseRef.set(
            {
                [productId]: {
                    isActive: isActive,
                    activatedAt: existing ? existing.activatedAt : now,
                    expiryDate: newExpiry,
                },
            },
            {merge: true}
        );

        // Log transaction
        await db.collection("transactions").add({
            userId: userId,
            type: daysNum > 0 ? "MANUAL_GRANT" : "MANUAL_REDUCTION",
            productIds: [productId],
            daysGranted: daysNum,
            timestamp: now,
            performedBy: "admin",
            metadata: {
                previousExpiry: existing ? existing.expiryDate : null,
                newExpiry: newExpiry,
            },
        });

        logger.info(`Admin ${daysNum > 0 ? 'granted' : 'reduced'} ${Math.abs(daysNum)} days: ${userId}/${productId}`);

        return sendSuccess(res, {
            action: daysNum > 0 ? "granted" : "reduced",
            expiryDate: newExpiry,
            daysGranted: daysNum,
            message: `${daysNum > 0 ? 'Granted' : 'Reduced'} ${Math.abs(daysNum)} days for ${productId}`,
        });
    } catch (error) {
        logger.error("grantLicense error:", error);
        return sendError(res, 500, error.message || "Failed to grant license");
    }
}

/**
 * DELETE /licenses/:userId/:productId
 * Admin manually revokes license
 */
async function revoke(req, res) {
    const db = admin.firestore();
    const {userId, productId} = req.params;

    try {
        if (!userId || !productId) {
            return sendError(res, 400, "User ID and product ID are required");
        }

        if (!PRODUCT_IDS.includes(productId)) {
            return sendError(res, 400, `Invalid product: ${productId}`);
        }

        const licenseRef = db.collection("licenses").doc(userId);
        const licenseDoc = await licenseRef.get();

        if (!licenseDoc.exists) {
            return sendError(res, 404, "License document not found");
        }

        const licenses = licenseDoc.data();
        if (!licenses[productId]) {
            return sendError(res, 404, `License for ${productId} not found`);
        }

        const now = admin.firestore.Timestamp.now();

        await licenseRef.update({
            [`${productId}.isActive`]: false,
            [`${productId}.revokedAt`]: now,
        });

        // Log transaction
        await db.collection("transactions").add({
            userId: userId,
            type: "MANUAL_REVOKE",
            productIds: [productId],
            daysGranted: 0,
            timestamp: now,
            performedBy: "admin",
            metadata: {
                reason: "manual_revocation",
                previousExpiry: licenses[productId].expiryDate,
            },
        });

        logger.info(`Admin revoked license: ${userId}/${productId}`);

        return sendSuccess(res, {
            action: "revoked",
            message: `License revoked for ${productId}`,
        });
    } catch (error) {
        logger.error("revokeLicense error:", error);
        return sendError(res, 500, error.message || "Failed to revoke license");
    }
}

module.exports = {
    check,
    grant,
    revoke,
};