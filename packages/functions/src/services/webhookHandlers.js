const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

// Constants
const PRODUCT_IDS = ["yanAvatar", "yanDraw", "yanPhotobooth"];
const SUBSCRIPTION_DAYS = 30;
const SUBSCRIPTION_CREDITS = 100;

async function handleWebhookEvent(db, eventType, userId, subscriptionId) {
    logger.info(`Webhook: ${eventType} for ${userId}`);

    const handlers = {
        "BILLING.SUBSCRIPTION.RENEWED": () => renewSubscription(db, userId, subscriptionId),
        "PAYMENT.SALE.COMPLETED": () => renewSubscription(db, userId, subscriptionId),
        "BILLING.SUBSCRIPTION.CANCELLED": () => updateSubscriptionStatus(db, userId, subscriptionId, "CANCELLED"),
        "BILLING.SUBSCRIPTION.SUSPENDED": () => updateSubscriptionStatus(db, userId, subscriptionId, "SUSPENDED"),
        "BILLING.SUBSCRIPTION.EXPIRED": () => expireSubscription(db, userId, subscriptionId),
        "PAYMENT.SALE.REVERSED": () => handleChargeback(db, userId, subscriptionId),
        "PAYMENT.SALE.REFUNDED": () => handleChargeback(db, userId, subscriptionId),
        "PAYMENT.SALE.DENIED": () => handlePaymentFailure(db, userId, subscriptionId),
    };

    const handler = handlers[eventType];
    if (handler) {
        await handler();
    } else {
        logger.info(`Unhandled webhook: ${eventType}`);
    }
}

async function renewSubscription(db, userId, subscriptionId) {
    const [userDoc, subscriptionDoc] = await Promise.all([
        db.collection("users").doc(userId).get(),
        db.collection("subscriptions").doc(subscriptionId).get(),
    ]);

    if (!subscriptionDoc.exists) {
        logger.warn(`Missing data for renewal: ${userId}`);
        return;
    }

    const userData = userDoc.exists ? userDoc.data() : {};
    const subscription = subscriptionDoc.data();
    const linkedProducts = subscription.linkedProducts || PRODUCT_IDS;

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();
    const currentBalance = userData.creditsBalance || 0;
    const currentLifetime = userData.creditsLifetime || 0;
    const nextBillingDate = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + SUBSCRIPTION_DAYS * 86400000)
    );

    batch.set(db.collection("users").doc(userId), {
        creditsBalance: currentBalance + SUBSCRIPTION_CREDITS,
        creditsLifetime: currentLifetime + SUBSCRIPTION_CREDITS,
        creditsUpdatedAt: now,
        updatedAt: now,
    }, {merge: true});

    batch.update(db.collection("subscriptions").doc(subscriptionId), {
        currentPeriodEnd: nextBillingDate,
        nextBillingDate,
        status: "ACTIVE",
        updatedAt: now,
    });

    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "SUBSCRIPTION_RENEWED",
        subscriptionId,
        productIds: linkedProducts,
        daysGranted: 0,
        creditsGranted: SUBSCRIPTION_CREDITS,
        provider: subscription.provider,
        timestamp: now,
        performedBy: "paypal_webhook",
        metadata: {plan: subscription.plan, credits: SUBSCRIPTION_CREDITS},
    });

    await batch.commit();
    logger.info(`Subscription renewed: ${userId}/${subscriptionId}`);
}

async function updateSubscriptionStatus(db, userId, subscriptionId, status) {
    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.update(db.collection("subscriptions").doc(subscriptionId), {status, updatedAt: now});
    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "SUBSCRIPTION_STATUS_CHANGED",
        subscriptionId,
        productIds: [],
        daysGranted: 0,
        timestamp: now,
        performedBy: "paypal_webhook",
        metadata: {newStatus: status},
    });

    await batch.commit();
    logger.info(`Subscription status updated: ${userId}/${subscriptionId} - ${status}`);
}

async function expireSubscription(db, userId, subscriptionId) {
    const subscriptionDoc = await db.collection("subscriptions").doc(subscriptionId).get();
    if (!subscriptionDoc.exists) return;

    const subscription = subscriptionDoc.data();
    const linkedProducts = subscription?.linkedProducts || PRODUCT_IDS;

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.update(db.collection("subscriptions").doc(subscriptionId), {status: "EXPIRED", updatedAt: now});
    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "SUBSCRIPTION_EXPIRED",
        subscriptionId,
        productIds: linkedProducts,
        daysGranted: 0,
        timestamp: now,
        performedBy: "paypal_webhook",
        metadata: {reason: "expired"},
    });

    await batch.commit();
    logger.info(`Subscription expired: ${userId}/${subscriptionId}`);
}

async function handleChargeback(db, userId, subscriptionId) {
    const subscriptionDoc = await db.collection("subscriptions").doc(subscriptionId).get();
    if (!subscriptionDoc.exists) return;

    const subscription = subscriptionDoc.data();
    const linkedProducts = subscription?.linkedProducts || PRODUCT_IDS;

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.update(db.collection("subscriptions").doc(subscriptionId), {status: "CHARGEBACK", updatedAt: now});
    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "CHARGEBACK",
        subscriptionId,
        productIds: linkedProducts,
        daysGranted: 0,
        timestamp: now,
        performedBy: "paypal_webhook",
        metadata: {reason: "payment_reversed"},
    });

    await batch.commit();
    logger.warn(`Chargeback processed: ${userId}/${subscriptionId}`);
}

async function handlePaymentFailure(db, userId, subscriptionId) {
    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();

    batch.update(db.collection("subscriptions").doc(subscriptionId), {
        status: "PAYMENT_FAILED",
        updatedAt: now,
    });

    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "PAYMENT_FAILED",
        subscriptionId,
        productIds: [],
        daysGranted: 0,
        timestamp: now,
        performedBy: "paypal_webhook",
        metadata: {reason: "payment_denied"},
    });

    await batch.commit();
    logger.warn(`Payment failed: ${userId}/${subscriptionId}`);
}

module.exports = {handleWebhookEvent};
