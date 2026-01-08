const {HttpsError} = require("firebase-functions/v2/https");

function validate(data, fields) {
    const missing = fields.filter((f) => !data[f]);
    if (missing.length) {
        throw new HttpsError("invalid-argument", `Missing: ${missing.join(", ")}`);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        throw new HttpsError("invalid-argument", "Invalid email format");
    }
    return email.toLowerCase().trim();
}

function sanitize(str) {
    return String(str).trim();
}

function sendError(res, statusCode, message) {
    res.status(statusCode).json({success: false, error: message});
}

function sendSuccess(res, data) {
    res.status(200).json({success: true, ...data});
}

function asyncHandler(fn) {
    return async (req, res) => {
        try {
            await fn(req, res);
        } catch (error) {
            const logger = require("firebase-functions/logger");
            logger.error("Handler error:", error);

            if (error instanceof HttpsError) {
                return sendError(res, 400, error.message);
            }

            return sendError(res, 500, "Internal server error");
        }
    };
}

module.exports = {
    validate,
    validateEmail,
    sanitize,
    sendError,
    sendSuccess,
    asyncHandler,
};
