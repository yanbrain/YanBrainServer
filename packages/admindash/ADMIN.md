# Admin access

## Create account (commands)
1) Create the user in Firebase Auth (Console → Authentication → Users) and copy the **UID**.
2) Download a service account key JSON (Console → Project Settings → Service Accounts → Generate new private key).
   Save it locally as `serviceAccount.json` in the repo root (do **not** commit it).

Run from the repo root:

```bash
node packages/admindash/scripts/set-admin.js YOUR_UID_HERE
```

## Hard reset / recover admin (commands)
Use the same command with the recovery user UID:

```bash
node packages/admindash/scripts/set-admin.js YOUR_RECOVERY_UID_HERE
```

After setting the claim, sign out and sign back in so the new `admin` claim is picked up.
