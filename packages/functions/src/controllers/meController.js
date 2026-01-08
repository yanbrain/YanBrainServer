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

    const [userDoc, transactionsSnap, usageSnap] = await Promise.all([
        db.collection("users").doc(userId).get(),
        db.collection("transactions").where("userId", "==", userId).orderBy("timestamp", "desc").limit(50).get(),
        db.collection("usage_daily").where("userId", "==", userId).orderBy("date", "desc").limit(30).get(),
    ]);

    const userData = userDoc.exists
        ? {id: userId, ...userDoc.data()}
        : {id: userId, email: req.user.email || null};

    const usageDaily = usageSnap.docs
        .map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                date: data.date,
                totals: data.totals || {},
                totalCredits: data.totalCredits || 0,
            };
        })
        .reverse();

    const totalsByProduct = usageDaily.reduce((acc, entry) => {
        Object.entries(entry.totals || {}).forEach(([productId, amount]) => {
            acc[productId] = (acc[productId] || 0) + Number(amount || 0);
        });
        return acc;
    }, {});

    return sendSuccess(res, {
        user: {
            ...userData,
            createdAt: normalizeTimestamp(userData.createdAt),
            updatedAt: normalizeTimestamp(userData.updatedAt),
        },
        credits: {
            balance: userData.creditsBalance || 0,
            lifetime: userData.creditsLifetime || 0,
            updatedAt: normalizeTimestamp(userData.creditsUpdatedAt),
        },
        usage: {
            totalsByProduct,
            usageDaily,
        },
        transactions: normalizeCollection(transactionsSnap.docs),
    });
});

module.exports = {getMe};
