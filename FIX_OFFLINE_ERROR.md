# 🔧 Fix: "Failed to get document because client is offline"

## What This Error Means

This error occurs when:
1. **The user profile document doesn't exist in Firestore** (most common)
2. The app is trying to read a document that isn't there
3. Firestore is in offline mode and can't find the document

---

## ✅ Solution: Create the User Profile Document

The error happens because after you log in with Firebase Authentication, the app tries to read your user profile from Firestore, but it doesn't exist yet.

### Step-by-Step Fix

### Step 1: Get Your User UID

1. Go to Firebase Console: https://console.firebase.google.com
2. Click **Authentication** → **Users** tab
3. Find `admin@speccon.com` in the list
4. **Copy the UID** (the long string in the "User UID" column)
   - It looks like: `AbCdEfGhIjKlMnOpQrStUvWxYz123456`

📖 **For detailed instructions, see: `STEP1_GET_USER_UID.md`**

---

### Step 2: Create User Document in Firestore

1. **Go to Firestore Database**
   - In Firebase Console, click **"Firestore Database"** in left sidebar

2. **Check if `users` collection exists**
   - Look in the left panel for a collection called `users`
   - If you don't see it, you need to create it

3. **Create the collection (if needed)**
   - Click **"Start collection"** button
   - **Collection ID:** Type `users` (lowercase, exactly as shown)
   - Click **"Next"**

4. **Add the user document**
   - **Document ID:** Paste the UID you copied in Step 1
     - ⚠️ **CRITICAL:** The document ID MUST be the exact UID from Authentication
     - Don't use a random name - it must match the UID exactly!
   
   - **Add fields:** Click "Add field" for each:

| Field Name | Type | Value |
|------------|------|-------|
| `email` | string | `admin@speccon.com` |
| `firstName` | string | `Admin` |
| `lastName` | string | `User` |
| `role` | string | `admin` |

5. **Save the document**
   - Click **"Save"** button
   - You should see the document appear in the `users` collection

✅ **User profile created!**

---

### Step 3: Verify the Document

1. **Check the document exists**
   - In Firestore, click on `users` collection
   - You should see a document with your UID as the document ID
   - Click on it to view the fields

2. **Verify all fields are correct**
   - `email`: `admin@speccon.com`
   - `firstName`: `Admin`
   - `lastName`: `User`
   - `role`: `admin`

---

### Step 4: Test Login Again

1. **Go to your app** (Vercel URL)
2. **Try logging in again**
   - Email: `admin@speccon.com`
   - Password: `admin123`
3. **The error should be gone!**

---

## Why This Happens

The app flow is:
1. ✅ User logs in with Firebase Authentication (this works)
2. ❌ App tries to read user profile from Firestore (fails because document doesn't exist)
3. ❌ Error: "Failed to get document because client is offline"

**The fix:** Create the user profile document in Firestore so the app can read it.

---

## Alternative: Check Network Connection

If you've already created the user document but still get the error:

1. **Check your internet connection**
   - Make sure you're online
   - Try refreshing the page

2. **Check Firebase status**
   - Visit: https://status.firebase.google.com
   - Make sure all services are operational

3. **Clear browser cache**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Clear cached images and files
   - Try again

---

## Visual Guide

### What Firestore Should Look Like:

```
Firestore Database
│
└── Collections:
    └── users (collection)
        └── [Your UID] (document)
            ├── email: "admin@speccon.com"
            ├── firstName: "Admin"
            ├── lastName: "User"
            └── role: "admin"
```

### Example Document ID:
```
Document ID: aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
```

**Important:** The document ID must be the UID from Authentication, not a random name!

---

## Common Mistakes

### ❌ Wrong: Using random document ID
```
Document ID: admin-user
```
**This won't work!** The document ID must be the UID.

### ✅ Correct: Using UID as document ID
```
Document ID: aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
```
**This works!** The UID links Authentication to Firestore.

---

## Quick Checklist

- [ ] Got UID from Firebase Authentication
- [ ] Created `users` collection in Firestore
- [ ] Created document with UID as document ID
- [ ] Added all 4 fields: email, firstName, lastName, role
- [ ] Verified `role` = "admin" (lowercase)
- [ ] Saved the document
- [ ] Tested login again

---

## Still Getting the Error?

### Check These:

1. **Document ID matches UID exactly**
   - No extra spaces
   - Case-sensitive (uppercase/lowercase must match)
   - Copy-paste the UID to avoid typos

2. **Collection name is correct**
   - Must be `users` (lowercase, plural)
   - Not `user` or `Users` or `USERS`

3. **All fields are correct**
   - Field names are lowercase: `email`, `firstName`, `lastName`, `role`
   - `role` value is `admin` (lowercase)

4. **Firestore rules allow access**
   - Go to Firestore → Rules tab
   - Make sure rules allow authenticated users to read `users` collection
   - Deploy rules if needed: `firebase deploy --only firestore:rules`

---

## Need More Help?

If you're still stuck:

1. **Check browser console** (F12)
   - Look for more detailed error messages
   - Share the exact error text

2. **Verify in Firebase Console**
   - Authentication → Users: User exists? ✅
   - Firestore → users collection: Document exists? ✅
   - Document ID = UID? ✅

3. **Check Firestore rules**
   - Go to Firestore → Rules
   - Verify rules allow reading user documents

---

**Most likely fix:** Create the user document in Firestore with the UID as the document ID. This should resolve the error! ✅
