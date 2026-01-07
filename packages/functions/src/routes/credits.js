const express = require("express");
const router = express.Router();
const creditController = require("../controllers/creditController");
const {requireAdmin, requireUser} = require("../middleware/auth");

router.get("/balance", requireUser, creditController.getBalance);
router.get("/usage", requireUser, creditController.getUsage);
router.post("/consume", requireUser, creditController.consume);
router.post("/grant", requireAdmin, creditController.grant);

module.exports = router;
