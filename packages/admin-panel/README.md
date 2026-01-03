# YanBrain Admin Panel

Admin dashboard for managing users, licenses, and transactions in the YanBrain platform.

## Setup

### 1. Install Dependencies

From the project root:
```bash
npm install
```

### 2. Configure Environment Variables

The `.env.local` file should already be configured with your Firebase credentials. If not, create it with:

#### Firebase Configuration (Client)
Get these from Firebase Console > Project Settings > General:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_CLOUD_FUNCTIONS_URL`

#### Firebase Admin SDK (Server)
Get these from Firebase Console > Project Settings > Service Accounts > Generate New Private Key:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### 3. Set Up Admin User

Before you can log in, you need to create a user in Firebase with admin privileges:

```javascript
// Using Firebase Admin SDK or Cloud Functions
const admin = require('firebase-admin');

// Set custom claims for admin user
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

### 4. Run Development Server

From the project root:
```bash
npm run dev:admin
```

Or directly from this package:
```bash
cd packages/admin-panel
npm run dev
```

The admin panel will be available at [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Black Screen / Nothing Renders

This is usually caused by missing environment variables or dependencies. Make sure:

1. ✅ Dependencies are installed (`npm install` from root)
2. ✅ `.env.local` file exists with all required Firebase variables
3. ✅ Firebase credentials are valid
4. ✅ Firebase Auth is enabled in your Firebase project

### Cannot Login

1. **Check user exists**: Verify the user exists in Firebase Authentication
2. **Check admin claims**: Verify the user has admin custom claims set:
   ```javascript
   // Use Firebase Admin SDK or Functions to set claims
   admin.auth().setCustomUserClaims(uid, { admin: true })
   ```
3. **Check Firebase Auth is enabled**: Go to Firebase Console > Authentication > Sign-in method and ensure Email/Password is enabled

### "You do not have admin access" Error

The user exists but doesn't have admin privileges. Run this in your Firebase Functions or Admin SDK:

```javascript
await admin.auth().setCustomUserClaims(userId, { admin: true });
```

### Authentication Errors

Check the browser console for detailed error messages. Common issues:
- Invalid Firebase API key
- Wrong email or password
- User doesn't have admin custom claims
- Firebase Auth not enabled

## Architecture

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Firebase Auth with custom admin claims
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand + React Context
- **Database**: Firebase Firestore (via Firebase Admin SDK)
- **Session Management**: Firebase Auth tokens stored in cookies

## Authentication Flow

1. User logs in with email/password via Firebase Auth
2. System verifies user has `admin: true` custom claim
3. Firebase ID token is stored in secure cookies
4. Middleware checks auth cookie on all protected routes
5. Server actions use ID token from cookies for API calls

## Features

- User management
- License management
- Transaction tracking
- Role-based access control (admin claims)
- Password reset functionality
- Secure session management with Firebase tokens
