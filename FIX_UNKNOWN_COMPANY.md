# 🔍 Fix "Unknown" Company Issue

## Why You See "Unknown"

The dashboard shows "Unknown" when the `companyId` in your cash positions doesn't match any company document ID in Firestore.

---

## Common Causes

### 1. **Company Doesn't Exist in Firestore**

**Problem:** Your cash positions reference a `companyId` that doesn't exist in the `companies` collection.

**Solution:**
1. Go to Firebase Console → Firestore Database
2. Check the `companies` collection
3. Note the document IDs (e.g., `speccon`, `megro`, `infinity`, etc.)
4. Check your `cashPositions` collection
5. Verify the `companyId` field matches exactly

### 2. **Case Sensitivity Mismatch**

**Problem:** `companyId` is `"Speccon"` but company document ID is `"speccon"` (different case).

**Solution:**
- ✅ **Fixed in code:** The lookup is now case-insensitive
- ✅ **Best practice:** Always use lowercase for IDs (e.g., `speccon`, not `Speccon`)

### 3. **Typo in companyId**

**Problem:** `companyId` is `"specon"` instead of `"speccon"` (missing a 'c').

**Solution:**
- Check for typos in your cash positions
- Update the `companyId` field to match exactly

### 4. **Companies Collection is Empty**

**Problem:** No companies have been created in Firestore yet.

**Solution:**
- Create companies first (see `ADD_SAMPLE_DATA.md`)
- Then add cash positions

---

## How to Debug

### Step 1: Check Your Cash Positions

1. Firebase Console → Firestore Database
2. Open `cashPositions` collection
3. Look at a cash position document
4. Check the `companyId` field value
5. **Example:** If it says `"speccon"`, note it exactly

### Step 2: Check Your Companies

1. Firebase Console → Firestore Database
2. Open `companies` collection
3. Look at the document IDs
4. **Example:** You should see documents like:
   - Document ID: `speccon`
   - Document ID: `megro`
   - Document ID: `infinity`
   - etc.

### Step 3: Compare

- Does the `companyId` in cash positions match a company document ID?
- Are they the same case? (e.g., both lowercase)
- Are there any typos?

---

## How to Fix

### Option 1: Fix the Cash Positions (Recommended)

If your cash positions have wrong `companyId` values:

1. Firebase Console → Firestore Database
2. Open `cashPositions` collection
3. For each document with wrong `companyId`:
   - Click to edit
   - Change `companyId` field to match a company document ID
   - Save

**Example:**
- Change `companyId: "Speccon"` → `companyId: "speccon"`
- Change `companyId: "specon"` → `companyId: "speccon"` (fix typo)

### Option 2: Create Missing Companies

If the company doesn't exist in Firestore:

1. Firebase Console → Firestore Database
2. Open `companies` collection
3. Click **"Add document"**
4. **Document ID:** Use the exact `companyId` from your cash positions
5. **Fields:**
   - `name`: Company name (e.g., "SpecCon")
   - `code`: Company code (e.g., "SPECCON")
   - `active`: `true`
6. Save

### Option 3: Use CSV Import to Fix

1. Export your cash positions (or note the data)
2. Update the CSV with correct `companyId` values
3. Delete old cash positions (or use a new date)
4. Re-import via CSV with correct `companyId`

---

## Updated Code Behavior

The code has been updated to:
- ✅ Show the actual `companyId` in "Unknown" message: `Unknown (ID: speccon)`
- ✅ Use case-insensitive lookup (handles `Speccon` vs `speccon`)
- ✅ Help you identify which `companyId` is missing

---

## Example: Correct Setup

### Companies Collection:
```
Document ID: speccon
Fields:
  - name: "SpecCon"
  - code: "SPECCON"
  - active: true
```

### Cash Positions Collection:
```
Document ID: (auto-generated)
Fields:
  - reportDate: "2026-02-13"
  - companyId: "speccon"  ← Must match document ID exactly
  - accountTypeId: "bank-account"
  - amount: 1000000
```

**Result:** Dashboard shows "SpecCon" ✅

---

## Quick Checklist

- [ ] Companies collection has documents
- [ ] Company document IDs match `companyId` in cash positions
- [ ] Both use lowercase (recommended)
- [ ] No typos in `companyId` values
- [ ] Cash positions have valid `companyId` field

---

## Still Seeing "Unknown"?

If you still see "Unknown" after fixing:

1. **Check browser console** (F12) for errors
2. **Verify Firestore rules** allow reading companies
3. **Check network tab** to see if companies are being fetched
4. **Refresh the page** after making changes

The updated code will now show `Unknown (ID: your-company-id)` to help you identify which company is missing!

---

**After fixing, the dashboard should show proper company names! 🎉**
