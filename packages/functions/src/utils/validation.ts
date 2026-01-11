import {HttpsError} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import * as logger from "firebase-functions/logger";

export function validate(data: Record<string, unknown>, fields: string[]): void {
  const missing = fields.filter((f) => !data[f]);
  if (missing.length) {
    throw new HttpsError("invalid-argument", `Missing: ${missing.join(", ")}`);
  }
}

export function validateEmail(email: string): string {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    throw new HttpsError("invalid-argument", "Invalid email format");
  }
  return email.toLowerCase().trim();
}

export function sanitize(str: string): string {
  return String(str).trim();
}

export function sendError(res: Response, statusCode: number, message: string): void {
  res.status(statusCode).json({success: false, error: message});
}

export function sendSuccess(res: Response, data: Record<string, unknown>): void {
  res.status(200).json({success: true, ...data});
}

export function asyncHandler(
  fn: (req: Request, res: Response) => Promise<void>
): (req: Request, res: Response) => Promise<void> {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      await fn(req, res);
    } catch (error) {
      logger.error("Handler error:", error);

      if (error instanceof HttpsError) {
        return sendError(res, 400, error.message);
      }

      return sendError(res, 500, "Internal server error");
    }
  };
}
