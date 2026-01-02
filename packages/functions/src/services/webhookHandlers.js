const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

// Constants
const PRODUCT_IDS = ["yanAvatar", "yanDraw", "yanPhotobooth"];
const SUBSCRIPTION_DAYS = 30;

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
    const [licenseDoc, subscriptionDoc] = await Promise.all([
        db.collection("licenses").doc(userId).get(),
        db.collection("subscriptions").doc(subscriptionId).get(),
    ]);

    if (!licenseDoc.exists || !subscriptionDoc.exists) {
        logger.warn(`Missing data for renewal: ${userId}`);
        return;
    }

    const licenses = licenseDoc.data();
    const subscription = subscriptionDoc.data();
    const linkedProducts = subscription.linkedProducts || PRODUCT_IDS;

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();
    const updates = {};
    let newExpiry;

    linkedProducts.forEach((product) => {
        const license = licenses[product];
        if (license) {
            const date = license.expiryDate.toDate();
            date.setDate(date.getDate() + SUBSCRIPTION_DAYS);
            newExpiry = admin.firestore.Timestamp.fromDate(date);
            updates[`${product}.expiryDate`] = newExpiry;
            updates[`${product}.isActive`] = true;
        }
    });

    if (Object.keys(updates).length === 0) return;

    batch.update(db.collection("licenses").doc(userId), updates);
    batch.update(db.collection("subscriptions").doc(subscriptionId), {
        currentPeriodEnd: newExpiry,
        nextBillingDate: newExpiry,
        status: "ACTIVE",
        updatedAt: now,
    });

    batch.set(db.collection("transactions").doc(), {
        userId,
        type: "SUBSCRIPTION_RENEWED",
        subscriptionId,
        productIds: linkedProducts,
        daysGranted: SUBSCRIPTION_DAYS,
        provider: subscription.provider,
        timestamp: now,
        performedBy: "paypal_webhook",
        metadata: {plan: subscription.plan},
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
    const [licenseDoc, subscriptionDoc] = await Promise.all([
        db.collection("licenses").doc(userId).get(),
        db.collection("subscriptions").doc(subscriptionId).get(),
    ]);

    if (!licenseDoc.exists) return;

    const licenses = licenseDoc.data();
    const subscription = subscriptionDoc.data();
    const linkedProducts = subscription?.linkedProducts || PRODUCT_IDS;

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();
    const updates = {};

    linkedProducts.forEach((product) => {
        if (licenses[product]) updates[`${product}.isActive`] = false;
    });

    if (Object.keys(updates).length === 0) return;

    batch.update(db.collection("licenses").doc(userId), updates);
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
    const [licenseDoc, subscriptionDoc] = await Promise.all([
        db.collection("licenses").doc(userId).get(),
        db.collection("subscriptions").doc(subscriptionId).get(),
    ]);

    if (!licenseDoc.exists) return;

    const licenses = licenseDoc.data();
    const subscription = subscriptionDoc.data();
    const linkedProducts = subscription?.linkedProducts || PRODUCT_IDS;

    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();
    const updates = {};

    linkedProducts.forEach((product) => {
        if (licenses[product]) updates[`${product}.isActive`] = false;
    });

    if (Object.keys(updates).length === 0) return;

    batch.update(db.collection("licenses").doc(userId), updates);
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