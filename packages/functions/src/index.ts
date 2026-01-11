import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

const app = express();

// NEW: Secret Manager (2nd gen) secret
// This reads the value securely at runtime.
const YANBRAIN_INTERNAL_SECRET = defineSecret("YANBRAIN_INTERNAL_SECRET");

// Configure CORS
const corsOptions = {
    origin: [
        "https://yanbrain.com",
        "https://www.yanbrain.com",
        "https://admin.yanbrain.com",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

// Routes
import creditsRoutes from "./routes/credits";
import usersRoutes from "./routes/users";
import meRoutes from "./routes/me";

app.use("/credits", creditsRoutes);
app.use("/users", usersRoutes);
app.use("/me", meRoutes);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
});

// IMPORTANT: grant this function access to the secret
export const api = onRequest({ secrets: [YANBRAIN_INTERNAL_SECRET] }, app);

// Firestore trigger - auto-grants 5 credits to new users
export { onUserCreated } from "./userTriggers";
