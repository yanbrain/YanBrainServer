import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

/**
 * Cloud Function triggered when a new user document is created in Firestore
 * Automatically grants 5 starting credits to new users
 */
export const onUserCreated = onDocumentCreated("users/{userId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.warn("No data associated with the event");
    return;
  }

  const userId = event.params.userId;
  const userData = snapshot.data();

  // Check if credits already set (avoid duplicate grants)
  if (userData.creditsBalance !== undefined && userData.creditsBalance !== null) {
    logger.info(`User ${userId} already has credits: ${userData.creditsBalance}`);
    return;
  }

  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();
  const startingCredits = 5;

  try {
    const batch = db.batch();

    // Update user document with starting credits
    batch.update(snapshot.ref, {
      creditsBalance: startingCredits,
      creditsUpdatedAt: now,
      updatedAt: now,
    });

    // Create transaction record
    const transactionRef = db.collection("transactions").doc();
    batch.set(transactionRef, {
      userId,
      type: "CREDITS_GRANTED",
      amount: startingCredits,
      reason: "WELCOME_BONUS",
      timestamp: now,
      performedBy: "system",
      metadata: {
        source: "user_creation",
      },
    });

    await batch.commit();

    logger.info(`Successfully granted ${startingCredits} credits to new user: ${userId}`);
  } catch (error) {
    logger.error(`Error granting credits to user ${userId}:`, error);
    throw error;
  }
});
