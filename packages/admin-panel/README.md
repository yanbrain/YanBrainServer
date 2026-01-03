# YanBrain Admin Panel

Admin dashboard for managing users, licenses, and transactions in the YanBrain platform.

## Setup

### 1. Install Dependencies

From the project root:
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cd packages/admin-panel
cp .env.local.example .env.local
```

Then edit `.env.local` and fill in your Firebase credentials:

#### Firebase Configuration (Client)
Get these from Firebase Console > Project Settings > General:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

#### Firebase Admin SDK (Server)
Get these from Firebase Console > Project Settings > Service Accounts > Generate New Private Key:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

#### NextAuth
Generate a secret:
```bash
openssl rand -base64 32
```

Add to `.env.local`:
- `NEXTAUTH_SECRET` - Use the generated secret above
- `NEXTAUTH_URL` - http://localhost:3000 (for development)

### 3. Run Development Server

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

This is usually caused by missing environment variables. Make sure:

1. ✅ Dependencies are installed (`npm install` from root)
2. ✅ `.env.local` file exists with all required variables
3. ✅ Firebase credentials are valid
4. ✅ You have an admin user in Firebase with custom claims `{admin: true}`

### Cannot Login

1. Check that your user exists in Firebase Authentication
2. Verify the user has admin custom claims set:
   ```javascript
   // Use Firebase Admin SDK or Functions to set claims
   admin.auth().setCustomUserClaims(uid, { admin: true })
   ```

### Authentication Errors

Check the browser console for detailed error messages. Common issues:
- Invalid Firebase API key
- Missing or incorrect NEXTAUTH_SECRET
- User doesn't have admin permissions

## Architecture

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js with Firebase
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Database**: Firebase Firestore (via Firebase Admin SDK)

## Features

- User management
- License management
- Transaction tracking
- Role-based access control
- Password reset functionality
