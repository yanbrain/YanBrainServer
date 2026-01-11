import * as admin from "firebase-admin";
import {Request, Response, NextFunction} from "express";
import {sendError} from "../utils/validation";
import * as logger from "firebase-functions/logger";

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, 401, "Missing authorization token");
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken.admin) {
      return sendError(res, 403, "Admin access required");
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error("Auth error:", error);
    return sendError(res, 401, "Invalid or expired token");
  }
}

export async function requireUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, 401, "Missing authorization token");
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error("Auth error:", error);
    return sendError(res, 401, "Invalid or expired token");
  }
}
