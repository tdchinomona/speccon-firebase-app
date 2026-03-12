# 🔧 Fix: Role is "undefined" - User Profile Not Loading

## The Problem
The debug panel shows `Role="undefined"`, which means your user profile is not being loaded from Firestore, or the `role` field is missing.

---

## ✅ Step-by-Step Fix

### Step 1: Get Your Firebase Auth UID

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Click **Authentication** (in left sidebar)
4. Click **Users** tab
5. Find your email address in the list
6. **Copy the UID** (the long string in the "User UID" column)
   - Example: `abc123def456ghi789jkl012mno345pqr678stu901vwx234`

### Step 2: Check if Your User Document Exists

1. In Firebase Console, click **Firestore Database** (in left sidebar)
2. Click on the **`users`** collection
3. Look for a document with your UID as the document ID
   - The document ID should match the UID you copied in Step 1

**If the document DOES NOT exist:**
- Go to Step 3 (Create New Document)

**If the document EXISTS:**
- Go to Step 4 (Update Existing Document)

---

### Step 3: Create Your User Document (if it doesn't exist)

1. In the **`users`** collection, click **"Add document"**
2. **Document ID:** Paste your UID from Step 1 (exactly as it appears)
3. Click **"Next"** or **"Create"**
4. **Add these fields:**

   | Field Name | Type | Value |
   |------------|------|-------|
   | `email` | string | Your email address |
   | `firstName` | string | Your first name |
   | `lastName` | string | Your last name |
   | `role` | string | `admin` (lowercase, exactly) |

5. Click **"Save"**

---

### Step 4: Update Your User Document (if it exists)

1. Click on your user document (the one with your UID as the document ID)
2. Check if the `role` field exists:
   
   **If `role` field is MISSING:**
   - Click **"Add field"**
   - Field name: `role`
   - Type: **string**
   - Value: `admin` (lowercase, exactly)
   - Click **"Update"**

   **If `role` field EXISTS but is wrong:**
   - Click on the `role` field to edit it
   - Change the value to: `admin` (lowercase, exactly)
   - Click **"Update"**

3. **Verify all fields are correct:**
   - `email`: Your email address
   - `firstName`: Your first name
   - `lastName`: Your last name
   - `role`: `admin` (must be lowercase)

---

### Step 5: Refresh Your Dashboard

1. Go back to your dashboard
2. **Hard refresh** the page:
   - **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac:** `Cmd + Shift + R`
3. **OR** log out and log back in
4. Check the debug panel again - it should now show:
   - `Role="admin"` ✅
   - `Is Admin=YES ✅`
   - `Will Show Link=YES ✅`

---

## 🎯 Expected Result

After fixing, the debug panel should show:
```
Debug Info: Loading=No | Role="admin" | Is Admin=YES ✅ | Will Show Link=YES ✅
```

And the **"Add User"** link should appear in the navigation bar between "Import Data" and your name.

---

## ⚠️ Common Mistakes

1. **Wrong Document ID:** The document ID must match your Firebase Auth UID exactly
2. **Wrong Field Name:** Must be `role` (lowercase), not `Role` or `ROLE`
3. **Wrong Value:** Must be `admin` (lowercase), not `Admin` or `ADMIN`
4. **Extra Spaces:** Make sure there are no spaces before or after `admin`

---

## 🔍 Verify Your Setup

After updating, check:
- [ ] Document ID matches your Firebase Auth UID exactly
- [ ] `role` field exists and is type "string"
- [ ] `role` value is exactly `admin` (lowercase, no spaces)
- [ ] All other fields (email, firstName, lastName) are present
- [ ] You've refreshed the page or logged out/in

---

**Still not working?** Make sure you're logged in with the same email that matches the UID in Firestore.
