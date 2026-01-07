# Admin access

## Create account (commands)
1) Create the user in Firebase Auth (Console → Authentication → Users) and copy the **UID**.
2) Download a service account key JSON (Console → Project Settings → Service Accounts → Generate new private key).
   Save it locally as `serviceAccount.json` (do **not** commit it).

Run from the repo root:

```bash
node -e "const admin=require('firebase-admin');admin.initializeApp({credential:admin.credential.cert(require('./serviceAccount.json'))});(async()=>{const uid=process.argv[1];await admin.auth().setCustomUserClaims(uid,{admin:true});console.log('Admin claim set for',uid);process.exit(0);})().catch(err=>{console.error(err);process.exit(1);});" YOUR_UID_HERE
```

## Hard reset / recover admin (commands)
Use the same command above with the recovery user UID:

```bash
node -e "const admin=require('firebase-admin');admin.initializeApp({credential:admin.credential.cert(require('./serviceAccount.json'))});(async()=>{const uid=process.argv[1];await admin.auth().setCustomUserClaims(uid,{admin:true});console.log('Admin claim set for',uid);process.exit(0);})().catch(err=>{console.error(err);process.exit(1);});" YOUR_RECOVERY_UID_HERE
```

After setting the claim, sign out and sign back in so the new `admin` claim is picked up.
