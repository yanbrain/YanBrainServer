# DNS Setup Guide for yanbrain.com

This guide will walk you through connecting your Namecheap domain to Firebase Hosting.

## 📋 Overview

You will set up:
- **yanbrain.com** → Main website (packages/website)
- **www.yanbrain.com** → Redirects to main website
- **admin.yanbrain.com** → Admin panel (packages/admin-panel)

---

## Step 1: Configure Firebase Hosting Sites

### 1.1 Install Firebase CLI (if not installed)

```bash
npm install -g firebase-tools
firebase login
```

### 1.2 Create Hosting Sites in Firebase

Run these commands in your project root:

```bash
# Create the main website hosting site
firebase hosting:sites:create yanbrain-main

# Create the admin panel hosting site
firebase hosting:sites:create yanbrain-admin
```

**Note:** If these site names are taken, you can use alternatives like:
- `yanbrain-website-main`
- `yanbrain-admin-panel`

Just make sure to update the `site` values in `firebase.json` to match.

---

## Step 2: Add Custom Domains in Firebase Console

### 2.1 Go to Firebase Console

1. Visit https://console.firebase.google.com/
2. Select your project: **yan-play**
3. Go to **Hosting** in the left sidebar

### 2.2 Add Domain for Main Website

1. Click **Add custom domain**
2. Enter: `yanbrain.com`
3. Select site: **yanbrain-main**
4. Click **Continue**
5. Firebase will show you DNS records to add - **KEEP THIS PAGE OPEN**

### 2.3 Add Domain for www Subdomain

1. Click **Add custom domain** again
2. Enter: `www.yanbrain.com`
3. Select site: **yanbrain-main** (same as main)
4. Click **Continue**
5. Firebase will show you DNS records - **KEEP THIS PAGE OPEN**

### 2.4 Add Domain for Admin Panel

1. Click **Add custom domain** again
2. Enter: `admin.yanbrain.com`
3. Select site: **yanbrain-admin**
4. Click **Continue**
5. Firebase will show you DNS records - **KEEP THIS PAGE OPEN**

---

## Step 3: Configure DNS Records in Namecheap

### 3.1 Log into Namecheap

1. Go to https://www.namecheap.com/
2. Sign in to your account
3. Go to **Domain List**
4. Click **Manage** next to **yanbrain.com**

### 3.2 Access Advanced DNS Settings

1. Click the **Advanced DNS** tab
2. You'll see a list of DNS records

### 3.3 Add DNS Records from Firebase

Firebase will give you specific records. They typically look like this:

#### For yanbrain.com (Root Domain):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `151.101.1.195` | Automatic |
| **A** | `@` | `151.101.65.195` | Automatic |
| **TXT** | `@` | `[Firebase verification code]` | Automatic |

#### For www.yanbrain.com:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **CNAME** | `www` | `yanbrain.com` | Automatic |

**OR** (if Firebase provides A records):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **A** | `www` | `151.101.1.195` | Automatic |
| **A** | `www` | `151.101.65.195` | Automatic |

#### For admin.yanbrain.com:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **A** | `admin` | `151.101.1.195` | Automatic |
| **A** | `admin` | `151.101.65.195` | Automatic |
| **TXT** | `admin` | `[Firebase verification code]` | Automatic |

**IMPORTANT:**
- Use the **exact IP addresses and verification codes** provided by Firebase
- The IPs shown above are examples - Firebase will give you the correct ones
- You may need to add multiple A records for redundancy

### 3.4 Remove Conflicting Records

Before adding new records, **remove** any existing:
- A records for `@`, `www`, or `admin`
- CNAME records for `@`, `www`, or `admin`
- URL Redirect Records

### 3.5 Add the Records

1. Click **Add New Record**
2. For each record:
   - Select the **Type** (A, CNAME, or TXT)
   - Enter the **Host** (`@`, `www`, or `admin`)
   - Enter the **Value** (IP address or verification code)
   - Leave **TTL** as Automatic
   - Click the checkmark ✓
3. Click **Save all changes**

---

## Step 4: Verify DNS Configuration

### 4.1 Wait for DNS Propagation

- DNS changes can take **5-30 minutes** locally
- Global propagation can take up to **48 hours**
- Usually works within 1-2 hours

### 4.2 Check DNS Records

Use these commands to verify your DNS is set up correctly:

```bash
# Check yanbrain.com
dig yanbrain.com A

# Check www.yanbrain.com
dig www.yanbrain.com A

# Check admin.yanbrain.com
dig admin.yanbrain.com A

# Check TXT records for verification
dig yanbrain.com TXT
dig admin.yanbrain.com TXT
```

Or use an online tool: https://dnschecker.org/

### 4.3 Verify in Firebase Console

1. Go back to Firebase Console → Hosting
2. Under each domain, you should see:
   - ⏳ **Pending** → DNS propagation in progress
   - ✅ **Connected** → Domain is live!

---

## Step 5: SSL Certificate Provisioning

### 5.1 Automatic SSL

Firebase automatically provisions SSL certificates via Let's Encrypt.

**Timeline:**
- After DNS verification: **0-24 hours**
- Usually completes within: **1-2 hours**

### 5.2 Check SSL Status

In Firebase Console → Hosting → Custom domains:

- Look for "SSL certificate" status
- ⏳ **Provisioning** → In progress
- ✅ **Active** → SSL is live

### 5.3 Force HTTPS

Once SSL is active, Firebase automatically redirects HTTP to HTTPS.

