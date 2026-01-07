const admin = require("firebase-admin");

const uid = process.argv[2];
if (!uid) {
    console.error("Usage: node packages/admindash/scripts/set-admin.js <UID>");
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(require("../serviceAccount.json")),
});

(async () => {
    await admin.auth().setCustomUserClaims(uid, {admin: true});
    console.log("Admin claim set for", uid);
    process.exit(0);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
