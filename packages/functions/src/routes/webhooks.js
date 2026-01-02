const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

router.post("/paypal", webhookController.paypal);

module.exports = router;