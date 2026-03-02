# Firebase Cloud Sync Configuration

## Step 1: Create Firebase Project

1. Truy cập https://console.firebase.google.com
2. Click "Add project" → Enter "checklist-ban-hang" → Create project

## Step 2: Setup Firestore Database

1. Left sidebar → "Build" → "Firestore Database" → Create Database
2. Security rules: Start in **test mode** (cho development)
3. Location: **asia-southeast1** (gần Việt Nam)

## Step 3: Setup Authentication

1. Left sidebar → "Build" → "Authentication" → Get started
2. Click "Anonymous" → Enable → Save

## Step 4: Get Firebase Config

1. Project Settings (⚙️ icon top left)
2. Click "Your apps" → "Firestore for Web" tab
3. Copy toàn bộ `firebaseConfig` object

## Step 5: Setup .env.local

Tạo file `.env.local` ở **root project**:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

## Step 6: Update firebase.js

Thay thế config trong `src/firebase.js` bằng config từ Firebase Console

## Step 7: Firestore Security Rules (Optional)

Đối với production, update security rules:

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

## Features

✅ **Anonymous Auth** - Tự động đăng nhập anonymously  
✅ **Real-time Sync** - Dữ liệu sync across devices/browsers  
✅ **Auto-backup** - Save tới Firestore Cloud  
✅ **Offline Support** - Dùng localStorage khi offline  
✅ **Sync Status** - Hiển thị trạng thái sync (☁️ Synced, ⏳ Syncing, 📱 Offline)

## Test Cross-Device Sync

1. Mở page A trên device 1
2. Mở page B trên device 2 (different browser/phone)
3. Check item trên device 1 → Device 2 tự động update (real-time)

## Troubleshooting

**"Multiple instances of Firebase App detected"**

- Xóa package-lock.json, node_modules
- Chạy `npm install`

**"User login failed"**

- Check Firebase Authentication → Anonymous enabled

**Không sync được**

- Check browser console (F12)
- Verify Firestore security rules
- Check internet connection
