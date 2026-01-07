const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const {validate, sendError, sendSuccess} = require("../utils/validation");

const PRODUCT_IDS = ["yanAvatar", "yanDraw", "yanPhotobooth"];

function formatDateKey(date = new Date()) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function normalizeUsageDaily(doc) {
    const data = doc.data();
    return {
        id: doc.id,
        date: data.date,
        totals: data.totals || {},
        totalCredits: data.totalCredits || 0,
    };
}

async function getBalance(req, res) {
    const db = admin.firestore();
    const userId = req.user?.uid;

    if (!userId) return sendError(res, 401, "Unauthorized");

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    return sendSuccess(res, {
        userId,
        creditsBalance: userData.creditsBalance || 0,
        creditsLifetime: userData.creditsLifetime || 0,
        creditsUpdatedAt: userData.creditsUpdatedAt || null,
    });
}

async function getUsage(req, res) {
    const db = admin.firestore();
    const userId = req.user?.uid;
    const limit = Math.min(parseInt(req.query.limit) || 30, 365);

    if (!userId) return sendError(res, 401, "Unauthorized");

    const usageSnap = await db
        .collection("usage_daily")
        .where("userId", "==", userId)
        .orderBy("date", "desc")
        .limit(limit)
        .get();

    const usageDaily = usageSnap.docs.map(normalizeUsageDaily).reverse();

    const totalsByProduct = usageDaily.reduce((acc, entry) => {
        Object.entries(entry.totals || {}).forEach(([productId, amount]) => {
            acc[productId] = (acc[productId] || 0) + Number(amount || 0);
        });
        return acc;
    }, {});

    const totalCredits = usageDaily.reduce((sum, entry) => sum + Number(entry.totalCredits || 0), 0);

    return sendSuccess(res, {
        userId,
        totalsByProduct,
        totalCredits,
        usageDaily,
    });
}

async function consume(req, res) {
    const db = admin.firestore();
    const userId = req.user?.uid;
    const {productId, credits} = req.body;

    try {
        if (!userId) return sendError(res, 401, "Unauthorized");
        validate(req.body, ["productId", "credits"]);

        if (!PRODUCT_IDS.includes(productId)) {
            return sendError(res, 400, `Invalid product: ${productId}`);
        }

        const creditsNum = parseInt(credits);
        if (isNaN(creditsNum) || creditsNum <= 0) {
            return sendError(res, 400, "Credits must be a positive number");
        }

        const userRef = db.collection("users").doc(userId);
        const ledgerRef = db.collection("credit_ledger").doc();
        const usageEventRef = db.collection("usage_events").doc();
        const dateKey = formatDateKey();
        const usageDailyRef = db.collection("usage_daily").doc(`${userId}_${dateKey}`);
        const now = admin.firestore.Timestamp.now();
        const increment = admin.firestore.FieldValue.increment(creditsNum);

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.exists ? userDoc.data() : {};

            if (!userDoc.exists) {
                transaction.set(userRef, {
                    email: req.user?.email || "unknown",
                    createdAt: now,
                    updatedAt: now,
                    isActive: true,
                    isSuspended: false,
                    creditsBalance: 0,
                    creditsLifetime: 0,
                    creditsUpdatedAt: now,
                });
            }

            if (userData?.isSuspended) {
                throw new Error("Account is suspended");
            }

            const currentBalance = userData?.creditsBalance || 0;
            if (currentBalance < creditsNum) {
                throw new Error("Insufficient credits");
            }

            transaction.update(userRef, {
                creditsBalance: currentBalance - creditsNum,
                creditsUpdatedAt: now,
                updatedAt: now,
            });

            transaction.set(ledgerRef, {
                userId,
                amount: -creditsNum,
                productId,
                reason: "GENERATION",
                timestamp: now,
            });

            transaction.set(usageEventRef, {
                userId,
                productId,
                creditsSpent: creditsNum,
                timestamp: now,
            });

            transaction.set(
                usageDailyRef,
                {
                    userId,
                    date: dateKey,
                    totals: {[productId]: increment},
                    totalCredits: increment,
                    updatedAt: now,
                },
                {merge: true}
            );
        });

        await db.collection("transactions").add({
            userId,
            type: "CREDITS_SPENT",
            productIds: [productId],
            creditsSpent: creditsNum,
            timestamp: now,
            performedBy: "user",
            metadata: {source: "generation"},
        });

        return sendSuccess(res, {userId, productId, creditsSpent: creditsNum});
    } catch (error) {
        logger.error("consumeCredits error:", error);
        const message = error.message || "Failed to consume credits";
        return sendError(res, message === "Insufficient credits" ? 400 : 500, message);
    }
}

async function grant(req, res) {
    const db = admin.firestore();
    const {userId, credits, reason = "ADMIN_GRANT", productId = null} = req.body;

    try {
        validate(req.body, ["userId", "credits"]);

        const creditsNum = parseInt(credits);
        if (isNaN(creditsNum) || creditsNum === 0) {
            return sendError(res, 400, "Credits must be a non-zero number");
        }

        if (productId && !PRODUCT_IDS.includes(productId)) {
            return sendError(res, 400, `Invalid product: ${productId}`);
        }

        const userRef = db.collection("users").doc(userId);
        const ledgerRef = db.collection("credit_ledger").doc();
        const now = admin.firestore.Timestamp.now();
        const increment = admin.firestore.FieldValue.increment(creditsNum);

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.exists ? userDoc.data() : {};
            const currentBalance = userData?.creditsBalance || 0;
            const currentLifetime = userData?.creditsLifetime || 0;

            if (!userDoc.exists) {
                transaction.set(userRef, {
                    email: "unknown",
                    createdAt: now,
                    updatedAt: now,
                    isActive: true,
                    isSuspended: false,
                    creditsBalance: 0,
                    creditsLifetime: 0,
                    creditsUpdatedAt: now,
                });
            }

            transaction.update(userRef, {
                creditsBalance: currentBalance + creditsNum,
                creditsLifetime: currentLifetime + Math.max(creditsNum, 0),
                creditsUpdatedAt: now,
                updatedAt: now,
            });

            transaction.set(ledgerRef, {
                userId,
                amount: creditsNum,
                productId,
                reason,
                timestamp: now,
                performedBy: "admin",
            });
        });

        await db.collection("transactions").add({
            userId,
            type: creditsNum > 0 ? "CREDITS_GRANTED" : "CREDITS_DEDUCTED",
            productIds: productId ? [productId] : [],
            creditsGranted: creditsNum,
            timestamp: now,
            performedBy: "admin",
            metadata: {reason},
        });

        logger.info(`Admin adjusted credits: ${userId} ${creditsNum}`);
        return sendSuccess(res, {userId, credits: creditsNum});
    } catch (error) {
        logger.error("grantCredits error:", error);
        return sendError(res, 500, error.message || "Failed to grant credits");
    }
}

module.exports = {getBalance, getUsage, consume, grant};
