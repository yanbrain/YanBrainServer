const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const {validate, sendError, sendSuccess, asyncHandler, calculateExpiry} = require("../utils/validation");

// Constants
const PRODUCT_IDS = ["yanAvatar", "yanDraw", "yanPhotobooth"];
const SUBSCRIPTION_DAYS = 30;
const SUBSCRIPTION_CREDITS = 100;

function validateProduct(productId) {
    if (!PRODUCT_IDS.includes(productId)) {
        throw new Error(`Invalid product: ${productId}`);
    }
}

const createSubscription = asyncHandler(async (req, res) => {
    const {userId, email, productIds} = req.body;

    validate(req.body, ["userId", "email"]);

    const products = productIds || PRODUCT_IDS;
    products.forEach(validateProduct);

    const subscriptionId = `I-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const approvalUrl = `https://www.sandbox.paypal.com/webapps/billing/subscriptions?ba_token=${subscriptionId}`;

    const batch = admin.firestore().batch();
    const now = admin.firestore.Timestamp.now();

    batch.set(admin.firestore().collection("subscriptions").doc(subscriptionId), {
        userId,
        subscriptionId,
        provider: "PAYPAL",
        status: "PENDING_APPROVAL",
        plan: "standard",
        linkedProducts: products,
        createdAt: now,
        updatedAt: now,
    });

    batch.set(admin.firestore().collection("transactions").doc(), {
        userId,
        type: "SUBSCRIPTION_INITIATED",
        subscriptionId,
        productIds: products,
        daysGranted: 0,
        provider: "PAYPAL",
        timestamp: now,
        performedBy: "user",
        metadata: {email, status: "PENDING_APPROVAL"},
    });

    await batch.commit();

    logger.info(`Subscription created: ${subscriptionId}`);
    return sendSuccess(res, {subscriptionId, approvalUrl});
});

const activate = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const {userId, subscriptionId, provider, linkedProducts} = req.body;

    validate(req.body, ["userId", "subscriptionId", "provider"]);

    const subscriptionDoc = await db.collection("subscriptions").doc(subscriptionId).get();

    if (!subscriptionDoc.exists) return sendError(res, 404, "Subscription not found");

    const subscription = subscriptionDoc.data();
    if (subscription.userId !== userId) {
        return sendError(res, 403, "Subscription does not belong to user");
    }

    if (subscription.status === "ACTIVE") {
        return sendSuccess(res, {status: "ACTIVE", message: "Already active"});
    }

    const products = linkedProducts || subscription.linkedProducts || PRODUCT_IDS;
    products.forEach(validateProduct);

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const currentBalance = userData.creditsBalance || 0;
    const currentLifetime = userData.creditsLifetime || 0;

    batch.set(userRef, {
        creditsBalance: currentBalance + SUBSCRIPTION_CREDITS,
        creditsLifetime: currentLifetime + SUBSCRIPTION_CREDITS,
        creditsUpdatedAt: now,
        updatedAt: now,
    }, {merge: true});

    batch.update(db.collection("subscriptions").doc(subscriptionId), {
        status: "ACTIVE",
        linkedProducts: products,
        currentPeriodStart: now,
        currentPeriodEnd: calculateExpiry(SUBSCRIPTION_DAYS, admin),
        nextBillingDate: calculateExpiry(SUBSCRIPTION_DAYS, admin),
        updatedAt: now,
    });

    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "SUBSCRIPTION_ACTIVATED",
        subscriptionId,
        productIds: products,
        daysGranted: 0,
        creditsGranted: SUBSCRIPTION_CREDITS,
        provider,
        timestamp: now,
        performedBy: "user",
        metadata: {plan: subscription.plan || "standard", credits: SUBSCRIPTION_CREDITS},
    });

    await batch.commit();

    logger.info(`Subscription activated: ${userId}/${subscriptionId}`);
    return sendSuccess(res, {status: "ACTIVE", creditsGranted: SUBSCRIPTION_CREDITS});
});

const cancel = asyncHandler(async (req, res) => {
    const db = admin.firestore();
    const {userId, subscriptionId} = req.body;

    validate(req.body, ["userId", "subscriptionId"]);

    const subscriptionDoc = await db.collection("subscriptions").doc(subscriptionId).get();

    if (!subscriptionDoc.exists) return sendError(res, 404, "Subscription not found");

    const subscription = subscriptionDoc.data();
    if (subscription.userId !== userId) {
        return sendError(res, 403, "Subscription does not belong to user");
    }

    if (subscription.status === "CANCELLED") {
        return sendSuccess(res, {message: "Already cancelled"});
    }

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.update(db.collection("subscriptions").doc(subscriptionId), {
        status: "CANCELLED",
        updatedAt: now,
    });

    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "SUBSCRIPTION_CANCELLED",
        subscriptionId,
        productIds: [],
        daysGranted: 0,
        timestamp: now,
        performedBy: "user",
        metadata: {reason: "user_cancelled"},
    });

    await batch.commit();

    logger.info(`Subscription cancelled: ${userId}/${subscriptionId}`);
    return sendSuccess(res, {message: "Cancelled. Access remains until expiry."});
});

module.exports = {createSubscription, activate, cancel};
