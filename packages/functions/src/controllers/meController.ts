import * as admin from "firebase-admin";
import {asyncHandler, sendError, sendSuccess} from "../utils/validation";
import {AuthRequest} from "../middleware/auth";
import {Response} from "express";

interface TimestampValue {
  toDate?: () => Date;
  _seconds?: number;
}

function normalizeTimestamp(value: TimestampValue | string | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "object" && typeof value.toDate === "function") {
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

function normalizeCollection(documents: admin.firestore.QueryDocumentSnapshot[]): Record<string, unknown>[] {
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

export const getMe = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const db = admin.firestore();
  const userId = req.user?.uid;

  if (!userId) return sendError(res, 401, "Unauthorized");

  const [userDoc, transactionsSnap, usageSnap] = await Promise.all([
    db.collection("users").doc(userId).get(),
    db.collection("transactions").where("userId", "==", userId).orderBy("timestamp", "desc").limit(50).get(),
    db.collection("usage").where("userId", "==", userId).orderBy("period", "desc").limit(6).get(),
  ]);

  const userData: any = userDoc.exists
    ? {id: userId, ...userDoc.data()}
    : {id: userId, email: req.user?.email || null};

  const usagePeriods = usageSnap.docs
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

  const totalsByProduct = usagePeriods.reduce((acc: Record<string, number>, entry) => {
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
      updatedAt: normalizeTimestamp(userData.creditsUpdatedAt),
    },
    usage: {
      totalsByProduct,
      usagePeriods,
    },
    transactions: normalizeCollection(transactionsSnap.docs),
  });
});
