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
        };
    });
}

const getMe = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const userId = req.user?.uid;

    if (!userId) return sendError(res, 401, "Unauthorized");

    const [userDoc, transactionsSnap, usageSnap] = await Promise.all([
        db.collection("users").doc(userId).get(),
        db.collection("transactions").where("userId", "==", userId).get(),
        db.collection("usage").where("userId", "==", userId).get(),
    ]);

    const userData = userDoc.exists
        ? {id: userId, ...userDoc.data()}
        : {id: userId, email: req.user.email || null};

    // Sort and limit transactions in memory
    const sortedTransactions = transactionsSnap.docs
        .map((doc) => ({doc, timestamp: doc.data().timestamp}))
        .sort((a, b) => {
            const aTime = a.timestamp?._seconds || 0;
            const bTime = b.timestamp?._seconds || 0;
            return bTime - aTime;
        })
        .slice(0, 50)
        .map((item) => item.doc);

    // Sort and limit usage in memory
    const sortedUsage = usageSnap.docs
        .map((doc) => ({doc, period: doc.data().period}))
        .sort((a, b) => (b.period || "").localeCompare(a.period || ""))
        .slice(0, 6)
        .map((item) => item.doc);

    const usagePeriods = sortedUsage
        .map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                period: data.period,
                totals: data.totals || {},
                totalCredits: data.totalCredits || 0,
            };
        })
        .reverse();

    const totalsByProduct = usagePeriods.reduce((acc, entry) => {
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
            usagePeriods,
        },
        transactions: normalizeCollection(sortedTransactions),
    });
});

module.exports = {getMe};
