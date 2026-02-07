import React, { createContext, useState, useContext, useEffect, use } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/Config';
import { User } from '../Models/User';

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => void;
    register: (name: string, email: string, age: number, gender: string, location: string, password: string, bio?: string | null) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// authia antava komponentti
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                return;
            }

            const ref = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setUser(snap.data() as User);
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    // Testi käyttäjän kirjautumine 
    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Testi käytäjän rekisteröinti
    const register = async (name: string, email: string, age: number, gender: string, location: string, password: string, bio?: string) => {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: User = {
            uid: credentials.user.uid,
            name: name,
            email: email,
            age: age,
            gender: gender,
            location: location,
            bio: bio,
            createdAt: new Date(),
            sports: []
        };
        await setDoc(doc(db, 'users', credentials.user.uid), newUser);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    }
    
    return (
        <AuthContext.Provider 
        value={{ 
            user, 
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