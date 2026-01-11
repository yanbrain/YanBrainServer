import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {validate, sendError, sendSuccess} from "../utils/validation";
import {PRODUCT_IDS, CREDIT_COSTS, ProductId} from "../config/constants";
import {AuthRequest} from "../middleware/auth";
import {Response} from "express";

function formatDateKey(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

interface UsagePeriod {
  id: string;
  period: string;
  totals: Record<string, number>;
  totalCredits: number;
}

function normalizeUsagePeriod(doc: admin.firestore.QueryDocumentSnapshot): UsagePeriod {
  const data = doc.data();
  return {
    id: doc.id,
    period: data.period,
    totals: data.totals || {},
    totalCredits: data.totalCredits || 0,
  };
}

export async function getBalance(req: AuthRequest, res: Response): Promise<void> {
  const db = admin.firestore();
  const userId = req.user?.uid;

  if (!userId) return sendError(res, 401, "Unauthorized");

  const userDoc = await db.collection("users").doc(userId).get();
  const userData = userDoc.exists ? userDoc.data() : {};

  return sendSuccess(res, {
    userId,
    creditsBalance: userData?.creditsBalance || 0,
    creditsUpdatedAt: userData?.creditsUpdatedAt || null,
  });
}

export async function getUsage(req: AuthRequest, res: Response): Promise<void> {
  const db = admin.firestore();
  const userId = req.user?.uid;
  const limit = Math.min(parseInt(req.query.limit as string) || 6, 12);

  if (!userId) return sendError(res, 401, "Unauthorized");

  const usageSnap = await db
    .collection("usage")
    .where("userId", "==", userId)
    .orderBy("period", "desc")
    .limit(limit)
    .get();

  const usagePeriods = usageSnap.docs.map(normalizeUsagePeriod).reverse();

  const totalsByProduct = usagePeriods.reduce((acc: Record<string, number>, entry) => {
    Object.entries(entry.totals || {}).forEach(([productId, amount]) => {
      acc[productId] = (acc[productId] || 0) + Number(amount || 0);
    });
    return acc;
  }, {});

  const totalCredits = usagePeriods.reduce((sum, entry) => sum + Number(entry.totalCredits || 0), 0);

  return sendSuccess(res, {
    userId,
    totalsByProduct,
    totalCredits,
    usagePeriods,
  });
}

/**
 * Consume credits for a product
 *
 * IMPORTANT: The credit cost is determined server-side from CREDIT_COSTS.
 * Clients should ONLY send productId - the server will look up the cost.
 *
 * Request body:
 * {
 *   "productId": "yanDraw" | "yanPhotobooth" | "yanAvatar"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "userId": "abc123",
 *   "productId": "yanDraw",
 *   "creditsSpent": 1
 * }
 */
export async function consume(req: AuthRequest, res: Response): Promise<void> {
  const db = admin.firestore();
  const userId = req.user?.uid;
  const {productId} = req.body as {productId: string};

  try {
    if (!userId) return sendError(res, 401, "Unauthorized");
    validate(req.body, ["productId"]);

    // Validate product ID
    if (!PRODUCT_IDS.includes(productId as ProductId)) {
      return sendError(res, 400, `Invalid product: ${productId}`);
    }

    // Server determines credit cost - this is the single source of truth
    const creditsToConsume = CREDIT_COSTS[productId as ProductId];

    // Validate that we have a valid cost defined
    if (!creditsToConsume || creditsToConsume <= 0) {
      logger.error(`Invalid credit cost for product ${productId}: ${creditsToConsume}`);
      return sendError(res, 500, "Product credit cost not configured");
    }

    const userRef = db.collection("users").doc(userId);
    const periodKey = formatDateKey();
    const usageRef = db.collection("usage").doc(`${userId}_${periodKey}`);
    const now = admin.firestore.Timestamp.now();
    const increment = admin.firestore.FieldValue.increment(creditsToConsume);

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const userData = userDoc.exists ? userDoc.data() : {};

      // Create user document if it doesn't exist
      if (!userDoc.exists) {
        transaction.set(userRef, {
          email: req.user?.email || "unknown",
          createdAt: now,
          updatedAt: now,
          isActive: true,
          isSuspended: false,
          creditsBalance: 0,
          creditsUpdatedAt: now,
        });
      }

      // Check if account is suspended
      if (userData?.isSuspended) {
        throw new Error("Account is suspended");
      }

      // Check if user has enough credits
      const currentBalance = userData?.creditsBalance || 0;
      if (currentBalance < creditsToConsume) {
        throw new Error("Insufficient credits");
      }

      // Deduct credits from user balance
      transaction.update(userRef, {
        creditsBalance: currentBalance - creditsToConsume,
        creditsUpdatedAt: now,
        updatedAt: now,
      });

      // Track usage for analytics
      transaction.set(
        usageRef,
        {
          userId,
          period: periodKey,
          totals: {[productId]: increment},
          totalCredits: increment,
          updatedAt: now,
        },
        {merge: true}
      );
    });

    // Create transaction record after successful consumption
    await db.collection("transactions").add({
      userId,
      type: "CREDITS_SPENT",
      amount: creditsToConsume,
      productId,
      timestamp: now,
      performedBy: "user",
      metadata: {source: "generation"},
    });

    logger.info(`User ${userId} consumed ${creditsToConsume} credits for ${productId}`);
    return sendSuccess(res, {userId, productId, creditsSpent: creditsToConsume});
  } catch (error) {
    logger.error("consumeCredits error:", error);
    const message = (error as Error).message || "Failed to consume credits";
    return sendError(res, message === "Insufficient credits" ? 400 : 500, message);
  }
}

export async function grant(req: AuthRequest, res: Response): Promise<void> {
  const db = admin.firestore();
  const {userId, credits} = req.body;
  const reason = "ADMIN_GRANT";

  try {
    validate(req.body, ["userId", "credits"]);

    const creditsNum = parseInt(credits);
    if (isNaN(creditsNum) || creditsNum === 0) {
      return sendError(res, 400, "Credits must be a non-zero number");
    }

    const userRef = db.collection("users").doc(userId);
    const now = admin.firestore.Timestamp.now();

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const userData = userDoc.exists ? userDoc.data() : {};
      const currentBalance = userData?.creditsBalance || 0;

      if (!userDoc.exists) {
        transaction.set(userRef, {
          email: "unknown",
          createdAt: now,
          updatedAt: now,
          isActive: true,
          isSuspended: false,
          creditsBalance: 0,
          creditsUpdatedAt: now,
        });
      }

      transaction.update(userRef, {
        creditsBalance: currentBalance + creditsNum,
        creditsUpdatedAt: now,
        updatedAt: now,
      });
    });

    // Create transaction record after successful grant
    await db.collection("transactions").add({
      userId,
      type: creditsNum > 0 ? "CREDITS_GRANTED" : "CREDITS_DEDUCTED",
      amount: creditsNum,
      reason,
      timestamp: now,
      performedBy: "admin",
      metadata: {reason},
    });

    logger.info(`Admin adjusted credits: ${userId} ${creditsNum}`);
    return sendSuccess(res, {userId, credits: creditsNum});
  } catch (error) {
    logger.error("grantCredits error:", error);
    const message = (error as Error).message || "Failed to grant credits";
    return sendError(res, 500, message);
  }
}
