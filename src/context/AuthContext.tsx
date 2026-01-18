import React, { createContext, useState, useContext, useEffect, use } from 'react';
import { User } from '../types/User';

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => void;
    register: (name: string, email: string, password: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = null;
            if (storedUser) {
                setUser(storedUser);
            }
        };
        fetchUser();
    }, []);
    // Testi käyttäjän kirjautumine 
    const login = (email: string, password: string) => {
        const loggedInUser: User = {
            id: '1',
            name: 'John Doe',
            email: email,
            createdAt: new Date(),
        };
        setUser(loggedInUser);
    }
    // Testi käytäjän rekisteröinti
    const register = (name: string, email: string, password: string) => {
        const newUser: User = {
            id: '2',
            name: name,
            email: email,
            createdAt: new Date(),
        };
        setUser(newUser);
    }
    const logout = () => {
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