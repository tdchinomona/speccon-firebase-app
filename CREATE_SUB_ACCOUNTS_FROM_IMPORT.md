# 📝 Create Sub-Accounts from Your Import Data

This guide shows you how to create sub-account documents in Firestore that match the sub-account IDs you're already using in your CSV imports.

---

## Step 1: Identify Your Sub-Account IDs

First, you need to find all the unique sub-account IDs you're using in your CSV imports.

### Option A: Check Your CSV Files
1. Open your CSV import files
2. Look at the `subAccountId` column
3. List all unique values (excluding empty cells)

**Example from your CSV:**
```csv
reportDate,companyId,accountTypeId,subAccountId,amount
2026-02-13,speccon,current-assets,accounts-receivable,500000
2026-02-13,speccon,current-assets,client-loans,250000
2026-02-13,megro,bank-account,savings-account,1200000
```

**Sub-account IDs found:**
- `accounts-receivable`
- `client-loans`
- `savings-account`

### Option B: Check Firestore cashPositions
1. Go to Firebase Console → **Firestore Database**
2. Open the `cashPositions` collection
3. Look at documents that have a `subAccountId` field
4. Note all unique `subAccountId` values

---

## Step 2: Identify Account Types for Each Sub-Account

For each sub-account ID, identify which account type it belongs to by checking your CSV or cashPositions:

| Sub-Account ID | Account Type ID | Notes |
|----------------|-----------------|-------|
| `accounts-receivable` | `current-assets` | From CSV row |
| `client-loans` | `current-assets` | From CSV row |
| `savings-account` | `bank-account` | From CSV row |

**Important:** The `accountTypeId` must match an existing document ID in your `accountTypes` collection.

---

## Step 3: Create Sub-Accounts Collection (If Not Exists)

1. Go to Firebase Console → **Firestore Database**
2. Check if `subAccounts` collection exists
   - If it exists, skip to Step 4
   - If it doesn't exist, continue below
3. Click **"Start collection"** (or **"Add collection"**)
4. **Collection ID:** `subAccounts`
5. Click **"Next"**

---

## Step 4: Create Sub-Account Documents

For each sub-account ID from Step 1, create a document:

### For Each Sub-Account:

