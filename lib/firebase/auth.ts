import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { Admin } from '@/types';

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

/**
 * Sign out
 */
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

/**
 * Get current admin data
 */
export const getCurrentAdmin = async (uid: string): Promise<Admin | null> => {
    try {
        const adminDoc = await getDoc(doc(db, 'admins', uid));
        if (adminDoc.exists()) {
            return { id: adminDoc.id, ...adminDoc.data() } as Admin;
        }
        return null;
    } catch (error) {
        console.error('Error getting admin data:', error);
        return null;
    }
};

/**
 * Check if user is super admin
 */
export const isSuperAdmin = async (uid: string): Promise<boolean> => {
    const admin = await getCurrentAdmin(uid);
    return admin?.role === 'super_admin' || false;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};
