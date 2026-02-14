import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  limit,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const getCompanies = async () => {
  const companiesRef = collection(db, 'companies');
  const snapshot = await getDocs(query(companiesRef, where('active', '==', true)));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAccountTypes = async () => {
  const accountTypesRef = collection(db, 'accountTypes');
  const snapshot = await getDocs(query(accountTypesRef, orderBy('displayOrder')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSubAccounts = async () => {
  const subAccountsRef = collection(db, 'subAccounts');
  const snapshot = await getDocs(query(subAccountsRef, where('active', '==', true), orderBy('displayOrder')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCashPositions = async (date) => {
  const positionsRef = collection(db, 'cashPositions');
  const q = query(positionsRef, where('reportDate', '==', date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCashSummary = async (date) => {
  const positions = await getCashPositions(date);
  const companies = await getCompanies();
  const accountTypes = await getAccountTypes();
  
  const summary = {};
  
  positions.forEach(pos => {
    if (!summary[pos.companyId]) {
      // Case-insensitive lookup for company
      const company = companies.find(c => 
        c.id.toLowerCase() === (pos.companyId || '').toLowerCase()
      );
      summary[pos.companyId] = {
        companyId: pos.companyId,
        companyName: company?.name || `Unknown (ID: ${pos.companyId})`,
        companyCode: company?.code || '',
        bankTotal: 0,
        assetsTotal: 0,
        liabilitiesTotal: 0
      };
    }
    
    const accountType = accountTypes.find(at => 
      at.id.toLowerCase() === (pos.accountTypeId || '').toLowerCase()
    );
    const category = accountType?.category || '';
    const amount = Number(pos.amount) || 0;
    
    // If account type not found, try to infer category from common patterns
    let inferredCategory = category;
    if (!category && pos.accountTypeId) {
      const accountTypeLower = pos.accountTypeId.toLowerCase();
      if (accountTypeLower.includes('bank') || accountTypeLower.includes('cash')) {
        inferredCategory = 'Bank';
      } else if (accountTypeLower.includes('asset') || accountTypeLower.includes('receivable') || accountTypeLower.includes('loan')) {
        inferredCategory = 'Current Assets';
      } else if (accountTypeLower.includes('liabilit') || accountTypeLower.includes('payable') || accountTypeLower.includes('debt')) {
        inferredCategory = 'Current Liabilities';
      }
    }
    
    if (inferredCategory === 'Bank') {
      summary[pos.companyId].bankTotal += amount;
    } else if (inferredCategory === 'Current Assets') {
      summary[pos.companyId].assetsTotal += amount;
    } else if (inferredCategory === 'Current Liabilities') {
      summary[pos.companyId].liabilitiesTotal += amount;
    }
  });
  
  return Object.values(summary);
};

export const getCashSummaryWithSubAccounts = async (date) => {
  const positions = await getCashPositions(date);
  const companies = await getCompanies();
  const accountTypes = await getAccountTypes();
  const subAccounts = await getSubAccounts();
  
  const summary = {};
  const subAccountDetails = {};
  
  positions.forEach(pos => {
    if (!summary[pos.companyId]) {
      // Case-insensitive lookup for company
      const company = companies.find(c => 
        c.id.toLowerCase() === (pos.companyId || '').toLowerCase()
      );
      summary[pos.companyId] = {
        companyId: pos.companyId,
        companyName: company?.name || `Unknown (ID: ${pos.companyId})`,
        companyCode: company?.code || '',
        bankTotal: 0,
        assetsTotal: 0,
        liabilitiesTotal: 0,
        subAccounts: {}
      };
    }
    
    const accountType = accountTypes.find(at => 
      at.id.toLowerCase() === (pos.accountTypeId || '').toLowerCase()
    );
    const category = accountType?.category || '';
    const amount = Number(pos.amount) || 0;
    
    // If account type not found, try to infer category from common patterns
    let inferredCategory = category;
    if (!category && pos.accountTypeId) {
      const accountTypeLower = pos.accountTypeId.toLowerCase();
      if (accountTypeLower.includes('bank') || accountTypeLower.includes('cash')) {
        inferredCategory = 'Bank';
      } else if (accountTypeLower.includes('asset') || accountTypeLower.includes('receivable') || accountTypeLower.includes('loan')) {
        inferredCategory = 'Current Assets';
      } else if (accountTypeLower.includes('liabilit') || accountTypeLower.includes('payable') || accountTypeLower.includes('debt')) {
        inferredCategory = 'Current Liabilities';
      }
    }
    
    // Track sub-account details
    if (pos.subAccountId) {
      const subAccount = subAccounts.find(sa => 
        sa.id.toLowerCase() === (pos.subAccountId || '').toLowerCase()
      );
      const subAccountKey = `${pos.companyId}_${pos.accountTypeId}_${pos.subAccountId}`;
      
      if (!subAccountDetails[subAccountKey]) {
        subAccountDetails[subAccountKey] = {
          companyId: pos.companyId,
          companyName: summary[pos.companyId].companyName,
          accountTypeId: pos.accountTypeId,
          accountTypeName: accountType?.name || pos.accountTypeId,
          subAccountId: pos.subAccountId,
          subAccountName: subAccount?.name || pos.subAccountId,
          amount: 0
        };
      }
      subAccountDetails[subAccountKey].amount += amount;
    }
    
    // Update totals by category
    if (inferredCategory === 'Bank') {
      summary[pos.companyId].bankTotal += amount;
    } else if (inferredCategory === 'Current Assets') {
      summary[pos.companyId].assetsTotal += amount;
    } else if (inferredCategory === 'Current Liabilities') {
      summary[pos.companyId].liabilitiesTotal += amount;
    }
  });
  
  return {
    summary: Object.values(summary),
    subAccountDetails: Object.values(subAccountDetails)
  };
};

export const getAvailableDates = async () => {
  const positionsRef = collection(db, 'cashPositions');
  const snapshot = await getDocs(query(positionsRef, orderBy('reportDate', 'desc'), limit(20)));
  const dates = new Set();
  snapshot.docs.forEach(doc => dates.add(doc.data().reportDate));
  return Array.from(dates).sort().reverse();
};

export const addCashPosition = async (position) => {
  const positionsRef = collection(db, 'cashPositions');
  const data = {
    reportDate: position.reportDate,
    companyId: position.companyId,
    accountTypeId: position.accountTypeId,
    amount: Number(position.amount)
  };
  
  // Add subAccountId if provided
  if (position.subAccountId) {
    data.subAccountId = position.subAccountId;
  }
  
  return await addDoc(positionsRef, data);
};

export const batchAddCashPositions = async (positions) => {
  const results = [];
  
  // Process each position
  for (const position of positions) {
    try {
      const result = await addCashPosition(position);
      results.push({ success: true, id: result.id });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
};
