const express = require("express");
const router = express.Router();
const licenseController = require("../controllers/licenseController");
const {requireAdmin} = require("../middleware/auth");

router.post("/check", licenseController.check);
router.post("/grant", requireAdmin, licenseController.grant);
router.delete("/:userId/:productId", requireAdmin, licenseController.revoke);

module.exports = router;