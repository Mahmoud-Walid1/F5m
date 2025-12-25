# موقع فخم البن - دليل الاستخدام الكامل

##  المشروع

موقع منيو رقمي فخم وخفيف باستخدام:
- ✅ HTML/CSS/JavaScript (بدون frameworks)
- ✅ Firebase (قاعدة بيانات + مصادقة)
- ✅ GitHub (تخزين الصور - قريباً)
- ✅ تصميم بنفسجي فخم مع انيميشن
- ✅ Responsive كامل

---

## 🚀 البدء السريع

### الخطوة 1: إعداد Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. **Create a project** → اسم: `fakhr-alban`
3. فعّل:
   - **Firestore Database** (test mode)
   - **Authentication** (Email/Password)
4. من **Project Settings** → **Web**, انسخ `firebaseConfig`

### الخطوة 2: تحديث الإعدادات

افتح `js/firebase-config.js` واستبدل القيم:

```javascript
const firebaseConfig = {
    apiKey: "AIza...",  // من Firebase
    authDomain: "fakhr-alban.firebaseapp.com",
    projectId: "fakhr-alban",
    storageBucket: "fakhr-alban.appspot.com",
    messagingSenderId: "123...",
    appId: "1:123..."
};
```

### الخطوة 3: إضافة بيانات تجريبية

**Collection: `categories`**

Document ID: `drinks`
```
nameAr: المشروبات
icon: ☕
order: 1
isActive: true
theme: {
  primaryColor: #6B52A3,
  secondaryColor: #8B7AB8,
  backgroundColor: #FAF6F1
}
createdAt: (timestamp)
```

**Collection: `products`**

Document ID: `cappuccino`
```
nameAr: كابتشينو
descriptionAr: قهوة إيطالية كلاسيكية
categoryId: drinks
image: (اتركه فاضي)
order: 1
isActive: true
hasHot: true
hasCold: true
sizes: [
  {name: صغير, price: 15, isAvailable: true},
  {name: وسط, price: 18, isAvailable: true},
  {name: كبير, price: 21, isAvailable: true}
]
createdAt: (timestamp)
```

### الخطوة 4: تشغيل الموقع

افتح `index.html` في المتصفح!

الموقع هيشتغل ويعرض:
- ✅ الأقسام (3 في كل صف)
- ✅ المنتجات لما تضغط على قسم
- ✅ انيميشن كوب القهوة

---

## 📁 هيكل الملفات

```
موقع-المنيو/
├── index.html          → الصفحة الرئيسية
├── login.html          → تسجيل دخول الأدمن
├── css/
│   ├── style.css       → التصميم الرئيسي
│   ├── animations.css  → الحركات
│   └── admin.css       → تصميم الأدمن
├── js/
│   ├── firebase-config.js  → إعدادات Firebase
│   └── app.js              → المنطق الرئيسي
└── README.md           → هذا الملف
```

---

## 🎨 المميزات

### واجهة العملاء
- ✅ عرض الأقسام بشكل جذاب
- ✅ Modal للمنتجات مع التفاصيل
- ✅ دعم الأحجام المتعددة
- ✅ خيارات حار/بارد
- ✅ انيميشن عند التحميل
- ✅ Responsive كامل

### لوحة التحكم
- ✅ تسجيل دخول آمن
- 🔄 Dashboard (قريباً)
- 🔄 إدارة الأقسام (قريباً)
- 🔄 إدارة المنتجات (قريباً)
- 🔄 رفع صور لـ GitHub (قريباً)

---

## 🌐 النشر

### GitHub Pages (مجاني)

1. ارفع الملفات لـ GitHub repo
2. Settings → Pages → Enable
3. الموقع سيكون على: `username.github.io/repo`

### Netlify (مجاني)

1. [netlify.com](https://netlify.com)
2. Drag & Drop المجلد
3. Deploy فوراً!

---

## ⚙️ Firebase Security Rules

في **Firestore → Rules**, الصق:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    match /{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## ❓ الأسئلة الشائعة

**س: الموقع لا يعرض أقسام؟**  
ج: تأكد من:
1. Firebase config صحيح في `firebase-config.js`
2. أضفت بيانات تجريبية في Firestore

**س: كيف أضيف منتجات؟**  
ج: حالياً من Firebase Console مباشرة. صفحة الأدمن قريباً!

**س: الصور لا تظهر؟**  
ج: طبيعي! رابط الـ GitHub image upload قريباً. حالياً اترك `image` فاضي.

**س: أين لوحة التحكم؟**  
ج: login.html موجود، الـ Dashboard كامل قريباً!

---

## 🔜 الخطوات القادمة

1. ✅ واجهة العملاء (مكتملة)
2. 🔄 Dashboard كامل
3. 🔄 صفحات إدارة (CRUD)
4. 🔄 رفع صور لـ GitHub
5. 🔄 إدارة إعلانات

---

## 📞 الدعم

الموقع شغال 100%! لو محتاج مساعدة في:
- إكمال Dashboard
- رفع الصور
- أي ميزة إضافية

قولي! 😊

---

**صُنع بـ ❤️ للسعودية**
