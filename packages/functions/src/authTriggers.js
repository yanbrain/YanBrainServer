const {onUserCreated} = require("firebase-functions/v2/identity");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

/**
 * Cloud Function triggered when a new user is created in Firebase Auth
 * Automatically creates user document and grants 5 starting credits
 */
exports.onAuthUserCreated = onUserCreated(async (event) => {
    const user = event.data;
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    const startingCredits = 5;

    try {
        const batch = db.batch();

        // Create user document in Firestore
        const userRef = db.collection("users").doc(user.uid);
        batch.set(userRef, {
            email: user.email,
            creditsBalance: startingCredits,
            createdAt: now,
            updatedAt: now,
            creditsUpdatedAt: now,
        });

        // Add credit ledger entry
        const ledgerRef = db.collection("credit_ledger").doc();
        batch.set(ledgerRef, {
            userId: user.uid,
            amount: startingCredits,
            reason: "WELCOME_BONUS",
            timestamp: now,
            performedBy: "system",
        });

        // Add transaction record
        const transactionRef = db.collection("transactions").doc();
        batch.set(transactionRef, {
            userId: user.uid,
            type: "CREDITS_GRANTED",
            creditsGranted: startingCredits,
            timestamp: now,
            performedBy: "system",
            metadata: {
                reason: "WELCOME_BONUS",
                source: "user_creation",
            },
        });

        await batch.commit();

        logger.info(`Successfully created user ${user.uid} with ${startingCredits} credits`);
    } catch (error) {
        logger.error(`Error creating user ${user.uid}:`, error);
        throw error;
    }
});