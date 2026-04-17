import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, db, doc, getDoc, setDoc } from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Check if user exists in Firestore, if not create it
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userData: User;
        if (!userDoc.exists()) {
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: firebaseUser.email === 'jordasx00x@gmail.com' ? 'admin' : 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, newUser);
          userData = {
            id: firebaseUser.uid,
            email: newUser.email,
            name: newUser.displayName,
            picture: newUser.photoURL,
            role: newUser.role
          };
        } else {
          const data = userDoc.data();
          userData = {
            id: firebaseUser.uid,
            email: data.email,
            name: data.displayName,
            picture: data.photoURL,
            role: data.role
          };
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const setAuth = (userData: User | null) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser: setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
