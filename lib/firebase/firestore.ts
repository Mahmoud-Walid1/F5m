import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    DocumentData
} from 'firebase/firestore';
import { db } from './config';
import type { Category, Product, Announcement, SiteSettings, Admin } from '@/types';

// Helper to convert Firestore timestamp to Date
const convertTimestamp = (data: DocumentData) => {
    const converted: any = { ...data };
    Object.keys(converted).forEach(key => {
        if (converted[key] instanceof Timestamp) {
            converted[key] = converted[key].toDate();
        } else if (typeof converted[key] === 'object' && converted[key] !== null) {
            // Handle nested timestamps
            Object.keys(converted[key]).forEach(nestedKey => {
                if (converted[key][nestedKey] instanceof Timestamp) {
                    converted[key][nestedKey] = converted[key][nestedKey].toDate();
                }
            });
        }
    });
    return converted;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('isActive', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamp(doc.data())
    } as Category));
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...convertTimestamp(docSnap.data()) } as Category;
    }
    return null;
};

// Products
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
    const productsRef = collection(db, 'products');
    const q = query(
        productsRef,
        where('categoryId', '==', categoryId),
        where('isActive', '==', true),
        orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamp(doc.data())
    } as Product));
};

export const getAllProducts = async (): Promise<Product[]> => {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('isActive', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamp(doc.data())
    } as Product));
};

// Announcements
export const getActiveAnnouncements = async (): Promise<Announcement[]> => {
    const announcementsRef = collection(db, 'announcements');
    const now = new Date();
    const q = query(
        announcementsRef,
        where('isActive', '==', true),
        orderBy('priority', 'desc')
    );
    const snapshot = await getDocs(q);

    // Filter by date range if exists
    const announcements = snapshot.docs
        .map(doc => ({
            id: doc.id,
            ...convertTimestamp(doc.data())
        } as Announcement))
        .filter(announcement => {
            if (!announcement.displayDates) return true;
            return announcement.displayDates.start <= now && announcement.displayDates.end >= now;
        });

    return announcements;
};

// Site Settings
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
    const docRef = doc(db, 'settings', 'site_settings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
    }
    return null;
};

// Admin Functions (for admin panel)
export const addDocument = async (collectionName: string, data: any) => {
    const colRef = collection(db, collectionName);
    return await addDoc(colRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
    const docRef = doc(db, collectionName, id);
    return await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

export const deleteDocument = async (collectionName: string, id: string) => {
    const docRef = doc(db, collectionName, id);
    return await deleteDoc(docRef);
};
