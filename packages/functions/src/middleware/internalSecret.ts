import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { YANBRAIN_INTERNAL_SECRET } from "../config/secrets";
import { sendError } from "../utils/validation";

const HEADER_NAME = "x-yanbrain-internal-secret";

/**
 * Require a backend-to-backend shared secret.
 * Put this ONLY on endpoints that must never be callable by user clients.
 */
export function requireInternalSecret(req: AuthRequest, res: Response, next: NextFunction): void {
    const got = String(req.headers[HEADER_NAME] || "");

    if (!got) {
        sendError(res, 401, "Missing internal secret");
        return;
    }

    // Secret Manager value at runtime:
    if (got !== YANBRAIN_INTERNAL_SECRET.value()) {
        sendError(res, 401, "Invalid internal secret");
        return;
    }

    next();
}