# ✅ Verify Your Admin Role to See "Add User" Link

If you don't see the "Add User" link in the navigation, it's likely because your user role is not set to `'admin'` in Firestore.

---

## Quick Check: Verify Your Role

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**
3. **Go to Firestore Database**
4. **Open the `users` collection**
5. **Find your user document** (by your email or UID)
6. **Check the `role` field**

### What to Look For:

**✅ Correct:**
```
Document ID: [your-uid]
Fields:
  - email: "admin@speccon.com"
  - firstName: "Admin"
  - lastName: "User"
  - role: "admin"  ← Must be exactly "admin" (string)
```

**❌ Wrong:**
```
  - role: "user"  ← This won't show the link
  - role: "Admin"  ← Case-sensitive, must be lowercase "admin"
  - (role field missing)  ← Won't work
```

---

## How to Fix: Set Your Role to Admin

### Step 1: Get Your User UID

1. Firebase Console → **Authentication** → **Users** tab
2. Find your email address
3. **Copy the UID** (the long string in the "User UID" column)

### Step 2: Update Your User Document

1. Firebase Console → **Firestore Database**
2. Open the **`users`** collection
3. Find the document with your UID (or search by email)
4. Click to edit the document
5. Find the `role` field
6. Change it to: `"admin"` (string, lowercase)
7. Click **"Update"**

### Step 3: Refresh Your Dashboard

1. Go back to your dashboard
2. **Refresh the page** (F5 or Ctrl+R)
3. The "Add User" link should now appear in the navigation

---

## Alternative: Create Admin User Document

If your user document doesn't exist:

1. Firebase Console → **Firestore Database**
2. Open the **`users`** collection
3. Click **"Add document"**
4. **Document ID:** Paste your UID from Authentication
5. **Add fields:**
   - `email` (string): Your email
   - `firstName` (string): Your first name
   - `lastName` (string): Your last name
   - `role` (string): `"admin"` ← **Important: lowercase "admin"**
6. Click **"Save"**
7. Refresh your dashboard

---

## Still Not Working?

1. **Check browser console** (F12) for any errors
2. **Verify you're logged in** - Check that your name appears in the top right
3. **Log out and log back in** - This refreshes your user profile
4. **Check Firestore rules** - Make sure you can read the `users` collection

---

## Quick Test

After updating your role to `"admin"`:

1. **Log out** of the dashboard
2. **Log back in**
3. You should see **"Add User"** link next to "Import Data" in the navigation

---

**Note:** The "Add User" link only appears for users with `role: "admin"` in their Firestore user document.
