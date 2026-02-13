# 📊 Sub-Accounts Setup Guide

## Overview

You can now add sub-accounts under account types. For example:
- **Account Type:** Current Assets
  - **Sub-account:** Accounts Receivable
  - **Sub-account:** Client Loans
  - **Sub-account:** Inventory

This allows for more detailed financial reporting.

---

## Data Structure

### Collections Needed:

1. **accountTypes** (existing) - Main account categories
2. **subAccounts** (new) - Sub-accounts under account types
3. **cashPositions** (updated) - Now supports optional `subAccountId`

---

## Step 1: Create Sub-Accounts Collection

### Go to Firestore Database
1. Firebase Console → **Firestore Database**
2. Click **"Start collection"**

### Create Collection
- **Collection ID:** `subAccounts`
- Click **"Next"**

### Add Sub-Account Documents

Each sub-account must link to a parent account type.

#### Example 1: Accounts Receivable
- **Document ID:** `accounts-receivable` (or any ID you like)
- **Fields:**

| Field Name | Type | Value |
|------------|------|-------|
| `name` | string | `Accounts Receivable` |
| `accountTypeId` | string | `current-assets` (must match account type document ID) |
| `displayOrder` | number | `1` |
| `active` | boolean | `true` |

#### Example 2: Client Loans
- **Document ID:** `client-loans`
- **Fields:**
  - `name`: `Client Loans`
  - `accountTypeId`: `current-assets`
  - `displayOrder`: `2`
  - `active`: `true`

#### Example 3: Inventory
- **Document ID:** `inventory`
- **Fields:**
  - `name`: `Inventory`
  - `accountTypeId`: `current-assets`
  - `displayOrder`: `3`
  - `active`: `true`

**Repeat for other account types:**
- Under "Bank": `savings-account`, `checking-account`, etc.
- Under "Current Liabilities": `accounts-payable`, `short-term-debt`, etc.

---

## Step 2: Update Cash Positions

### Option A: With Sub-Account (Recommended)

When adding cash positions, you can now include a `subAccountId`:

| Field Name | Type | Value | Example |
|------------|------|-------|---------|
| `reportDate` | string | Date | `2026-02-13` |
| `companyId` | string | Company ID | `speccon` |
| `accountTypeId` | string | Account Type ID | `current-assets` |
| `subAccountId` | string | Sub-Account ID (optional) | `accounts-receivable` |
| `amount` | number | Amount | `500000` |

### Option B: Without Sub-Account (Backward Compatible)

You can still add cash positions without sub-accounts (for backward compatibility):

| Field Name | Type | Value |
|------------|------|-------|
| `reportDate` | string | `2026-02-13` |
| `companyId` | string | `speccon` |
| `accountTypeId` | string | `current-assets` |
| `amount` | number | `500000` |

**Note:** `subAccountId` is optional. If not provided, the amount is attributed to the account type directly.

---

## Example: Complete Structure

### Account Types:
- `current-assets` (Current Assets)
- `bank-account` (Bank)
- `current-liabilities` (Current Liabilities)

### Sub-Accounts under Current Assets:
- `accounts-receivable` → `accountTypeId: current-assets`
- `client-loans` → `accountTypeId: current-assets`
- `inventory` → `accountTypeId: current-assets`

### Cash Positions:
```
reportDate: 2026-02-13
companyId: speccon
accountTypeId: current-assets
subAccountId: accounts-receivable
amount: 500000
```

---

## How It Works

1. **Dashboard shows totals by category** (Bank, Assets, Liabilities) - same as before
2. **Sub-accounts are used for detailed breakdown** - you can see which sub-accounts contribute to totals
3. **Backward compatible** - existing data without sub-accounts still works

---

## Next Steps

After setting up sub-accounts:
1. Update your CSV import to include `subAccountId` column (optional)
2. The dashboard will automatically show sub-account details
3. You can filter/group by sub-accounts in reports

---

**See the updated CSV import guide for how to include sub-accounts in your CSV files.**
