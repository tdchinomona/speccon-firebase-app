# 📝 How to Add Actual Financial Data

## Quick Answer: Where to Add Data

**Location:** Firebase Console → Firestore Database → `cashPositions` collection

---

## Method 1: Add Data via Firebase Console (Current Method)

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com
2. Select your project
3. Click **"Firestore Database"** in the left sidebar

### Step 2: Navigate to Cash Positions
1. Find the **`cashPositions`** collection
2. Click on it to open

### Step 3: Add a New Cash Position
1. Click **"Add document"** (or the **"+"** button)
2. **Document ID:** Leave blank (Auto-ID) or enter a unique ID
3. **Add these fields:**

| Field Name | Type | Value | Example |
|------------|------|-------|---------|
| `reportDate` | string | Date in YYYY-MM-DD format | `2026-02-13` |
| `companyId` | string | Company document ID | `speccon` |
| `accountTypeId` | string | Account type document ID | `bank-account` |
| `amount` | number | Financial amount (no commas) | `1500000` |

4. Click **"Save"**

### Step 4: Repeat for All Data Points

For each company and account type combination, create a document:

**Example: Adding data for SpecCon on 2026-02-13**

1. **Bank Account:**
   - `reportDate`: `2026-02-13`
   - `companyId`: `speccon`
   - `accountTypeId`: `bank-account`
   - `amount`: `1500000` (R1,500,000)

2. **Current Assets:**
   - `reportDate`: `2026-02-13`
   - `companyId`: `speccon`
   - `accountTypeId`: `current-assets`
   - `amount`: `750000` (R750,000)

3. **Current Liabilities:**
   - `reportDate`: `2026-02-13`
   - `companyId`: `speccon`
   - `accountTypeId`: `current-liabilities`
   - `amount`: `300000` (R300,000)

**Repeat for each company** (megro, infinity, andebe, tap)

---

## Important Notes

### Date Format
- **Must be:** `YYYY-MM-DD` (e.g., `2026-02-13`)
- **Not:** `02/13/2026` or `13-02-2026`

### Company IDs
- Must match exactly the document IDs in `companies` collection
- Common IDs: `speccon`, `megro`, `infinity`, `andebe`, `tap`
- Check your `companies` collection to see exact IDs

### Account Type IDs
- Must match exactly the document IDs in `accountTypes` collection
- Check your `accountTypes` collection to see exact IDs
- Common examples: `bank-account`, `current-assets`, `current-liabilities`

### Amount Format
- **Type:** number (not string)
- **No commas:** `1500000` not `1,500,000`
- **No currency symbol:** `1500000` not `R1,500,000`
- **Just the number:** `1500000`

---

## Quick Reference: What You Need

Before adding data, make sure you have:

1. **Companies created** in `companies` collection
   - Check: Firebase Console → Firestore → `companies`
   - Note the document IDs (e.g., `speccon`, `megro`)

2. **Account Types created** in `accountTypes` collection
   - Check: Firebase Console → Firestore → `accountTypes`
   - Note the document IDs (e.g., `bank-account`, `current-assets`)
   - Verify the `category` field matches: "Bank", "Current Assets", or "Current Liabilities"

---

## Bulk Data Entry Tips

### Tip 1: Use Copy/Paste
1. Create one document
2. Click on it to view
3. Copy the structure
4. Create new document and paste similar values
5. Modify only the values that change

### Tip 2: Use Spreadsheet First
1. Create a spreadsheet with columns:
   - Date
   - Company
   - Account Type
   - Amount
2. Fill in all your data
3. Then add to Firestore one by one (or use a script)

### Tip 3: Batch by Date
- Add all data for one date first
- Then move to the next date
- This makes it easier to verify

---

## Example: Complete Data Entry for One Date

**Date: 2026-02-13**

Create 15 documents (5 companies × 3 account types):

| Company | Account Type | Amount | Document Fields |
|---------|-------------|--------|----------------|
| SpecCon | Bank | 1,500,000 | reportDate: `2026-02-13`, companyId: `speccon`, accountTypeId: `bank-account`, amount: `1500000` |
| SpecCon | Assets | 750,000 | reportDate: `2026-02-13`, companyId: `speccon`, accountTypeId: `current-assets`, amount: `750000` |
| SpecCon | Liabilities | 300,000 | reportDate: `2026-02-13`, companyId: `speccon`, accountTypeId: `current-liabilities`, amount: `300000` |
| Megro | Bank | 1,200,000 | reportDate: `2026-02-13`, companyId: `megro`, accountTypeId: `bank-account`, amount: `1200000` |
| Megro | Assets | 600,000 | reportDate: `2026-02-13`, companyId: `megro`, accountTypeId: `current-assets`, amount: `600000` |
| ... | ... | ... | ... |

---

## Verify Your Data

After adding data:

1. **Go to your dashboard**
2. **Select the date** you just added data for
3. **Check if data appears:**
   - Summary cards show totals
   - Chart shows company breakdown
   - Table shows individual company data

If data doesn't appear:
- Check date format matches exactly
- Verify companyId matches company document ID
- Verify accountTypeId matches account type document ID
- Check amount is a number (not string)

---

## Need to Add Data for Multiple Dates?

**For each new date:**
1. Create new documents in `cashPositions` collection
2. Use the same `companyId` and `accountTypeId` values
3. Change only the `reportDate` and `amount` values
4. Repeat for all companies and account types

**Example workflow:**
- Day 1: Add all data for `2026-02-13`
- Day 2: Add all data for `2026-02-14`
- Day 3: Add all data for `2026-02-15`
- etc.

---

## Troubleshooting

### "Data not showing on dashboard"
- **Check date format:** Must be `YYYY-MM-DD`
- **Check companyId:** Must match exactly (case-sensitive)
- **Check accountTypeId:** Must match exactly (case-sensitive)
- **Check amount:** Must be a number, not a string

### "Wrong totals showing"
- Verify account type `category` field is correct: "Bank", "Current Assets", or "Current Liabilities"
- Check that amounts are numbers, not strings

### "Company not showing"
- Verify company document exists in `companies` collection
- Check `active` field is `true`
- Verify `companyId` matches document ID exactly

---

## Alternative: Data Entry Form (Future Feature)

If you want to add data through the app instead of Firebase Console, I can create a data entry form. This would allow you to:
- Add data directly from the dashboard
- Select company and account type from dropdowns
- Enter amounts in a form
- Save without going to Firebase Console

**Would you like me to create this feature?** Let me know!

---

**For now, use Firebase Console to add your actual financial data. See `ADD_SAMPLE_DATA.md` for more detailed step-by-step instructions.**
