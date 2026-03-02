# Firebase Cloud Sync Setup

## 1. Firebase Console Setup

1. Tới https://console.firebase.google.com
2. Click "Add project" → Nhập "checklist-ban-hang" → Create
3. Chọn project mới tạo
4. Ở sidebar: "Build" → "Firestore Database" → Create Database
   - Location: asia-southeast1 (Việt Nam)
   - Security rules: Start in test mode
5. Ở sidebar: "Build" → "Authentication" → "Get started"
   - Enable "Anonymous" provider → Save
6. Project Settings (⚙️ icon) → "Your apps" → "Firestore for Web"
   - Copy firebaseConfig object

## 2. .env Local Setup

Tạo file `.env` ở root project:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

## 3. Update firebase.js

Thay config values từ Firebase Console

## 4. Features

✅ Anonymous Auth - User tự động login
✅ Real-time Sync - Data sync across devices
✅ Auto-backup - Save tới cloud
✅ Offline Support - Dùng localStorage khi offline

## 5. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /checklists/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