1. Click **"Add document"** (or **"Start collection"** if it's the first one)
2. **Document ID:** Use the exact sub-account ID from your import (e.g., `accounts-receivable`)
   - ⚠️ **Important:** The document ID must match exactly what you use in your CSV imports
   - Use lowercase, with hyphens (e.g., `accounts-receivable`, not `Accounts Receivable`)
3. Click **"Next"**

4. **Add Fields:**

   | Field Name | Type | Value | Example |
   |------------|------|-------|---------|
   | `name` | string | Display name (human-readable) | `Accounts Receivable` |
   | `accountTypeId` | string | Must match account type document ID | `current-assets` |
   | `displayOrder` | number | Order for display (1, 2, 3...) | `1` |
   | `active` | boolean | Set to `true` | `true` |

5. Click **"Save"**

### Example: Creating "accounts-receivable"

**Document ID:** `accounts-receivable`

**Fields:**
```
name: "Accounts Receivable" (string)
accountTypeId: "current-assets" (string)
displayOrder: 1 (number)
active: true (boolean)
```

### Example: Creating "client-loans"

**Document ID:** `client-loans`

**Fields:**
```
name: "Client Loans" (string)
accountTypeId: "current-assets" (string)
displayOrder: 2 (number)
active: true (boolean)
```

### Example: Creating "savings-account"

**Document ID:** `savings-account`

**Fields:**
```
name: "Savings Account" (string)
accountTypeId: "bank-account" (string)
displayOrder: 1 (number)
active: true (boolean)
```

---

## Step 5: Verify Account Types Exist

Before creating sub-accounts, make sure the parent account types exist:

1. Go to Firebase Console → **Firestore Database**
2. Open the `accountTypes` collection
3. Check that these document IDs exist:
   - `current-assets`
   - `bank-account`
   - `current-liabilities`
   - (or whatever account types you're using)

**If an account type doesn't exist:**
- Create it first (see `ADD_SAMPLE_DATA.md` for details)
- Then create the sub-accounts

---

## Step 6: Quick Reference - Field Details

### Field: `name`
- **Type:** string
- **Purpose:** Human-readable display name
- **Example:** `"Accounts Receivable"`, `"Client Loans"`, `"Savings Account"`
- **Tip:** Use proper capitalization and spaces (unlike the document ID)

### Field: `accountTypeId`
- **Type:** string
- **Purpose:** Links sub-account to parent account type
- **Must match:** An existing document ID in `accountTypes` collection
- **Examples:** `"current-assets"`, `"bank-account"`, `"current-liabilities"`

### Field: `displayOrder`
- **Type:** number
- **Purpose:** Controls the order sub-accounts appear in lists
- **Example:** `1`, `2`, `3` (lower numbers appear first)
- **Tip:** Use increments of 10 (1, 10, 20) to allow easy reordering later

### Field: `active`
- **Type:** boolean
- **Purpose:** Whether the sub-account is active
- **Value:** `true` (always set to true for active sub-accounts)
- **Note:** Inactive sub-accounts won't appear in the dashboard

---

## Step 7: Batch Creation Template

If you have many sub-accounts, you can use this template to organize them:

### Template Table

| Document ID | name | accountTypeId | displayOrder | active |
|-------------|------|----------------|---------------|--------|
| `accounts-receivable` | Accounts Receivable | `current-assets` | 1 | true |
| `client-loans` | Client Loans | `current-assets` | 2 | true |
| `inventory` | Inventory | `current-assets` | 3 | true |
| `savings-account` | Savings Account | `bank-account` | 1 | true |
| `checking-account` | Checking Account | `bank-account` | 2 | true |
| `accounts-payable` | Accounts Payable | `current-liabilities` | 1 | true |

**Fill this out with your actual sub-account IDs, then create each document in Firestore.**

---

## Step 8: Verify Your Setup

After creating all sub-accounts:

1. **Check the dashboard:**
   - Go to your dashboard
   - Expand "Sub-Account Analysis" section
   - You should see sub-accounts with proper names (not just IDs)

2. **Check Firestore:**
   - Go to `subAccounts` collection
   - Verify all your sub-account IDs are there
   - Check that `accountTypeId` values match existing account types

3. **Test with a new import:**
   - Import a CSV with sub-account IDs
   - Verify they appear correctly on the dashboard

---

## Common Issues & Solutions

### Issue: Sub-accounts show as IDs instead of names
**Solution:** 
- Check that the document ID in `subAccounts` matches exactly (case-sensitive)
- Verify the `name` field is set correctly

### Issue: Sub-accounts don't appear at all
**Solution:**
- Check that `active` field is set to `true`
- Verify `accountTypeId` matches an existing account type
- Check browser console for errors

### Issue: "Account type not found" error
**Solution:**
- Create the missing account type in `accountTypes` collection first
- Then update the sub-account's `accountTypeId` field

---

## Example: Complete Workflow

Let's say your CSV has these sub-account IDs:
- `ar-2024` (Accounts Receivable 2024)
- `ar-2025` (Accounts Receivable 2025)
- `client-loan-1`
- `savings-main`

### Step 1: Create Collection
- Collection ID: `subAccounts`

### Step 2: Create Documents

**Document 1:**
- ID: `ar-2024`
- Fields:
  - `name`: `Accounts Receivable 2024`
  - `accountTypeId`: `current-assets`
  - `displayOrder`: `1`
  - `active`: `true`

**Document 2:**
- ID: `ar-2025`
- Fields:
  - `name`: `Accounts Receivable 2025`
  - `accountTypeId`: `current-assets`
  - `displayOrder`: `2`
  - `active`: `true`

**Document 3:**
- ID: `client-loan-1`
- Fields:
  - `name`: `Client Loan 1`
  - `accountTypeId`: `current-assets`
  - `displayOrder`: `3`
  - `active`: `true`

**Document 4:**
- ID: `savings-main`
- Fields:
  - `name`: `Savings Main Account`
  - `accountTypeId`: `bank-account`
  - `displayOrder`: `1`
  - `active`: `true`

### Step 3: Verify
- Check dashboard shows proper names
- Import a test CSV to confirm

---

## Next Steps

After creating all sub-accounts:
1. ✅ Your imports will automatically use the proper names
2. ✅ Dashboard will show detailed sub-account breakdowns
3. ✅ You can group and analyze by sub-account

---

**Need help?** Check:
- `SUB_ACCOUNTS_SETUP.md` - General setup guide
- `SUB_ACCOUNTS_EXAMPLES.md` - More examples
- `CSV_IMPORT_GUIDE.md` - CSV import details
