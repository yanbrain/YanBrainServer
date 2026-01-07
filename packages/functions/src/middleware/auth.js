const admin = require("firebase-admin");
const {sendError} = require("../utils/validation");
const logger = require("firebase-functions/logger");

async function requireAdmin(req, res, next) {
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

async function requireUser(req, res, next) {
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

module.exports = {requireAdmin, requireUser};
