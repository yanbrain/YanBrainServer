import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/validation";

/**
 * Internal service-to-service authentication.
 *
 * Protects sensitive endpoints (like cost-based spending) so public clients
 * cannot call them directly even if they have a valid Firebase ID token.
 */
export function requireInternalService(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const provided = req.headers["x-yanbrain-internal-secret"];
    const expected = process.env.YANBRAIN_INTERNAL_SECRET;

    if (!expected) {
        return sendError(res, 500, "Internal secret not configured");
    }

    if (!provided || provided !== expected) {
        return sendError(res, 403, "Forbidden");
    }

    next();
}
