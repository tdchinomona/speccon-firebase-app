# 🔍 Troubleshooting: Sub-Accounts Not Showing in Analysis

If you've imported data with sub-account IDs and created sub-accounts in Firestore, but they're not appearing in the dashboard analysis, follow these steps:

---

## Step 1: Verify Sub-Account Document in Firestore

1. Go to **Firebase Console** → **Firestore Database**
2. Open the **`subAccounts`** collection
3. Check if your sub-account document exists

### What to Check:

**Document ID must match exactly** (case-insensitive, but best to use lowercase):
- ✅ **Correct:** Document ID = `savings-investec`
- ✅ **Also works:** Document ID = `Savings-Investec` (case-insensitive matching)
- ❌ **Wrong:** Document ID = `savings_investec` (underscore instead of hyphen)

**Required Fields:**
- `name` (string): Display name, e.g., `"Savings Investec"`
- `accountTypeId` (string): Must match an account type, e.g., `"bank-account"`
- `displayOrder` (number): Order for display, e.g., `1`
- `active` (boolean): **MUST be `true`** ⚠️

---

## Step 2: Verify Sub-Account ID in Your Data

1. Go to **Firebase Console** → **Firestore Database**
2. Open the **`cashPositions`** collection
3. Find a document that should have a sub-account
4. Check the `subAccountId` field value

### Example:
```
Document fields:
- reportDate: "2026-02-20"
- companyId: "speccon"
- accountTypeId: "bank-account"
- subAccountId: "savings-investec"  ← Must match document ID
- amount: 1431.93
```

**Important:** The `subAccountId` in cash positions must match the document ID in `subAccounts` collection (case-insensitive).

---

## Step 3: Check Browser Console for Errors

1. Open your dashboard in the browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Look for warning messages like:
   ```
   Sub-account not found in Firestore: "savings-investec". Available sub-accounts: [...]
   ```

This will tell you:
- Which sub-account IDs are missing
- Which sub-account IDs are available in Firestore

---

## Step 4: Verify Sub-Account is Active

The code only fetches sub-accounts where `active: true`. Check:

1. **Firebase Console** → **Firestore Database** → **`subAccounts`** collection
2. Open your sub-account document
3. Verify the `active` field is set to `true` (boolean, not string)

**Common mistake:**
- ❌ `active: "true"` (string) - Won't work
- ✅ `active: true` (boolean) - Correct

---

## Step 5: Verify Date Selection

Sub-accounts only appear for dates that have data with `subAccountId`:

1. Check the **date picker** on the dashboard
2. Make sure you're viewing a date that has cash positions with sub-accounts
3. Try selecting different dates to see if sub-accounts appear

---

## Step 6: Verify Account Type Link

The sub-account must be linked to the correct account type:

1. **Firebase Console** → **Firestore Database** → **`subAccounts`** collection
2. Open your sub-account document
3. Check the `accountTypeId` field
4. Verify it matches the `accountTypeId` in your cash positions

**Example:**
- Sub-account document: `accountTypeId: "bank-account"`
- Cash position: `accountTypeId: "bank-account"` ✅
- Cash position: `accountTypeId: "current-assets"` ❌ (won't match)

---

## Common Issues & Solutions

### Issue 1: Sub-Account Shows as ID Instead of Name

**Symptom:** Dashboard shows `savings-investec` instead of `Savings Investec`

**Solution:**
1. Check that the sub-account document has a `name` field
2. Verify the document ID matches the `subAccountId` in cash positions
3. Check browser console for warnings

---

### Issue 2: Sub-Account Not Appearing at All

**Symptom:** No sub-account data in the "Sub-Account Analysis" section

**Checklist:**
- [ ] Sub-account document exists in Firestore
- [ ] Document ID matches `subAccountId` in cash positions (case-insensitive)
- [ ] `active` field is set to `true` (boolean)
- [ ] `accountTypeId` in sub-account matches `accountTypeId` in cash positions
- [ ] Cash positions have `subAccountId` field populated
- [ ] You're viewing a date that has cash positions with sub-accounts

---

### Issue 3: Sub-Account Appears But Amount is Zero

**Symptom:** Sub-account appears in the list but shows R0

**Solution:**
1. Check that cash positions have the correct `amount` values
2. Verify the `subAccountId` matches exactly
3. Check that the date being viewed has data

---

## Quick Verification Script

To quickly verify your setup, check these in Firestore:

### Sub-Account Document:
```
Collection: subAccounts
Document ID: savings-investec
Fields:
  - name: "Savings Investec" (string)
  - accountTypeId: "bank-account" (string)
  - displayOrder: 1 (number)
  - active: true (boolean) ← CRITICAL
```

### Cash Position Document:
```
Collection: cashPositions
Document ID: (any)
Fields:
  - reportDate: "2026-02-20" (string)
  - companyId: "speccon" (string)
  - accountTypeId: "bank-account" (string)
  - subAccountId: "savings-investec" (string) ← Must match document ID
  - amount: 1431.93 (number)
```

---

## Testing Steps

1. **Create/Verify Sub-Account:**
   - Document ID: `savings-investec`
   - `active: true`
   - `accountTypeId: "bank-account"`

2. **Import Data with Sub-Account:**
   ```csv
   reportDate,companyId,accountTypeId,subAccountId,amount
   2026-02-20,speccon,bank-account,savings-investec,1431.93
   ```

3. **Check Dashboard:**
   - Select date: `2026-02-20`
   - Expand "Sub-Account Analysis" section
   - Should see "Savings Investec" with amount R1,431.93

---

## Still Not Working?

If you've checked everything above and sub-accounts still don't appear:

1. **Check browser console** (F12) for error messages
2. **Verify Firestore rules** allow reading sub-accounts
3. **Try refreshing the page** after making changes
4. **Check network tab** to see if sub-accounts are being fetched

---

## Debug Information

The code logs warnings to the browser console when sub-accounts are not found. Check the console for messages like:

```
Sub-account not found in Firestore: "savings-investec". Available sub-accounts: ["account1", "account2", ...]
```

This tells you:
- Which sub-account ID is missing
- Which sub-account IDs are available in Firestore

---

**Need more help?** Check:
- `CREATE_SUB_ACCOUNTS_FROM_IMPORT.md` - How to create sub-accounts
- `SUB_ACCOUNTS_SETUP.md` - General setup guide
- `CSV_IMPORT_GUIDE.md` - CSV import details
