const express = require("express");
const {requireUser} = require("../middleware/auth");
const {getMe} = require("../controllers/meController");

const router = express.Router();

router.get("/", requireUser, getMe);

module.exports = router;
