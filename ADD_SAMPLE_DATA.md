# 📊 How to Add Sample Data to Firestore

## Overview

Your dashboard needs 3 collections in Firestore:
1. **companies** - Company information
2. **accountTypes** - Account type definitions
3. **cashPositions** - Financial data

---

## Step 1: Create Companies Collection

### Go to Firestore Database
1. Firebase Console → **Firestore Database**
2. Click **"Start collection"**

### Create Collection
- **Collection ID:** `companies`
- Click **"Next"**

### Add 5 Company Documents

#### Company 1: SpecCon
- **Document ID:** `speccon` (lowercase, no spaces)
- **Add fields:**

| Field Name | Type | Value |
|------------|------|-------|
| `name` | string | `SpecCon` |
| `code` | string | `SPECCON` |
| `active` | boolean | `true` |

- Click **"Save"**

#### Company 2: Megro
- Click **"Add document"** (or the **"+"** button)
- **Document ID:** `megro`
- **Fields:** Same as above, but:
  - `name`: `Megro`
  - `code`: `MEGRO`
- Click **"Save"**

#### Company 3: Infinity
- **Document ID:** `infinity`
- **Fields:**
  - `name`: `Infinity`
  - `code`: `INFINITY`
  - `active`: `true`
- Click **"Save"**

#### Company 4: Andebe
- **Document ID:** `andebe`
- **Fields:**
  - `name`: `Andebe`
  - `code`: `ANDEBE`
  - `active`: `true`
- Click **"Save"**

#### Company 5: TAP
- **Document ID:** `tap`
- **Fields:**
  - `name`: `TAP`
  - `code`: `TAP`
  - `active`: `true`
- Click **"Save"**

✅ **5 companies created!**

---

## Step 2: Create Account Types Collection

### Create Collection
1. Click **"Start collection"** (or go back to Firestore root)
2. **Collection ID:** `accountTypes`
3. Click **"Next"**

### Add Account Type Documents

You need at least one account type in each category. Here are examples:

#### Account Type 1: Bank Account
- **Document ID:** `bank-account` (or any ID you like)
- **Fields:**

| Field Name | Type | Value |
|------------|------|-------|
| `name` | string | `Bank Account` |
| `category` | string | `Bank` |
| `displayOrder` | number | `1` |

- Click **"Save"**

#### Account Type 2: Current Assets
- **Document ID:** `current-assets`
- **Fields:**
  - `name`: `Current Assets`
  - `category`: `Current Assets`
  - `displayOrder`: `2`
- Click **"Save"**

#### Account Type 3: Current Liabilities
- **Document ID:** `current-liabilities`
- **Fields:**
  - `name`: `Current Liabilities`
  - `category`: `Current Liabilities`
  - `displayOrder`: `3`
- Click **"Save"**

**Note:** You can add more account types later. The minimum needed is:
- At least 1 with `category: "Bank"`
- At least 1 with `category: "Current Assets"`
- At least 1 with `category: "Current Liabilities"`

✅ **Account types created!**

---

## Step 3: Create Cash Positions Collection

### Create Collection
1. Click **"Start collection"**
2. **Collection ID:** `cashPositions`
3. Click **"Next"**

### Add Sample Cash Position Documents

For each cash position, you need:
- `reportDate`: The date (format: "YYYY-MM-DD")
- `companyId`: The document ID of a company (e.g., "speccon")
- `accountTypeId`: The document ID of an account type (e.g., "bank-account")
- `amount`: A number (the financial amount)

#### Example 1: SpecCon Bank Account
- **Document ID:** Auto-generate (click "Auto-ID" or leave blank)
- **Fields:**

| Field Name | Type | Value |
|------------|------|-------|
| `reportDate` | string | `2026-02-06` |
| `companyId` | string | `speccon` |
| `accountTypeId` | string | `bank-account` |
| `amount` | number | `1000000` |

- Click **"Save"**

#### Example 2: SpecCon Current Assets
- **Document ID:** Auto-generate
- **Fields:**
  - `reportDate`: `2026-02-06`
  - `companyId`: `speccon`
  - `accountTypeId`: `current-assets`
  - `amount`: `500000`
- Click **"Save"**

#### Example 3: SpecCon Current Liabilities
- **Document ID:** Auto-generate
- **Fields:**
  - `reportDate`: `2026-02-06`
  - `companyId`: `speccon`
  - `accountTypeId`: `current-liabilities`
  - `amount`: `200000`
- Click **"Save"**

#### Add More Companies
Repeat for other companies (megro, infinity, andebe, tap) with the same date `2026-02-06`.

**Quick way:** Copy the same structure but change `companyId`:
- Megro: `companyId`: `megro`
- Infinity: `companyId`: `infinity`
- Andebe: `companyId`: `andebe`
- TAP: `companyId`: `tap`

✅ **Sample data created!**

---

## Step 4: Verify Data

1. **Go back to your app**
2. **Refresh the page** (or log out and log back in)
3. **Change the date** to `2026-02-06` (if needed)
4. **You should see:**
   - Summary cards with totals
   - Chart showing company breakdown
   - Data for all companies

---

## Quick Sample Data Set

Here's a complete set you can add quickly:

### For Date: 2026-02-06

**SpecCon:**
- Bank: 1,000,000
- Assets: 500,000
- Liabilities: 200,000

**Megro:**
- Bank: 800,000
- Assets: 400,000
- Liabilities: 150,000

**Infinity:**
- Bank: 600,000
- Assets: 300,000
- Liabilities: 100,000

**Andebe:**
- Bank: 500,000
- Assets: 250,000
- Liabilities: 80,000

**TAP:**
- Bank: 400,000
- Assets: 200,000
- Liabilities: 60,000

**Total:** Create 15 documents (5 companies × 3 account types)

---

## Tips

1. **Use Auto-ID for cashPositions** - It's faster than typing document IDs
2. **Copy and paste** - Create one, then duplicate and modify
3. **Date format matters** - Use `YYYY-MM-DD` format (e.g., `2026-02-06`)
4. **Amounts are numbers** - Don't use commas or currency symbols
5. **Company IDs must match** - Use exact document IDs from companies collection

---

## Troubleshooting

### "No data showing"
- Check date matches exactly: `2026-02-06`
- Verify `companyId` matches company document IDs exactly
- Verify `accountTypeId` matches account type document IDs exactly
- Check `category` field in accountTypes matches: "Bank", "Current Assets", "Current Liabilities"

### "Unknown company"
- Check `companyId` spelling matches document ID exactly
- Verify company document has `active: true`

### "Amounts not adding up"
- Check `category` field in accountTypes is correct
- Verify amounts are numbers (not strings)

---

## Next Steps

Once you have sample data:
1. **Add more dates** - Create cash positions for different dates
2. **Add more account types** - Expand your chart of accounts
3. **Add real data** - Replace sample data with actual financial data

---

**That's it! Your dashboard should now show data! 🎉**