---

## Step 6: Update Environment Variables

Before deploying, you **MUST** fill in your environment variables.

### 6.1 Admin Panel

Edit `packages/admin-panel/.env.production`:

```bash
# Generate a random secret (32+ characters)
openssl rand -base64 32

# Copy the output and paste it as NEXTAUTH_SECRET
```

Update these values:
- `NEXTAUTH_SECRET` - Use the generated secret above
- `NEXT_PUBLIC_FIREBASE_API_KEY` - From Firebase Console → Project Settings → Web API Key
- `FIREBASE_CLIENT_EMAIL` - From Firebase Console → Service Accounts
- `FIREBASE_PRIVATE_KEY` - From Firebase Console → Service Accounts

### 6.2 Website

Edit `packages/website/.env.production`:

- `NEXT_PUBLIC_FIREBASE_API_KEY` - From Firebase Console → Project Settings → Web API Key

---

## Step 7: Deploy Your Applications

### 7.1 Build Everything

```bash
npm run build
```

### 7.2 Deploy All at Once

```bash
npm run deploy
```

**OR** Deploy individually:

```bash
# Deploy only admin panel
npm run deploy:admin

# Deploy only website
npm run deploy:website

# Deploy only cloud functions
npm run deploy:functions
```

### 7.3 Verify Deployment

After deployment, visit:
- https://yanbrain.com (should load your website)
- https://www.yanbrain.com (should redirect to yanbrain.com)
- https://admin.yanbrain.com (should load admin panel)

---

## Step 8: Update Firebase Authentication

### 8.1 Add Authorized Domains

1. Go to Firebase Console → Authentication
2. Click **Settings** → **Authorized domains**
3. Add these domains:
   - `yanbrain.com`
   - `admin.yanbrain.com`

---

## 🚨 Troubleshooting

### DNS Not Propagating

**Check:**
```bash
# See current DNS for your domain
nslookup yanbrain.com

# Check from different DNS servers
nslookup yanbrain.com 8.8.8.8
```

**Solutions:**
- Wait 1-2 hours for DNS propagation
- Clear your local DNS cache: `sudo dnsmasq -k` (Mac) or `ipconfig /flushdns` (Windows)
- Try accessing from incognito mode or different device

### SSL Certificate Not Provisioning

**Reasons:**
- DNS not fully propagated yet
- Verification TXT record missing or incorrect
- Domain already has SSL elsewhere (conflicting certificates)

**Solutions:**
- Wait 24 hours after DNS verification
- Double-check TXT records in Namecheap
- Remove any Cloudflare or other proxy services temporarily

### "Site Not Found" Error

**Reasons:**
- Hosting site names don't match firebase.json
- Build folder is empty
- Deployment hasn't completed

**Solutions:**
- Check site names: `firebase hosting:sites:list`
- Verify `firebase.json` has correct site names
- Re-run: `npm run build && npm run deploy`

### Admin Panel Login Not Working

**Reasons:**
- NEXTAUTH_URL still points to localhost
- NEXTAUTH_SECRET not set
- CORS not allowing admin.yanbrain.com

**Solutions:**
- Verify `.env.production` has correct values
- Re-deploy: `npm run deploy:admin`
- Check Cloud Functions logs for CORS errors

---

## 📝 Quick Reference

### DNS Records Summary

```
Type    Host     Value (examples - use Firebase-provided values)
────────────────────────────────────────────────────────────────
A       @        151.101.1.195
A       @        151.101.65.195
TXT     @        [Firebase verification code]

A       www      151.101.1.195
A       www      151.101.65.195

A       admin    151.101.1.195
A       admin    151.101.65.195
TXT     admin    [Firebase verification code]
```

### Deployment Commands

```bash
npm run build              # Build all packages
npm run deploy             # Deploy everything
npm run deploy:admin       # Deploy only admin panel
npm run deploy:website     # Deploy only website
npm run deploy:functions   # Deploy only Cloud Functions
```

### Testing URLs

After setup:
- Main: https://yanbrain.com
- Admin: https://admin.yanbrain.com
- API: https://us-central1-yan-play.cloudfunctions.net/api/health

---

## ✅ Checklist

- [ ] Created Firebase hosting sites (yanbrain-main, yanbrain-admin)
- [ ] Added custom domains in Firebase Console
- [ ] Added A records for yanbrain.com in Namecheap
- [ ] Added A records for www.yanbrain.com in Namecheap
- [ ] Added A records for admin.yanbrain.com in Namecheap
- [ ] Added TXT verification records in Namecheap
- [ ] Waited for DNS propagation (1-2 hours)
- [ ] Verified DNS with dig or online tool
- [ ] Domains show "Connected" in Firebase Console
- [ ] SSL certificates provisioned and active
- [ ] Updated .env.production files with real values
- [ ] Generated NEXTAUTH_SECRET
- [ ] Built all packages (`npm run build`)
- [ ] Deployed to Firebase (`npm run deploy`)
- [ ] Added authorized domains in Firebase Authentication
- [ ] Tested all URLs (yanbrain.com, www, admin.yanbrain.com)
- [ ] Admin login works on admin.yanbrain.com
- [ ] API calls work from both domains

---

## 🎉 Done!

Your YanBrain platform is now live on your custom domain!

**Next Steps:**
- Set up monitoring and analytics
- Enable Firebase App Check for API security
- Configure email settings for password reset
- Set up payment webhooks with new domain
