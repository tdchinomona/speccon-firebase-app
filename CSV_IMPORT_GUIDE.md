# 📥 CSV Import Guide

## How to Import Data via CSV

### Step 1: Access Import Page

1. Log in to your app
2. Click **"Import Data"** in the top navigation
3. You'll see the import page

### Step 2: Download CSV Template

1. Click **"📥 Download CSV Template"** button
2. This downloads a sample CSV file with the correct format
3. Open it in Excel, Google Sheets, or any spreadsheet app

### Step 3: Prepare Your Data

Your CSV file must have these columns (in this order):

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `reportDate` | ✅ Yes | Date in YYYY-MM-DD format | `2026-02-13` |
| `companyId` | ✅ Yes | Company ID (any value allowed) | `speccon` or `new-company` |
| `accountTypeId` | ✅ Yes | Account type ID (any value allowed) | `bank-account` or `custom-type` |
| `subAccountId` | ⚠️ Optional | Sub-account ID (any value allowed) | `accounts-receivable` or `custom-sub` |
| `amount` | ✅ Yes | Financial amount (number only) | `1500000` |

**Note:** 
- `subAccountId` is optional. Leave it blank if you don't have sub-accounts.
- **Custom values are accepted!** You can use any company ID, account type ID, or sub-account ID, even if they don't exist in Firestore yet.
- If custom IDs don't exist in Firestore, they will appear as "Unknown" on the dashboard until you create them.

### Step 4: Fill in Your Data

**Example CSV content (without sub-accounts):**
```csv
reportDate,companyId,accountTypeId,subAccountId,amount
2026-02-13,speccon,bank-account,,1500000
2026-02-13,speccon,current-assets,,750000
2026-02-13,speccon,current-liabilities,,300000
```

**Example CSV content (with sub-accounts):**
```csv
reportDate,companyId,accountTypeId,subAccountId,amount
2026-02-13,speccon,bank-account,,1500000
2026-02-13,speccon,current-assets,accounts-receivable,500000
2026-02-13,speccon,current-assets,client-loans,250000
2026-02-13,speccon,current-liabilities,,300000
2026-02-13,megro,bank-account,,1200000
2026-02-13,megro,current-assets,accounts-receivable,400000
2026-02-13,megro,current-assets,client-loans,200000
```

**Note:** Leave `subAccountId` empty (blank) if you don't want to use sub-accounts for that row.

### Step 5: Upload and Import

1. Click **"Choose CSV File"** button
2. Select your CSV file
3. The system will:
   - Validate your data
   - Show a preview of first 10 rows
   - Display validation results
4. If there are errors, fix them in your CSV and re-upload
5. If validation passes, click **"Import Data"**
6. Wait for import to complete
7. Click **"View Dashboard"** to see your data

---

## CSV Format Rules

### ✅ Correct Format

```csv
reportDate,companyId,accountTypeId,amount
2026-02-13,speccon,bank-account,1500000
2026-02-14,speccon,bank-account,1600000
```

### ❌ Common Mistakes

**Wrong date format:**
```csv
reportDate,companyId,accountTypeId,amount
02/13/2026,speccon,bank-account,1500000  ❌
```
**Fix:** Use `2026-02-13` format

**Amount with commas:**
```csv
reportDate,companyId,accountTypeId,amount
2026-02-13,speccon,bank-account,1,500,000  ❌
```
**Fix:** Use `1500000` (no commas)

**Amount with currency:**
```csv
reportDate,companyId,accountTypeId,amount
2026-02-13,speccon,bank-account,R1,500,000  ❌
```
**Fix:** Use `1500000` (number only)

**Wrong company ID:**
```csv
reportDate,companyId,accountTypeId,amount
2026-02-13,SpecCon,bank-account,1500000  ❌
```
**Fix:** Use lowercase `speccon` (must match Firestore document ID exactly)

---

## Finding Company and Account Type IDs

### Company IDs

1. Go to Firebase Console → Firestore Database
2. Open `companies` collection
3. Note the **document IDs** (e.g., `speccon`, `megro`, `infinity`, `andebe`, `tap`)
4. Use these exact IDs in your CSV (case-sensitive)

### Account Type IDs

1. Go to Firebase Console → Firestore Database
2. Open `accountTypes` collection
3. Note the **document IDs** (e.g., `bank-account`, `current-assets`, `current-liabilities`)
4. Use these exact IDs in your CSV (case-sensitive)

---

## Tips for Large Data Sets

### Tip 1: Use Excel/Google Sheets

1. Download the template
2. Fill in your data in Excel/Sheets
3. Export as CSV (make sure encoding is UTF-8)
4. Upload to the app

### Tip 2: Batch by Date

- Create separate CSV files for each date
- Import one date at a time
- Easier to track and verify

### Tip 3: Validate Before Import

- The preview shows first 10 rows
- Check validation results before clicking "Import"
- Fix all errors before importing

### Tip 4: Keep a Backup

- Save your CSV files
- Keep a record of what you imported
- Useful for auditing

---

## Troubleshooting

### Custom Values Accepted

**Good News:** You can now use any company ID, account type ID, or sub-account ID in your CSV, even if they don't exist in Firestore!

**What happens:**
- ✅ Import will succeed with custom values
- ⚠️ Custom companies will show as "Unknown (ID: your-company-id)" on dashboard
- ⚠️ Custom account types will be categorized automatically based on name patterns:
  - Contains "bank" or "cash" → Bank
  - Contains "asset" or "receivable" or "loan" → Current Assets
  - Contains "liabilit" or "payable" or "debt" → Current Liabilities

**To fix "Unknown" display:**
1. Create the company/account type in Firestore with the exact ID from your CSV
2. The dashboard will then show the proper name

### "Invalid date format"

**Problem:** Date not in YYYY-MM-DD format  
**Fix:** 
- Use format: `2026-02-13`
- Not: `02/13/2026` or `13-02-2026`

### "Invalid amount"

**Problem:** Amount contains commas or currency symbols  
**Fix:**
- Use: `1500000`
- Not: `1,500,000` or `R1,500,000`

### "Import failed"

**Problem:** Network or permission error  
**Fix:**
1. Check your internet connection
2. Verify you're logged in
3. Check Firestore security rules allow writes
4. Try again

---

## Example: Complete CSV File

```csv
reportDate,companyId,accountTypeId,amount
2026-02-13,speccon,bank-account,1500000
2026-02-13,speccon,current-assets,750000
2026-02-13,speccon,current-liabilities,300000
2026-02-13,megro,bank-account,1200000
2026-02-13,megro,current-assets,600000
2026-02-13,megro,current-liabilities,250000
2026-02-13,infinity,bank-account,900000
2026-02-13,infinity,current-assets,450000
2026-02-13,infinity,current-liabilities,180000
2026-02-13,andebe,bank-account,750000
2026-02-13,andebe,current-assets,375000
2026-02-13,andebe,current-liabilities,150000
2026-02-13,tap,bank-account,600000
2026-02-13,tap,current-assets,300000
2026-02-13,tap,current-liabilities,120000
```

This imports data for all 5 companies for date 2026-02-13.

---

## Quick Checklist

Before importing:
- [ ] CSV has header row: `reportDate,companyId,accountTypeId,amount`
- [ ] Dates are in YYYY-MM-DD format
- [ ] Company IDs match Firestore document IDs exactly
- [ ] Account Type IDs match Firestore document IDs exactly
- [ ] Amounts are numbers only (no commas, no currency symbols)
- [ ] File is saved as CSV (not Excel)

---

**That's it! You can now import large amounts of data quickly via CSV! 🚀**
