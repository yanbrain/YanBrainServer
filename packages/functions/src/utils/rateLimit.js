// Rate limit configuration
const RATE_LIMIT = {
    MAX: 10,
    WINDOW: 60, // seconds
};

async function checkRateLimit(db, userId, functionName) {
    const ref = db.collection("rate_limits").doc(`${userId}_${functionName}`);

    return db.runTransaction(async (transaction) => {
        const doc = await transaction.get(ref);
        const now = Date.now();

        if (!doc.exists) {
            transaction.set(ref, {count: 1, windowStart: now});
            return true;
        }

        const data = doc.data();
        const elapsed = (now - data.windowStart) / 1000;

        if (elapsed > RATE_LIMIT.WINDOW) {
            transaction.set(ref, {count: 1, windowStart: now});
            return true;
        }

        if (data.count >= RATE_LIMIT.MAX) return false;

        const admin = require("firebase-admin");
        transaction.update(ref, {count: admin.firestore.FieldValue.increment(1)});
        return true;
    });
}

module.exports = {checkRateLimit};