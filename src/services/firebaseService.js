import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  limit,
  addDoc,
  doc,
  writeBatch
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
      // Always use name from database if available, otherwise format the ID
      let displayName = pos.companyId;
      if (company?.name) {
        displayName = company.name;
      } else if (pos.companyId) {
        // Format ID: capitalize first letter of each word
        displayName = pos.companyId
          .split(/[-_\s]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      summary[pos.companyId] = {
        companyId: pos.companyId,
        companyName: displayName,
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
  
  // Debug logging
  console.log('=== Sub-Account Debug Info ===');
  console.log('Date:', date);
  console.log('Total positions:', positions.length);
  console.log('Positions with subAccountId:', positions.filter(p => p.subAccountId).length);
  console.log('Available sub-accounts in Firestore:', subAccounts.map(sa => ({ id: sa.id, name: sa.name, active: sa.active })));
  console.log('Sub-account IDs in positions:', [...new Set(positions.filter(p => p.subAccountId).map(p => p.subAccountId))]);
  
  const summary = {};
  const subAccountDetails = {};
  
  positions.forEach(pos => {
    if (!summary[pos.companyId]) {
      // Case-insensitive lookup for company
      const company = companies.find(c => 
        c.id.toLowerCase() === (pos.companyId || '').toLowerCase()
      );
      // Always use name from database if available, otherwise format the ID
      let displayName = pos.companyId;
      if (company?.name) {
        displayName = company.name;
      } else if (pos.companyId) {
        // Format ID: capitalize first letter of each word
        displayName = pos.companyId
          .split(/[-_\s]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      summary[pos.companyId] = {
        companyId: pos.companyId,
        companyName: displayName,
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
      
      // Debug logging (can be removed in production)
      if (!subAccount) {
        console.warn(`Sub-account not found in Firestore: "${pos.subAccountId}". Available sub-accounts:`, subAccounts.map(sa => sa.id));
      }
      
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
  
  // Debug logging
  console.log('Sub-account details found:', Object.keys(subAccountDetails).length);
  console.log('Sub-account details:', Object.values(subAccountDetails));
  console.log('=== End Debug Info ===');
  
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

export const deleteAllCashPositions = async () => {
  try {
    const positionsRef = collection(db, 'cashPositions');
    const snapshot = await getDocs(positionsRef);
    
    // Use batch writes for efficient deletion (max 500 per batch)
    const batchSize = 500;
    const docs = snapshot.docs;
    let deletedCount = 0;
    
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchDocs = docs.slice(i, i + batchSize);
      
      batchDocs.forEach((document) => {
        batch.delete(doc(db, 'cashPositions', document.id));
      });
      
      await batch.commit();
      deletedCount += batchDocs.length;
    }
    
    return { success: true, deletedCount };
  } catch (error) {
    console.error('Error deleting cash positions:', error);
    return { success: false, error: error.message };
  }
};
