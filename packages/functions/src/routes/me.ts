import {Router} from "express";
import {requireUser} from "../middleware/auth";
import {getMe} from "../controllers/meController";

const router = Router();

router.get("/", requireUser, getMe);

export default router;
