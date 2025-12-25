// Firebase Configuration
// Replace these values with your Firebase project credentials
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// ============================================
// Firebase Configuration
// ============================================
// احصل على البيانات من Firebase Console:
// 1. روح: https://console.firebase.google.com
// 2. اختر مشروعك (أو أنشئ واحد جديد)
// 3. اضغط ⚙️ → Project Settings
// 4. انزل لـ "Your apps" → اختر Web app (أو أضف واحد)
// 5. انسخ الـ config كله والصقه هنا ↓

const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxx"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore Database
const db = firebase.firestore();

// Auth
const auth = firebase.auth();

// Export for use
window.db = db;
window.auth = auth;
window.firebase = firebase;
