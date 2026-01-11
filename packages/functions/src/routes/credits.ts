import {Router} from "express";
import * as creditController from "../controllers/creditController";
import {requireAdmin, requireUser} from "../middleware/auth";

const router = Router();

router.get("/balance", requireUser, creditController.getBalance);
router.get("/usage", requireUser, creditController.getUsage);
router.post("/consume", requireUser, creditController.consume);
router.post("/grant", requireAdmin, creditController.grant);

export default router;
