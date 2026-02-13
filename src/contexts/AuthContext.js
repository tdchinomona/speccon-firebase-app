import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            console.warn('User profile not found in Firestore. Please create user document with UID:', firebaseUser.uid);
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    try {
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        console.warn('User profile not found in Firestore. Please create user document with UID:', result.user.uid);
        throw new Error('User profile not found. Please contact administrator to create your user profile.');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.message.includes('offline') || error.message.includes('Failed to get document')) {
        throw new Error('User profile not found in database. Please ensure your user profile exists in Firestore.');
      }
      throw error;
    }
    return result;
  };

  const register = async (email, password, firstName, lastName, role = 'user') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const profile = {
      email,
      firstName,
      lastName,
      role,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', result.user.uid), profile);
    setUserProfile(profile);
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

