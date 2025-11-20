import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as FirebaseUser,
    GoogleAuthProvider,
    signInWithCredential,
    updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Ensure WebBrowser completes auth sessions properly
WebBrowser.maybeCompleteAuthSession();

interface User {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Configure Google OAuth with Expo
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '224018111944-b2bt7garcbf2mejdi42hrttuc8ugc5me.apps.googleusercontent.com',
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(mapFirebaseUserToUser(firebaseUser));
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Handle Google OAuth response
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).catch((error) => {
                console.error('Google Sign-In error:', error);
            });
        }
    }, [response]);

    const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
        return {
            id: firebaseUser.uid,
            name: displayName,
            email: firebaseUser.email || '',
            avatarInitials: displayName.charAt(0).toUpperCase(),
            photoURL: firebaseUser.photoURL || undefined,
        };
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            throw new Error(error.message || 'Failed to sign in');
        }
    };

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: name,
                    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
                });
                // Force update local state
                setUser(mapFirebaseUserToUser({
                    ...userCredential.user,
                    displayName: name,
                    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
                }));
            }
        } catch (error: any) {
            throw new Error(error.message || 'Failed to sign up');
        }
    };

    const signInWithGoogle = async () => {
        try {
            await promptAsync();
        } catch (error: any) {
            throw new Error(error.message || 'Failed to sign in with Google');
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            throw new Error(error.message || 'Failed to sign out');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            signInWithEmail,
            signUpWithEmail,
            signInWithGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
