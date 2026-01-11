import {Router} from "express";
import * as userController from "../controllers/userController";
import {requireAdmin} from "../middleware/auth";

const router = Router();

router.get("/", requireAdmin, userController.listUsers);
router.get("/:userId", requireAdmin, userController.getUser);
router.post("/", requireAdmin, userController.createUser);
router.patch("/:userId", requireAdmin, userController.updateUser);
router.delete("/:userId", requireAdmin, userController.deleteUser);
router.patch("/:userId/suspend", requireAdmin, userController.suspendUser);
router.patch("/:userId/unsuspend", requireAdmin, userController.unsuspendUser);

export default router;
