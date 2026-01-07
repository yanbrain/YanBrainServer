const express = require("express");
const admin = require("firebase-admin");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const {asyncHandler, sendError, sendSuccess, validateEmail} = require("../utils/validation");

const breakglassSecret = defineSecret("BREAKGLASS_SECRET");
const breakglassAllowlist = defineSecret("BREAKGLASS_ALLOWLIST");

const router = express.Router();

function getBreakglassConfig() {
    const secret = breakglassSecret.value() || process.env.BREAKGLASS_SECRET || "";
    const allowlistRaw = breakglassAllowlist.value() || process.env.BREAKGLASS_ALLOWLIST || "";
    const allowlist = allowlistRaw
        .split(",")
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean);

    return {secret, allowlist};
}

router.post(
    "/breakglass",
    asyncHandler(async (req, res) => {
        const {secret, allowlist} = getBreakglassConfig();
        const providedSecret = req.get("x-breakglass-secret");

        if (!secret || !allowlist.length) {
            logger.error("Breakglass config missing. Set BREAKGLASS_SECRET and BREAKGLASS_ALLOWLIST.");
            return sendError(res, 503, "Breakglass config not available");
        }

        if (!providedSecret || providedSecret !== secret) {
            logger.warn("Breakglass denied: invalid secret", {ip: req.ip});
            return sendError(res, 401, "Unauthorized");
        }

        const email = validateEmail(req.body?.email || "");
        if (!allowlist.includes(email)) {
            logger.warn("Breakglass denied: email not allowlisted", {email, ip: req.ip});
            return sendError(res, 403, "Email not allowlisted");
        }

        const userRecord = await admin.auth().getUserByEmail(email);
        const existingClaims = userRecord.customClaims || {};
        const updatedClaims = {...existingClaims, admin: true};

        await admin.auth().setCustomUserClaims(userRecord.uid, updatedClaims);

        await admin.firestore().collection("admin_audit").add({
            action: "breakglass_grant",
            email,
            uid: userRecord.uid,
            ip: req.ip,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info("Breakglass admin claim granted", {email, uid: userRecord.uid});
        return sendSuccess(res, {uid: userRecord.uid, email});
    })
);

module.exports = router;
