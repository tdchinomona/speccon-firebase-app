# 🔐 Troubleshooting Login Issues

## Common Login Problems & Solutions

### Problem: Cannot login with admin credentials

**Possible causes:**
1. Admin user doesn't exist in Firebase Authentication
2. User profile doesn't exist in Firestore
3. Firebase configuration is incorrect
4. Firestore security rules blocking access

---

## ✅ Step-by-Step Fix

### Step 1: Check Firebase Configuration

**Verify environment variables are set in Vercel:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all 6 variables are set:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`

**If missing:** Add them and redeploy

---

### Step 2: Create Admin User in Firebase Authentication

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project

2. **Open Authentication**
   - Click **"Authentication"** in left sidebar
   - Click **"Users"** tab

3. **Add User**
   - Click **"Add user"** button
   - **Email:** `admin@speccon.com`
   - **Password:** `admin123` (or your preferred password)
   - Click **"Add user"**

4. **Copy the UID**
   - After creating user, you'll see a UID (looks like: `AbCdEfGhIjKlMnOpQrSt`)
   - **Copy this UID** - you'll need it in Step 3

✅ **User created in Authentication!**

---

### Step 3: Create User Profile in Firestore

**This is critical!** The app needs a user profile in Firestore to work.

1. **Go to Firestore Database**
   - In Firebase Console, click **"Firestore Database"** in left sidebar

2. **Create Users Collection**
   - Click **"Start collection"** (if `users` doesn't exist)
   - **Collection ID:** `users`
   - Click **"Next"**

3. **Add Admin User Document**
   - **Document ID:** Paste the UID you copied in Step 2
   - **Add fields:**

| Field | Type | Value |
|-------|------|-------|
| `email` | string | `admin@speccon.com` |
| `firstName` | string | `Admin` |
| `lastName` | string | `User` |
| `role` | string | `admin` |

4. **Save**
   - Click **"Save"**

✅ **User profile created!**

---

### Step 4: Verify Firestore Security Rules

1. **Check Rules are Deployed**
   - In Firebase Console → Firestore Database → Rules tab
   - Verify rules allow authenticated users to read `users` collection

2. **Deploy Rules (if needed)**
   ```powershell
   firebase login
   firebase deploy --only firestore:rules
   ```

---

### Step 5: Test Login

1. **Go to your deployed app**
   - Visit your Vercel URL
   - You should see the login page

2. **Try logging in**
   - Email: `admin@speccon.com`
   - Password: `admin123` (or the password you set)

3. **Check browser console**
   - Press F12 to open developer tools
   - Look for any error messages
   - Check the Console tab for Firebase errors

---

## 🔍 Debugging Steps

### Check Browser Console

1. Open your app in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to login
5. Look for error messages

**Common errors:**

**"Firebase: Error (auth/user-not-found)"**
- User doesn't exist in Firebase Authentication
- **Fix:** Create user in Step 2

**"Firebase: Error (auth/wrong-password)"**
- Wrong password
- **Fix:** Reset password in Firebase Console → Authentication → Users

**"Firebase: Error (auth/invalid-email)"**
- Invalid email format
- **Fix:** Use valid email format

**"Permission denied"**
- Firestore rules blocking access
- **Fix:** Deploy Firestore rules (Step 4)

**"Firebase not configured"**
- Environment variables missing
- **Fix:** Add environment variables in Vercel (Step 1)

---

### Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for failed requests (red)
5. Check error details

---

### Verify Firebase Connection

1. Open browser console (F12)
2. Type: `window.location.href`
3. Check if you're on the correct domain
4. Check if Firebase config is loaded:
   - Look for any Firebase-related errors
   - Check if `REACT_APP_FIREBASE_*` variables are accessible

---

## 🛠️ Quick Fix Script

If you have Firebase CLI set up, you can use this script to create the admin user:

**Note:** This requires Firebase Admin SDK setup. For most users, manual setup (Steps 2-3) is easier.

---

## 📋 Checklist

Before reporting issues, verify:

- [ ] Firebase project is created
- [ ] Authentication is enabled (Email/Password)
- [ ] Admin user exists in Authentication
- [ ] User profile exists in Firestore `users` collection
- [ ] User profile has `role: "admin"` field
- [ ] Firestore security rules are deployed
- [ ] Environment variables are set in Vercel
- [ ] App is redeployed after adding environment variables
- [ ] Browser console shows no errors
- [ ] Using correct email and password

---

## 🆘 Still Not Working?

### Option 1: Create User via App (If Registration Works)

If registration is enabled, you can:
1. Create a new account through the app
2. Then manually update the user role in Firestore to "admin"

### Option 2: Reset Everything

1. Delete user from Firebase Authentication
2. Delete user document from Firestore
3. Follow Steps 2-3 again to recreate

### Option 3: Check Firebase Console Logs

1. Go to Firebase Console
2. Check **"Authentication"** → **"Users"** - user should be listed
3. Check **"Firestore Database"** → **"users"** collection - document should exist
4. Check for any error messages in Firebase Console

---

## 💡 Pro Tips

1. **Always create user in Authentication FIRST**, then create profile in Firestore
2. **UID must match** - The Firestore document ID must be the same as the Authentication UID
3. **Role field is important** - Make sure `role: "admin"` is set for admin users
4. **Clear browser cache** - Sometimes old cached data causes issues
5. **Check environment variables** - They must be set in Vercel, not just locally

---

## 📞 Need More Help?

If you've tried everything:
1. Check browser console for specific error messages
2. Verify Firebase Console shows user exists
3. Verify Firestore has user profile
4. Check Vercel deployment logs for build errors
5. Verify environment variables are correct

---

**Most common issue:** User profile missing in Firestore. Make sure Step 3 is completed! ✅
