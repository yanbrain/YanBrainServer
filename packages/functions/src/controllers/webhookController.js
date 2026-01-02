const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const {handleWebhookEvent} = require("../services/webhookHandlers");
const {sendError} = require("../utils/validation");

async function deduplicateWebhook(db, eventId) {
    const ref = db.collection("webhook_events").doc(eventId);
    return db.runTransaction(async (transaction) => {
        const doc = await transaction.get(ref);
        if (doc.exists) return true;
        transaction.set(ref, {processedAt: admin.firestore.FieldValue.serverTimestamp()});
        return false;
    });
}

async function findUserBySubscription(db, subscriptionId) {
    const doc = await db.collection("subscriptions").doc(subscriptionId).get();
    return doc.exists ? doc.data().userId : null;
}

const paypal = async (req, res) => {
    const db = admin.firestore();

    try {
        const event = req.body;
        const eventId = event.id;
        const subscriptionId = event.resource?.id;

        if (!eventId || !subscriptionId) {
            return sendError(res, 400, "Missing event ID or subscription ID");
        }

        const alreadyProcessed = await deduplicateWebhook(db, eventId);
        if (alreadyProcessed) {
            logger.info(`Duplicate webhook: ${eventId}`);
            return res.status(200).send("Already processed");
        }

        const userId = await findUserBySubscription(db, subscriptionId);

        if (!userId) {
            if (event.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
                logger.info(`Subscription activated before Unity: ${subscriptionId}`);
                return res.status(202).send("Deferred");
            }
            logger.warn(`User not found for subscription: ${subscriptionId}`);
            return res.status(404).send("User not found");
        }

        await handleWebhookEvent(db, event.event_type, userId, subscriptionId);
        res.status(200).send("OK");
    } catch (error) {
        logger.error("Webhook error:", error);
        res.status(500).send("Internal error");
    }
};

module.exports = {paypal};