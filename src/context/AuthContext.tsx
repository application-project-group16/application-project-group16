import React, { createContext, useState, useContext, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/Config';
import { User } from '../Models/User';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// authia antava komponentti
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (snap.exists()) {
        const data = snap.data() as User;
        setUser({ ...data, uid: firebaseUser.uid }); 
      } else {
        setUser(null); 
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  });

  return unsubscribe;
}, []);

    // Testi käyttäjän kirjautumine 
    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Testi käytäjän rekisteröinti
    const register = async (name: string, email: string, password: string) => {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: User = {
            uid: credentials.user.uid,
            email,
            createdAt: new Date(),
            name,
            age: 0,
            sports: [],
            image: '',
            likedUsers: [],
            city: '',
            bio: '',
        };
        await setDoc(doc(db, 'users', credentials.user.uid), newUser);

        setUser(newUser);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    }
    
    useEffect(() => {
  signOut(auth)
}, [])

    return (
        <AuthContext.Provider 
        value={{ 
            user, 
            loading,
            login, 
            register, 
            logout,
            }}>
            {children}
        </AuthContext.Provider>
    );


}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

