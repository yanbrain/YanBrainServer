const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {requireAdmin} = require("../middleware/auth");

router.get("/", requireAdmin, userController.listUsers);
router.get("/:userId", requireAdmin, userController.getUser);
router.post("/", requireAdmin, userController.createUser);
router.patch("/:userId", requireAdmin, userController.updateUser);
router.delete("/:userId", requireAdmin, userController.deleteUser);
router.patch("/:userId/suspend", requireAdmin, userController.suspendUser);
router.patch("/:userId/unsuspend", requireAdmin, userController.unsuspendUser);

module.exports = router;