const admin = require("firebase-admin");
const {asyncHandler, sendError, sendSuccess} = require("../utils/validation");

function normalizeTimestamp(value) {
    if (!value) return null;
    if (typeof value.toDate === "function") {
        return value.toDate().toISOString();
    }
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "object" && typeof value._seconds === "number") {
        return new Date(value._seconds * 1000).toISOString();
    }
    return null;
}

function normalizeLicense(license) {
    if (!license || typeof license !== "object") return license;

    return {
        ...license,
        activatedAt: normalizeTimestamp(license.activatedAt),
        expiryDate: normalizeTimestamp(license.expiryDate),
        revokedAt: normalizeTimestamp(license.revokedAt),
    };
}

function normalizeCollection(documents) {
    return documents.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: normalizeTimestamp(data.createdAt),
            updatedAt: normalizeTimestamp(data.updatedAt),
            timestamp: normalizeTimestamp(data.timestamp),
            currentPeriodStart: normalizeTimestamp(data.currentPeriodStart),
            currentPeriodEnd: normalizeTimestamp(data.currentPeriodEnd),
            nextBillingDate: normalizeTimestamp(data.nextBillingDate),
        };
    });
}

const getMe = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const userId = req.user?.uid;

    if (!userId) return sendError(res, 401, "Unauthorized");

    const [userDoc, licenseDoc, transactionsSnap, subscriptionsSnap] = await Promise.all([
        db.collection("users").doc(userId).get(),
        db.collection("licenses").doc(userId).get(),
        db.collection("transactions").where("userId", "==", userId).orderBy("timestamp", "desc").limit(50).get(),
        db.collection("subscriptions").where("userId", "==", userId).get(),
    ]);

    const userData = userDoc.exists
        ? {id: userId, ...userDoc.data()}
        : {id: userId, email: req.user.email || null};

    const licensesData = licenseDoc.exists ? licenseDoc.data() : null;
    const normalizedLicenses = licensesData
        ? Object.fromEntries(
            Object.entries(licensesData).map(([productId, license]) => [
                productId,
                normalizeLicense(license),
            ])
        )
        : null;

    return sendSuccess(res, {
        user: {
            ...userData,
            createdAt: normalizeTimestamp(userData.createdAt),
            updatedAt: normalizeTimestamp(userData.updatedAt),
        },
        licenses: normalizedLicenses,
        subscriptions: normalizeCollection(subscriptionsSnap.docs),
        transactions: normalizeCollection(transactionsSnap.docs),
    });
});

module.exports = {getMe};
