# 🔧 Quick Fix: Make "Add User" Link Appear

## The Problem
The "Add User" link only appears if your user document in Firestore has `role: "admin"`.

---

## ✅ Step-by-Step Fix (5 minutes)

### Step 1: Get Your User UID

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Click **Authentication** (in left sidebar)
4. Click **Users** tab
5. Find your email address
6. **Copy the UID** (the long string in the "User UID" column)

### Step 2: Check Your User Document

1. In Firebase Console, click **Firestore Database** (in left sidebar)
2. Click on the **`users`** collection
3. Look for a document with your UID (or search by your email)
4. **Click on the document** to open it

### Step 3: Check the Role Field

Look for a field called `role`. 

**If it says:**
- ✅ `"admin"` → You're good! Just refresh the page
- ❌ `"user"` → Go to Step 4
- ❌ (field missing) → Go to Step 4
- ❌ `"Admin"` or `"ADMIN"` → Go to Step 4 (must be lowercase)

### Step 4: Update Your Role

1. **Click the edit button** (pencil icon) on your user document
2. Find the `role` field (or add it if missing)
3. **Change the value to:** `admin` (lowercase, no quotes in the UI)
4. **Click "Update"** or "Save"

### Step 5: Refresh Your Dashboard

1. Go back to your dashboard
2. **Hard refresh** the page:
   - **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac:** `Cmd + Shift + R`
3. The **"Add User"** link should now appear in the navigation bar!

---

## 🐛 Still Not Working?

### Check Browser Console

1. Open browser console (Press `F12`)
2. Look for messages starting with `=== Layout Debug Info ===`
3. Check what it says for:
   - `Role:` (should be `"admin"`)
   - `Is Admin:` (should be `true`)
   - `Will show Add User link:` (should be `true`)

### Try Logging Out and Back In

1. Click **Logout** in the top right
2. Log back in with your credentials
3. Check if the link appears

### Verify Firestore Rules

Make sure your Firestore rules allow reading user documents:

```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

---

## 📋 Quick Checklist

- [ ] Found my UID in Firebase Authentication
- [ ] Opened my user document in Firestore `users` collection
- [ ] Set `role` field to `"admin"` (lowercase)
- [ ] Saved the document
- [ ] Hard refreshed the dashboard (Ctrl+Shift+R)
- [ ] Checked browser console for debug info
- [ ] Tried logging out and back in

---

## 🎯 Expected Result

After fixing, you should see:
- **"Add User"** link in the navigation bar (between "Import Data" and your name)
- You can click it to access the user creation page
- The page shows a form to create new users

---

**Need more help?** Check the browser console (F12) for the debug messages that show your current role status.
