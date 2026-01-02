const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();

const app = express();

// Configure CORS - Add your production domains here
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        // Add your production domains:
        // 'https://your-admin-panel-domain.com',
        // 'https://your-production-domain.com',
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({limit: "1mb"}));

// Health check
app.get("/health", (req, res) => res.json({status: "ok"}));

// Routes
app.use("/licenses", require("./routes/licenses"));
app.use("/subscriptions", require("./routes/subscriptions"));
app.use("/users", require("./routes/users"));
app.use("/webhooks", require("./routes/webhooks"));

// Global error handler
app.use((err, req, res, next) => {
    const logger = require("firebase-functions/logger");
    logger.error("Unhandled error:", err);
    res.status(500).json({success: false, error: "Internal server error"});
});

exports.api = functions.https.onRequest(app);