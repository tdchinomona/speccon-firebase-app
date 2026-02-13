# 👤 How to Create Admin User - Step by Step

## Quick Guide

Follow these steps to create the admin user that can log in to your app.

---

## Step 1: Go to Firebase Console

1. Visit: https://console.firebase.google.com
2. Sign in with your Google account
3. Select your Firebase project

---

## Step 2: Enable Authentication (If Not Already Done)

1. In Firebase Console, click **"Authentication"** in left sidebar
2. If you see "Get started", click it
3. Click **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

✅ Authentication is now enabled!

---

## Step 3: Create User in Authentication

1. Still in **"Authentication"** section
2. Click **"Users"** tab (at the top)
3. Click **"Add user"** button (top right)
4. Fill in:
   - **Email:** `admin@speccon.com`
   - **Password:** `admin123` (or choose your own)
5. Click **"Add user"**

**IMPORTANT:** After creating, you'll see a UID (User ID). It looks like:
```
AbCdEfGhIjKlMnOpQrStUvWxYz123456
```

**📋 COPY THIS UID** - You'll need it in the next step!

✅ User created in Authentication!

**📖 For detailed instructions on finding and copying the UID, see: `STEP1_GET_USER_UID.md`**

---

## Step 4: Create User Profile in Firestore

**This step is critical!** Without this, login will fail.

1. In Firebase Console, click **"Firestore Database"** in left sidebar

2. **If `users` collection doesn't exist:**
   - Click **"Start collection"**
   - **Collection ID:** Type `users`
   - Click **"Next"**

3. **Add the admin user document:**
   - **Document ID:** Paste the UID you copied from Step 3
     - ⚠️ **Important:** Use the UID as the document ID, NOT a random name!
   - Click **"Add field"** and add these fields:

| Field Name | Type | Value |
|------------|------|-------|
| `email` | string | `admin@speccon.com` |
| `firstName` | string | `Admin` |
| `lastName` | string | `User` |
| `role` | string | `admin` |

4. Click **"Save"**

✅ User profile created!

---

## Step 5: Verify Everything

### Check Authentication:
- Go to **Authentication** → **Users** tab
- You should see `admin@speccon.com` listed

### Check Firestore:
- Go to **Firestore Database**
- Click on **`users`** collection
- You should see a document with the UID as the document ID
- Click on it to verify it has: `email`, `firstName`, `lastName`, `role: "admin"`

---

## Step 6: Test Login

1. Go to your deployed app (Vercel URL)
2. You should see the login page
3. Enter:
   - **Email:** `admin@speccon.com`
   - **Password:** `admin123` (or the password you set)
4. Click **"Sign In"**

✅ You should be logged in and see the dashboard!

---

## Troubleshooting

### "User not found" error
- **Problem:** User doesn't exist in Authentication
- **Fix:** Go back to Step 3 and create the user

### "Wrong password" error
- **Problem:** Password is incorrect
- **Fix:** 
  - Option 1: Use the correct password
  - Option 2: Reset password in Firebase Console → Authentication → Users → Click on user → Reset password

### "Permission denied" error
- **Problem:** Firestore rules blocking access OR user profile missing
- **Fix:** 
  1. Make sure Step 4 is completed (user profile exists)
  2. Deploy Firestore rules: `firebase deploy --only firestore:rules`

### Login works but shows blank page
- **Problem:** User profile missing or incorrect
- **Fix:** Verify Step 4 - user document must exist in Firestore with correct fields

### "Firebase not configured" error
- **Problem:** Environment variables not set in Vercel
- **Fix:** Add all 6 Firebase environment variables in Vercel → Settings → Environment Variables

---

## Visual Guide

```
Firebase Console
├── Authentication
│   └── Users
│       └── admin@speccon.com (UID: AbCdEf...)
│
└── Firestore Database
    └── users (collection)
        └── AbCdEf... (document ID = UID)
            ├── email: "admin@speccon.com"
            ├── firstName: "Admin"
            ├── lastName: "User"
            └── role: "admin"
```

---

## Important Notes

1. **UID must match:** The Firestore document ID MUST be the same as the Authentication UID
2. **Role is important:** The `role: "admin"` field is used for permissions
3. **Both required:** You need BOTH Authentication user AND Firestore profile
4. **Case sensitive:** Field names are case-sensitive (`role` not `Role`)

---

## Quick Checklist

- [ ] Authentication enabled (Email/Password)
- [ ] User created in Authentication
- [ ] UID copied from Authentication
- [ ] User document created in Firestore
- [ ] Document ID = UID (exact match)
- [ ] All 4 fields added: email, firstName, lastName, role
- [ ] role = "admin" (lowercase)
- [ ] Tested login successfully

---

**Once all steps are complete, you should be able to log in! 🎉**
