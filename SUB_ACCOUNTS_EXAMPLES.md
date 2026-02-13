# 📋 Sub-Accounts Examples

## What Are Sub-Accounts?

Sub-accounts allow you to break down account types into more detailed categories. For example:

**Account Type:** Current Assets
- **Sub-Account:** Accounts Receivable
- **Sub-Account:** Client Loans
- **Sub-Account:** Inventory
- **Sub-Account:** Prepaid Expenses

This gives you more granular reporting and better insights into your financial position.

---

## Example Structure

### Account Types (Main Categories)
1. **Bank** (`bank-account`)
2. **Current Assets** (`current-assets`)
3. **Current Liabilities** (`current-liabilities`)

### Sub-Accounts Under "Current Assets"

| Sub-Account ID | Name | Account Type ID |
|----------------|------|-----------------|
| `accounts-receivable` | Accounts Receivable | `current-assets` |
| `client-loans` | Client Loans | `current-assets` |
| `inventory` | Inventory | `current-assets` |
| `prepaid-expenses` | Prepaid Expenses | `current-assets` |

### Sub-Accounts Under "Bank"

| Sub-Account ID | Name | Account Type ID |
|----------------|------|-----------------|
| `savings-account` | Savings Account | `bank-account` |
| `checking-account` | Checking Account | `bank-account` |
| `money-market` | Money Market | `bank-account` |

### Sub-Accounts Under "Current Liabilities"

| Sub-Account ID | Name | Account Type ID |
|----------------|------|-----------------|
| `accounts-payable` | Accounts Payable | `current-liabilities` |
| `short-term-debt` | Short-Term Debt | `current-liabilities` |
| `accrued-expenses` | Accrued Expenses | `current-liabilities` |

---

## How to Set Up in Firestore

### Step 1: Create Sub-Accounts Collection

1. Firebase Console → Firestore Database
2. Click **"Start collection"**
3. **Collection ID:** `subAccounts`
4. Click **"Next"**

### Step 2: Add Sub-Account Documents

#### Example: Accounts Receivable

- **Document ID:** `accounts-receivable`
- **Fields:**

| Field | Type | Value |
|-------|------|-------|
| `name` | string | `Accounts Receivable` |
| `accountTypeId` | string | `current-assets` |
| `displayOrder` | number | `1` |
| `active` | boolean | `true` |

#### Example: Client Loans

- **Document ID:** `client-loans`
- **Fields:**

| Field | Type | Value |
|-------|------|-------|
| `name` | string | `Client Loans` |
| `accountTypeId` | string | `current-assets` |
| `displayOrder` | number | `2` |
| `active` | boolean | `true` |

**Important:** The `accountTypeId` must match an existing account type document ID.

---

## CSV Import Examples

### Without Sub-Accounts (Simple)
```csv
reportDate,companyId,accountTypeId,subAccountId,amount
2026-02-13,speccon,current-assets,,750000
```
**Result:** R750,000 is attributed to "Current Assets" directly.

### With Sub-Accounts (Detailed)
```csv
reportDate,companyId,accountTypeId,subAccountId,amount
2026-02-13,speccon,current-assets,accounts-receivable,500000
2026-02-13,speccon,current-assets,client-loans,250000
```
**Result:** 
- R500,000 in Accounts Receivable
- R250,000 in Client Loans
- **Total:** R750,000 in Current Assets

---

## Dashboard Display

### Summary View (Default)
- Shows totals by category: Bank, Assets, Liabilities
- Same as before - sub-accounts are aggregated

### Detailed View (New)
- Click **"Show Details"** in Sub-Account Breakdown section
- See individual sub-account amounts
- Grouped by company and account type

---

## Benefits

1. **More Detailed Reporting** - See exactly where money is
2. **Better Analysis** - Understand composition of assets/liabilities
3. **Flexible** - Use sub-accounts where needed, skip where not needed
4. **Backward Compatible** - Existing data without sub-accounts still works

---

## Common Use Cases

### Use Sub-Accounts For:
- ✅ Breaking down "Current Assets" into specific types
- ✅ Separating different bank accounts
- ✅ Categorizing different types of liabilities
- ✅ Tracking specific receivables or payables

### Don't Need Sub-Accounts For:
- Simple reporting where totals are enough
- When you only have one type per account category
- Initial setup (you can add later)

---

## Migration Path

### Option 1: Start Without Sub-Accounts
1. Import data without `subAccountId` column
2. Add sub-accounts later in Firestore
3. Update existing records or add new ones with sub-accounts

### Option 2: Start With Sub-Accounts
1. Create sub-accounts in Firestore first
2. Include `subAccountId` in your CSV from the start
3. Get detailed reporting immediately

**Both approaches work!** The system is flexible.

---

**See `SUB_ACCOUNTS_SETUP.md` for detailed setup instructions.**
