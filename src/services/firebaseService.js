import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc,
  addDoc,
  orderBy,
  limit,
  Timestamp
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
      const company = companies.find(c => c.id === pos.companyId);
      summary[pos.companyId] = {
        companyId: pos.companyId,
        companyName: company?.name || 'Unknown',
        companyCode: company?.code || '',
        bankTotal: 0,
        assetsTotal: 0,
        liabilitiesTotal: 0
      };
    }
    
    const accountType = accountTypes.find(at => at.id === pos.accountTypeId);
    const category = accountType?.category || '';
    
    if (category === 'Bank') {
      summary[pos.companyId].bankTotal += pos.amount;
    } else if (category === 'Current Assets') {
      summary[pos.companyId].assetsTotal += pos.amount;
    } else if (category === 'Current Liabilities') {
      summary[pos.companyId].liabilitiesTotal += pos.amount;
    }
  });
  
  return Object.values(summary);
};

export const getAvailableDates = async () => {
  const positionsRef = collection(db, 'cashPositions');
  const snapshot = await getDocs(query(positionsRef, orderBy('reportDate', 'desc'), limit(20)));
  const dates = new Set();
  snapshot.docs.forEach(doc => dates.add(doc.data().reportDate));
  return Array.from(dates).sort().reverse();
};

