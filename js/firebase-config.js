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
    apiKey: "AIzaSyDuuKxml7yurRL1KEfmswbRrkGygE3rd5w",
    authDomain: "fkhr-elbn.firebaseapp.com",
    projectId: "fkhr-elbn",
    storageBucket: "fkhr-elbn.firebasestorage.app",
    messagingSenderId: "826322728576",
    appId: "1:826322728576:web:3cca07267e481a08da9865"
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
