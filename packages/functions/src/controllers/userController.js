const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const {
    validate,
    validateEmail,
    sanitize,
    sendError,
    sendSuccess,
    asyncHandler,
} = require("../utils/validation");

const getUser = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const {userId} = req.params;

    if (!userId) return sendError(res, 400, "User ID required");

    const [userDoc, transactionsSnap, subscriptionsSnap, usageSnap] = await Promise.all([
        db.collection("users").doc(userId).get(),
        db.collection("transactions").where("userId", "==", userId).orderBy("timestamp", "desc").limit(50).get(),
        db.collection("subscriptions").where("userId", "==", userId).get(),
        db.collection("usage_daily").where("userId", "==", userId).orderBy("date", "desc").limit(30).get(),
    ]);

    if (!userDoc.exists) return sendError(res, 404, "User not found");

    return sendSuccess(res, {
        user: {id: userId, ...userDoc.data()},
        credits: {
            balance: userDoc.data().creditsBalance || 0,
            lifetime: userDoc.data().creditsLifetime || 0,
            updatedAt: userDoc.data().creditsUpdatedAt || null,
        },
        usage: usageSnap.docs.map((doc) => ({id: doc.id, ...doc.data()})),
        subscriptions: subscriptionsSnap.docs.map((doc) => ({id: doc.id, ...doc.data()})),
        transactions: transactionsSnap.docs.map((doc) => ({id: doc.id, ...doc.data()})),
    });
});

const listUsers = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const limit = Math.min(parseInt(req.query.limit) || 1000, 1000);

    const usersSnap = await db.collection("users").orderBy("createdAt", "desc").limit(limit).get();

    const users = await Promise.all(
        usersSnap.docs.map(async (userDoc) => {
            const creditsBalance = userDoc.data().creditsBalance || 0;

            return {
                id: userDoc.id,
                email: userDoc.data().email,
                createdAt: userDoc.data().createdAt,
                isSuspended: userDoc.data().isSuspended || false,
                creditsBalance,
            };
        })
    );

    return sendSuccess(res, {users, count: users.length});
});

const createUser = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const {userId, email, customData} = req.body;

    validate(req.body, ["userId", "email"]);
    const cleanEmail = validateEmail(email);
    const cleanUserId = sanitize(userId);

    const userRef = db.collection("users").doc(cleanUserId);
    const exists = await userRef.get();
    if (exists.exists) return sendError(res, 409, "User already exists");

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.set(userRef, {
        email: cleanEmail,
        createdAt: now,
        updatedAt: now,
        isActive: true,
        isSuspended: false,
        creditsBalance: 0,
        creditsLifetime: 0,
        creditsUpdatedAt: now,
        ...(customData || {}),
    });

    batch.set(db.collection("transactions").doc(), {
        userId: cleanUserId,
        type: "USER_CREATED",
        productIds: [],
        daysGranted: 0,
        timestamp: now,
        performedBy: "admin",
        metadata: {email: cleanEmail},
    });

    await batch.commit();

    logger.info(`Admin created user: ${cleanUserId}`);
    return sendSuccess(res, {userId: cleanUserId});
});

const updateUser = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const {userId} = req.params;
    const {email, customData} = req.body;

    validate(req.body, ["email"]);
    if (!userId) return sendError(res, 400, "User ID required");

    const cleanEmail = validateEmail(email);
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return sendError(res, 404, "User not found");

    await userRef.update({
        email: cleanEmail,
        updatedAt: admin.firestore.Timestamp.now(),
        ...(customData || {}),
    });

    logger.info(`Admin updated user: ${userId}`);
    return sendSuccess(res, {userId});
});

const deleteUser = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const {userId} = req.params;

    if (!userId) return sendError(res, 400, "User ID required");

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return sendError(res, 404, "User not found");

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.delete(userRef);

    const [subscriptionsSnap, rateLimitsSnap] = await Promise.all([
        db.collection("subscriptions").where("userId", "==", userId).get(),
        db.collection("rate_limits").where("userId", "==", userId).get(),
    ]);

    subscriptionsSnap.docs.forEach((doc) => batch.update(doc.ref, {status: "DELETED", updatedAt: now}));
    rateLimitsSnap.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();

    await db.collection("transactions").add({
        userId,
        type: "USER_DELETED",
        productIds: [],
        daysGranted: 0,
        timestamp: now,
        performedBy: "admin",
        metadata: {reason: "admin_deletion"},
    });

    logger.info(`Admin deleted user: ${userId}`);
    return sendSuccess(res, {userId});
});

const suspendUser = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const {userId} = req.params;

    if (!userId) return sendError(res, 400, "User ID required");

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return sendError(res, 404, "User not found");

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.update(userRef, {isSuspended: true, suspendedAt: now, updatedAt: now});

    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "ACCOUNT_SUSPENDED",
        productIds: [],
        daysGranted: 0,
        timestamp: now,
        performedBy: "admin",
        metadata: {reason: "admin_action"},
    });

    await batch.commit();

    logger.info(`Admin suspended user: ${userId}`);
    return sendSuccess(res, {userId});
});

const unsuspendUser = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const {userId} = req.params;

    if (!userId) return sendError(res, 400, "User ID required");

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return sendError(res, 404, "User not found");

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.update(userRef, {isSuspended: false, unsuspendedAt: now, updatedAt: now});

    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "ACCOUNT_UNSUSPENDED",
        productIds: [],
        daysGranted: 0,
        timestamp: now,
        performedBy: "admin",
        metadata: {reason: "admin_action"},
    });

    await batch.commit();

    logger.info(`Admin unsuspended user: ${userId}`);
    return sendSuccess(res, {userId});
});

module.exports = {
    getUser,
    listUsers,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    unsuspendUser,
};
