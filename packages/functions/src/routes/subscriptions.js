const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

router.post("/create", subscriptionController.createSubscription);
router.post("/activate", subscriptionController.activate);
router.post("/cancel", subscriptionController.cancel);

module.exports = router;