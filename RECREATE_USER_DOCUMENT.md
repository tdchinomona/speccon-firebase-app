# 🔄 Recreate Your User Document in Firestore

Since you deleted the `users` collection, you need to recreate your user document. Follow these steps:

---

## ✅ Step-by-Step Instructions

### Step 1: Get Your Firebase Auth UID

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Click **Authentication** (in the left sidebar)
4. Click the **Users** tab
5. Find your email address in the list
6. **Copy the UID** (the long string in the "User UID" column)
   - It looks like: `abc123def456ghi789jkl012mno345pqr678stu901vwx234`
   - **IMPORTANT:** Copy this exactly - you'll need it as the document ID

---

### Step 2: Create the Users Collection (if it doesn't exist)

1. In Firebase Console, click **Firestore Database** (in the left sidebar)
2. If you see "Start collection" or the collection is empty, proceed to Step 3
3. If the `users` collection already exists, skip to Step 3

---

### Step 3: Create Your User Document

1. In Firestore Database, click **"Start collection"** (if it's empty) or click on **`users`** collection
2. Click **"Add document"** button
3. **Document ID:** 
   - **IMPORTANT:** Paste your UID from Step 1 here
   - Make sure it matches exactly (no spaces, no extra characters)
   - This is critical - the document ID must match your Firebase Auth UID
4. Click **"Next"** or **"Create"**

---

### Step 4: Add Required Fields

Now you'll add fields to your document. Click **"Add field"** for each one:

#### Field 1: `email`
- **Field name:** `email`
- **Type:** Select **string**
- **Value:** Your email address (e.g., `admin@speccon.com`)
- Click **"Add"**

#### Field 2: `firstName`
- **Field name:** `firstName`
- **Type:** Select **string**
- **Value:** Your first name (e.g., `Admin`)
- Click **"Add"**

#### Field 3: `lastName`
- **Field name:** `lastName`
- **Type:** Select **string**
- **Value:** Your last name (e.g., `User`)
- Click **"Add"**

#### Field 4: `role` ⚠️ **CRITICAL**
- **Field name:** `role`
- **Type:** Select **string**
- **Value:** `admin` (lowercase, exactly - no quotes, no spaces)
- Click **"Add"**

---

### Step 5: Save the Document

1. Review all fields:
   - ✅ `email`: Your email
   - ✅ `firstName`: Your first name
   - ✅ `lastName`: Your last name
   - ✅ `role`: `admin` (lowercase)
2. Click **"Save"** or **"Update"**

---

### Step 6: Verify Your Document

Your document should look like this:

```
Document ID: [your-uid-here]
Fields:
  - email: "your-email@speccon.com" (string)
  - firstName: "YourFirstName" (string)
  - lastName: "YourLastName" (string)
  - role: "admin" (string) ← Must be lowercase "admin"
```

---

### Step 7: Refresh Your Dashboard

1. Go back to your dashboard
2. **Hard refresh** the page:
   - **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac:** `Cmd + Shift + R`
3. **OR** log out and log back in
4. Check the debug panel - it should now show:
   - `Role="admin"` ✅
   - `Is Admin=YES ✅`
   - `Will Show Link=YES ✅`

---

## 🎯 Expected Result

After completing these steps:
- ✅ Your user document exists in Firestore
- ✅ The `role` field is set to `"admin"`
- ✅ The debug panel shows `Role="admin"` and `Is Admin=YES ✅`
- ✅ The **"Add User"** link appears in the navigation bar

---

## ⚠️ Common Mistakes to Avoid

1. **Wrong Document ID:** Must match your Firebase Auth UID exactly
2. **Wrong Field Name:** Must be `role` (lowercase), not `Role` or `ROLE`
3. **Wrong Value:** Must be `admin` (lowercase), not `Admin` or `ADMIN` or `"admin"` (no quotes in the value field)
4. **Missing Fields:** Make sure all 4 fields are added (email, firstName, lastName, role)

---

## 📋 Quick Checklist

- [ ] Got my UID from Firebase Authentication
- [ ] Created `users` collection (if it didn't exist)
- [ ] Created document with my UID as the document ID
- [ ] Added `email` field (string)
- [ ] Added `firstName` field (string)
- [ ] Added `lastName` field (string)
- [ ] Added `role` field (string) with value `admin` (lowercase)
- [ ] Saved the document
- [ ] Refreshed the dashboard
- [ ] Verified debug panel shows `Is Admin=YES ✅`

---

## 🔍 Still Not Working?

If the debug panel still shows `Role="undefined"`:

1. **Double-check the document ID** matches your UID exactly
2. **Verify the `role` field** is type "string" and value is `admin` (lowercase)
3. **Check for typos** in field names (must be exactly: `email`, `firstName`, `lastName`, `role`)
4. **Try logging out and back in** to refresh the authentication state
5. **Check Firestore rules** allow reading user documents (should be: `allow read: if request.auth != null;`)

---

**Need help?** Check the debug panel on your dashboard - it will show your UID so you can verify it matches the document ID in Firestore.
