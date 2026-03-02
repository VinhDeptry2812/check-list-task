# Firebase Setup - Chi Tiết Từng Bước

## 1️⃣ Tạo Firebase Project

**Bước 1: Tới Firebase Console**

- Link: https://console.firebase.google.com
- Click **"Add project"** (nút màu xanh)
- Nhập tên: `checklist-ban-hang`
- Click **Create project** → Chờ ~1 phút

**Kết quả:** Sẽ redirect tới dashboard project mới

---

## 2️⃣ Firestore Database - Cái Gì?

**Firestore = Cloud Database** (lưu data trên cloud)

Nó là:

- 🗄️ Database để lưu trữ checked items
- ☁️ Nằm trên server Firebase
- 🔄 Tự động sync giữa các devices
- ⚡ Real-time updates

**Structure dữ liệu:**

```
Firestore Database
└── Collection: "checklists"
    └── Document: userId (e.g., "user123")
        └── Fields:
            ├── checked: { a1: true, a2: false, ... }
            └── updatedAt: timestamp
```

---

## 3️⃣ Setup Firestore Database - Step by Step

**Trên Firebase Console (lần đầu tiên):**

1. **Sidebar trái** → Click **"Build"** section

   ```
   Build
   ├── Firestore Database ← Click cái này
   ├── Realtime Database
   ├── Authentication
   └── Storage
   ```

2. **Click "Firestore Database"** → Sẽ hiện button **"Create database"**
   - Click button xanh **"Create database"**

3. **Dialog popup hiện ra:**

   ```
   Secure rules for Cloud Firestore
   ┌─────────────────────────────────┐
   │ Start in test mode              │ ← Chọn cái này
   │ (Allow all reads/writes)        │
   │                                 │
   │ Start in production mode        │
   │ (Deny all reads/writes)         │
   └─────────────────────────────────┘
   ```

   - Chọn **"Start in test mode"** (vì đang dev)
   - Click **"Next"**

4. **Chọn Location (vị trí server):**

   ```
   Choose a location for your database
   ┌──────────────────────────┐
   │ asia-southeast1          │ ← Chọn Singapore
   │ (Singapore - gần VN)     │    (nhanh nhất từ VN)
   │                          │
   │ asia-southeast2 (...)    │
   │ asia-east1 (...)         │
   └──────────────────────────┘
   ```

   - Chọn **"asia-southeast1"**
   - Click **"Enable"**

5. **Chờ ~2 phút** → Firestore Database sẽ ready
   - Sẽ hiện giao diện: **Collections view** (trống, vì chưa có data)

✅ **Firestore Setup xong!**

---

## 4️⃣ Authentication Setup - Anonymous Login

**Tại Firebase Console:**

1. **Sidebar trái** → Click **"Authentication"**

   ```
   Build
   ├── Firestore Database
   ├── Realtime Database
   ├── Authentication ← Click cái này
   └── Storage
   ```

2. **Click "Get started"** (nếu chưa setup)

3. **Sign-in method tab:**
   - Tìm **"Anonymous"** trong danh sách
   - Click **"Anonymous"**
   - Toggle ON (bật)
   - Click **"Save"**

✅ **Authentication Setup xong!**

---

## 5️⃣ Get Firebase Config

**Tại Firebase Console:**

1. **Top left corner** → Click ⚙️ **"Project Settings"**

   ```
   Project Overview ┐
   Get started      ├─ Top Navigation
   Release notes    │
   Project Settings ⚙️ ← Click đây
   ```

2. **Tab "General"** → Scroll xuống tìm **"Your apps"**

   ```
   Your apps
   ┌────────────┬────────────┬────────────┐
   │ iOS        │ Android    │ Web        │
   └────────────┴────────────┴────────────┘
   ```

3. **Click "Web" (icon Firestore for Web)** → Copy block code:
   ```javascript
   // Copy toàn bộ firebaseConfig object
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "checklist-ban-hang.firebaseapp.com",
     projectId: "checklist-ban-hang",
     storageBucket: "checklist-ban-hang.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc...",
   };
   ```

---

## 6️⃣ Setup .env.local (Local Development)

**Ở folder project của bạn:**

1. **Tạo file** `.env.local` (ở root, cạnh package.json)

2. **Dán config vào:**

   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=checklist-ban-hang.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=checklist-ban-hang
   VITE_FIREBASE_STORAGE_BUCKET=checklist-ban-hang.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc...
   ```

3. **Lưu file** → Vite sẽ tự load khi dev

✅ **Setup xong! Giờ chạy:**

```bash
npm run dev
```

---

## 7️⃣ Test Cloud Sync

**Mở 2 tab browser:**

**Tab 1 (localhost:5174):**

- Check item #1 → Console: `☁️ Synced at HH:MM:SS`

**Tab 2 (localhost:5174):**

- Tự động update (check item #1 luôn)
- Data sync real-time từ Firestore! ✨

---

## ❌ Troubleshooting

| Lỗi                             | Nguyên nhân           | Fix                               |
| ------------------------------- | --------------------- | --------------------------------- |
| "Cannot find module 'firebase'" | Chưa cài              | `npm install firebase`            |
| "User login failed"             | Auth chưa enable      | Enable Anonymous ở Authentication |
| Không sync                      | Config sai            | Check `.env.local` values         |
| Chunk size warning              | Firebase SDK to large | Bỏ qua, chỉ là cảnh báo           |

---

## 📊 Firestore Pricing

- **Free tier**: 1GB storage, 50K reads/day
- **Perfect cho**: Dự án nhỏ, development, hobby

---

## 🎯 Summary

| Bước | Tên                | Tác dụng                   |
| ---- | ------------------ | -------------------------- |
| 1    | Create Project     | Tạo project trên Firebase  |
| 2    | Firestore Database | Tạo cloud database         |
| 3    | Authentication     | Enable anonymous login     |
| 4    | Get Config         | Lấy API keys               |
| 5    | .env.local         | Cấu hình local             |
| 6    | Test               | Kiểm tra sync cross-device |

Xong! 🚀
