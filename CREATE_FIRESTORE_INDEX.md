# 🔧 Create Firestore Index for Sub-Accounts

## The Problem

You're seeing this error:
```
FirebaseError: The query requires an index. You can create it here: [URL]
```

This happens because the sub-accounts query combines:
- `where('active', '==', true)`
- `orderBy('displayOrder')`

Firestore requires a composite index for queries that filter and sort on different fields.

---

## Solution: Create the Index

### Option 1: Click the Link (Easiest)

1. **Click the link** in the error message in your browser console
2. Firebase Console will open with the index creation page
3. Click **"Create Index"**
4. Wait for the index to build (usually 1-2 minutes)
5. Refresh your dashboard

### Option 2: Deploy Index via Firebase CLI

If you have Firebase CLI installed:

```bash
firebase deploy --only firestore:indexes
```

This will deploy the index defined in `firestore.indexes.json`.

### Option 3: Manual Creation in Firebase Console

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Go to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"**
5. Configure:
   - **Collection ID:** `subAccounts`
   - **Fields to index:**
     - `active` (Ascending)
     - `displayOrder` (Ascending)
6. Click **"Create"**
7. Wait for the index to build (usually 1-2 minutes)

---

## Verify Index is Created

1. Go to **Firestore Database** → **Indexes** tab
2. Look for an index with:
   - Collection: `subAccounts`
   - Fields: `active` (Ascending), `displayOrder` (Ascending)
3. Status should be **"Enabled"** (green checkmark)

---

## After Creating the Index

1. **Wait 1-2 minutes** for the index to build
2. **Refresh your dashboard**
3. The sub-account analysis should now work!

---

## Why This Happens

Firestore requires composite indexes when you:
- Filter on one field (`active`)
- Sort on a different field (`displayOrder`)

This is a Firestore requirement for performance optimization.

---

**Note:** The index has been added to `firestore.indexes.json` in your project. If you deploy via Firebase CLI, it will automatically create the index.
