import {Router} from "express";
import * as creditController from "../controllers/creditController";
import {requireAdmin, requireUser} from "../middleware/auth";
import {requireInternalService} from "../middleware/internal";

const router = Router();

// User-readable endpoints
router.get("/balance", requireUser, creditController.getBalance);
router.get("/usage", requireUser, creditController.getUsage);

// Existing productId-based spending (keep for web apps if you still use it)
router.post("/consume", requireUser, creditController.consume);

// New cost-based spending for YanBrainAPIClient (service-only)
router.post(
    "/consume-cost",
    requireUser,
    requireInternalService,
    creditController.consumeCost
);

// Admin only
router.post("/grant", requireAdmin, creditController.grant);

export default router;
