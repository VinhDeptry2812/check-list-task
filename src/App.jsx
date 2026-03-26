import { useState, useEffect } from "react";
import {
  auth, db, signInAnonymously, onAuthStateChanged,
  doc, setDoc, getDoc, onSnapshot
} from "./firebase";

const SECTIONS = [
  {
    id: "vinh",
    icon: "👨‍💻",
    title: "Nhiệm vụ của Vinh",
    color: "#6366f1",
    items: [
      { id: "a1", text: "[Tài Khoản] Đăng ký tài khoản & Mã hóa mật khẩu", priority: "must" },
      { id: "a2", text: "[Tài Khoản] Xác thực & Ủy quyền (JWT/OAuth2)", priority: "must" },
      { id: "a3", text: "[Tài Khoản] Đăng nhập Google/Facebook", priority: "should" },
      { id: "a4", text: "[Tài Khoản] Quên mật khẩu & Gửi mail xác nhận", priority: "must" },
      { id: "a5", text: "[Tài Khoản] Xác thực tài khoản (Email Confirmation)", priority: "should" },
      { id: "a7", text: "[Tài Khoản] Chỉnh sửa Profile & Đổi mật khẩu", priority: "must" },
      { id: "a8", text: "[Tài Khoản] Quản lý địa chỉ giao hàng (CRUD)", priority: "must" },
      { id: "a9", text: "[Tài Khoản] API Lịch sử đơn hàng cá nhân", priority: "must" },
      { id: "a10", text: "[Tài Khoản] Logic Danh sách yêu thích (Wishlist)", priority: "should" },
      { id: "p1", text: "[Sản Phẩm] Quản lý Danh mục đa cấp", priority: "must" },
      { id: "p2", text: "[Sản Phẩm] API Danh sách sản phẩm (Phân trang)", priority: "must" },
      { id: "p3", text: "[Sản Phẩm] Chi tiết sản phẩm & SKU logic", priority: "must" },
      { id: "p4", text: "[Sản Phẩm] Upload & Lưu trữ hình ảnh (Cloudinary/S3)", priority: "must" },
      { id: "p5", text: "[Sản Phẩm] Thuộc tính sản phẩm (Variants)", priority: "should" },
      { id: "p6", text: "[Sản Phẩm] Logic tính giá & Giảm giá phía Server", priority: "must" },
      { id: "p7", text: "[Sản Phẩm] Đồng bộ tồn kho real-time", priority: "must" },
      { id: "p8", text: "[Sản Phẩm] Tìm kiếm sản phẩm (Query params)", priority: "must" },
      { id: "p9", text: "[Sản Phẩm] Lọc theo giá, danh mục, thuộc tính", priority: "should" },
      { id: "p10", text: "[Sản Phẩm] Sản phẩm liên quan / Đề xuất", priority: "should" },
      { id: "p11", text: "[Sản Phẩm] Badge tự động: New, Hot, Sale", priority: "should" },
      { id: "ad4", text: "[Admin] Quản lý khách hàng & Tài khoản", priority: "must" },
      { id: "ad8", text: "[Admin] Phân quyền dựa trên vai trò (RBAC)", priority: "must" },
      { id: "ad10", text: "[Admin] Chiến lược Backup DB tự động", priority: "must" }
    ],
  },
  {
    id: "thanh",
    icon: "👨‍💻",
    title: "Nhiệm vụ của Thanh",
    color: "#f59e0b",
    items: [
      { id: "c1", text: "[Giỏ Hàng] Giỏ hàng Persistence (Redis/DB)", priority: "must" },
      { id: "c2", text: "[Giỏ Hàng] Kiểm tra tồn kho khi thêm/sửa giỏ", priority: "must" },
      { id: "c3", text: "[Giỏ Hàng] Tính tổng tiền & Thuế (Server-side)", priority: "must" },
      { id: "c4", text: "[Giỏ Hàng] Verify tồn kho trước khi thanh toán", priority: "must" },
      { id: "c5", text: "[Giỏ Hàng] Hệ thống mã giảm giá (Discount logic)", priority: "should" },
      { id: "c6", text: "[Giỏ Hàng] Thông tin giao hàng & Tích hợp phí ship", priority: "must" },
      { id: "c9", text: "[Giỏ Hàng] DB Transaction xử lý đặt hàng", priority: "must" },
      { id: "c11", text: "[Giỏ Hàng] Trigger Email xác nhận đơn hàng", priority: "must" },
      { id: "pay1", text: "[Thanh Toán] Thanh toán khi nhận hàng (COD)", priority: "must" },
      { id: "pay2", text: "[Thanh Toán] Tích hợp API cổng nội địa (VNPAY/Momo)", priority: "should" },
      { id: "pay9", text: "[Thanh Toán] Xử lý Webhooks / Callback thanh toán", priority: "must" },
      { id: "m3", text: "[Marketing] Quản lý chiến dịch Voucher/Coupon", priority: "must" },
      { id: "m1", text: "[Marketing] Engine Flash Sale (Time-limited)", priority: "should" },
      { id: "m8", text: "[Marketing] Tracking sự kiện & Thống kê Server-side", priority: "must" },
      { id: "m9", text: "[Marketing] Tối ưu URL SEO-friendly & Dynamic Sitemap", priority: "must" }
    ],
  },
  {
    id: "phuc",
    icon: "👨‍💻",
    title: "Nhiệm vụ của Phúc",
    color: "#10b981",
    items: [
      { id: "o0", text: "[Đơn Hàng] Tạo đơn hàng & Lưu database (Order creation)", priority: "must" },
      { id: "o1", text: "[Đơn Hàng] Luồng trạng thái: Chờ duyệt -> Giao -> Nhận", priority: "must" },
      { id: "o3", text: "[Đơn Hàng] Hủy đơn hàng & Hoàn tồn kho", priority: "must" },
      { id: "o4", text: "[Đơn Hàng] Quy trình Đổi trả & Hoàn tiền (Refund)", priority: "should" },
      { id: "o7", text: "[Đơn Hàng] Background Job tự động cập nhật đơn", priority: "nice" },
      { id: "ad1", text: "[Admin] Dashboard tổng quan (Chart/Statistics)", priority: "must" },
      { id: "ad3", text: "[Admin] CMS Quản lý đơn hàng & Xử trị", priority: "must" }
    ],
  },
  {
    id: "tech_security",
    icon: "🔒",
    title: "Kỹ Thuật & Bảo Mật (Chưa ưu tiên)",
    color: "#64748b",
    items: [
      { id: "t1", text: "Triển khai HTTPS & SSL Certificate", priority: "must" },
      { id: "t11", text: "Xác thực API (JWT / Session Security)", priority: "must" },
      { id: "t6", text: "API Rate Limiting & Chống Spam", priority: "should" },
      { id: "t5", text: "Bảo mật chống XSS, CSRF, SQL Injection", priority: "must" },
      { id: "t12", text: "Tối ưu hiệu năng: Caching (Redis/CDN)", priority: "must" },
      { id: "t4", text: "Tối ưu tài nguyên: Image Compression", priority: "should" },
      { id: "t9", text: "CI/CD Pipeline & Automated Testing", priority: "must" },
      { id: "t14", text: "Centralized Logging (Sentry/ELK)", priority: "should" },
      { id: "t17", text: "Unit Test cho các Business Logic chính", priority: "should" },
    ],
  },
];

const PRIORITY_CONFIG = {
  must: { label: "Bắt buộc", color: "#ef4444" },
  should: { label: "Quan trọng", color: "#f59e0b" },
  nice: { label: "Nâng cao", color: "#10b981" },
};

export default function App() {
  const totalItems = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

  // Load từ localStorage khi mount
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem("checklist_checked");
    return saved ? JSON.parse(saved) : {};
  });

  const [filter, setFilter] = useState("all");
  const [openSections, setOpenSections] = useState(
    Object.fromEntries(SECTIONS.map((s) => [s.id, true]))
  );

  const [userId, setUserId] = useState("shared-checklist");
  const [syncStatus, setSyncStatus] = useState("offline"); // offline, syncing, synced, error
  const [syncError, setSyncError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // Firebase Firestore - Real-time sync with shared ID
  useEffect(() => {
    let unsubscribeFirestore = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Khi đã có danh tính (kể cả vô danh)
        console.log("Authenticated as:", user.uid);

        // 1. Load dữ liệu ban đầu từ Firestore
        const initLoad = async () => {
          try {
            setSyncStatus("syncing");
            const docRef = doc(db, "checklists", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const firebaseData = docSnap.data().checked || {};
              setChecked(firebaseData);
              localStorage.setItem("checklist_checked", JSON.stringify(firebaseData));
            }
            setSyncStatus("synced");
            setLastSync(new Date());
            setSyncError(null);
          } catch (err) {
            console.error("Load từ Firestore lỗi:", err);
            setSyncStatus("error");
            setSyncError("Load fail: " + err.message);
          }
        };

        initLoad();

        // 2. Lắng nghe thay đổi real-time
        if (unsubscribeFirestore) unsubscribeFirestore();
        unsubscribeFirestore = onSnapshot(doc(db, "checklists", userId), (doc) => {
          if (doc.exists()) {
            const firebaseData = doc.data().checked || {};
            setChecked(prev => {
              if (JSON.stringify(prev) === JSON.stringify(firebaseData)) return prev;
              return firebaseData;
            });
            localStorage.setItem("checklist_checked", JSON.stringify(firebaseData));
            setSyncStatus("synced");
            setLastSync(new Date());
          }
        }, (err) => {
          console.error("Firestore Listener lỗi:", err);
          if (err.code === 'permission-denied') {
            setSyncError("Lỗi quyền: Vui lòng kiểm tra Rules trong Firebase Console.");
          } else {
            setSyncError("Sync error: " + err.message);
          }
          setSyncStatus("error");
        });
      } else {
        // Nếu chưa có user, tiến hành đăng nhập vô danh
        setSyncStatus("syncing");
        signInAnonymously(auth).catch(err => {
          console.error("Auth lỗi:", err);
          setSyncStatus("error");
          setSyncError("Auth failed: " + err.message);
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [userId]);

  // Lưu checked vào localStorage + Firestore
  useEffect(() => {
    localStorage.setItem("checklist_checked", JSON.stringify(checked));

    // Chỉ thực hiện setDoc nếu đã có user đăng nhập xong
    if (userId && auth.currentUser) {
      setSyncStatus("syncing");
      setDoc(doc(db, "checklists", userId), { checked, updatedAt: new Date() }, { merge: true })
        .then(() => {
          setSyncStatus("synced");
          setLastSync(new Date());
          setSyncError(null);
        })
        .catch(err => {
          console.error("Sync lỗi:", err);
          setSyncStatus("error");
          setSyncError("Update fail: " + err.message);
        });
    }
  }, [checked, userId]);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalChecked = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((totalChecked / totalItems) * 100);

  const getSectionProgress = (section) => {
    const done = section.items.filter((i) => checked[i.id]).length;
    return { done, total: section.items.length };
  };

  const filteredItems = (items) =>
    filter === "all" ? items : items.filter((i) => i.priority === filter);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#0f0f13", color: "#e2e8f0", width: "100%" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 100% !important; }
        html { width: 100% !important; }
        .item-row { transition: all 0.15s ease; }
        .item-row:hover { background: rgba(255,255,255,0.04) !important; }
        .check-box { transition: all 0.2s cubic-bezier(.34,1.56,.64,1); cursor: pointer; }
        .check-box:hover { transform: scale(1.1); }
        .filter-btn { transition: all 0.15s ease; cursor: pointer; }
        .filter-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a23; }
        ::-webkit-scrollbar-thumb { background: #3f3f5a; border-radius: 3px; }
        .progress-bar { transition: width 0.6s cubic-bezier(.4,0,.2,1); }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "40px 24px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", width: "100%" }}>
        <div style={{}}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>✦</span>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
              Checklist Trang Bán Hàng
            </h1>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>
            {totalItems} chức năng · 10 nhóm · Tick vào để đánh dấu hoàn thành
          </p>

          {/* SYNC STATUS */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 12, color: "#64748b" }}>
            <span style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: syncStatus === "synced" ? "#10b981" : syncStatus === "syncing" ? "#f59e0b" : "#64748b"
            }}></span>
            {syncStatus === "synced" && `☁️ Synced ${lastSync ? 'at ' + lastSync.toLocaleTimeString() : ''}`}
            {syncStatus === "syncing" && "⏳ Syncing..."}
            {syncStatus === "offline" && "📱 Offline (localStorage)"}
            {syncStatus === "error" && <span style={{ color: "#ef4444" }}>❌ Error: {syncError}</span>}
          </div>

          {/* PROGRESS */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>Tiến độ tổng thể</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
                {totalChecked}<span style={{ fontSize: 14, color: "#64748b" }}>/{totalItems}</span>
                <span style={{ fontSize: 13, color: "#6366f1", marginLeft: 8 }}>{progress}%</span>
              </span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div className="progress-bar" style={{ height: "100%", borderRadius: 99, width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #ec4899)" }} />
            </div>
          </div>

          {/* STATS */}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { label: "Bắt buộc", key: "must", color: "#ef4444" },
              { label: "Quan trọng", key: "should", color: "#f59e0b" },
              { label: "Nâng cao", key: "nice", color: "#10b981" },
            ].map(({ label, key, color }) => {
              const all = SECTIONS.flatMap((s) => s.items).filter((i) => i.priority === key);
              const done = all.filter((i) => checked[i.id]).length;
              return (
                <div key={key} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 14px", border: `1px solid ${color}30` }}>
                  <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 13, color: "#fff", marginLeft: 8, fontWeight: 700 }}>{done}/{all.length}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div style={{ padding: "16px 24px", width: "100%" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { key: "all", label: "Tất cả", color: "#6366f1" },
            { key: "must", label: "🔴 Bắt buộc", color: "#ef4444" },
            { key: "should", label: "🟡 Quan trọng", color: "#f59e0b" },
            { key: "nice", label: "🟢 Nâng cao", color: "#10b981" },
          ].map(({ key, label, color }) => (
            <button key={key} className="filter-btn" onClick={() => setFilter(key)} style={{ padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, border: `1.5px solid ${filter === key ? color : "rgba(255,255,255,0.1)"}`, background: filter === key ? `${color}20` : "transparent", color: filter === key ? color : "#64748b" }}>
              {label}
            </button>
          ))}
          <button className="filter-btn" onClick={() => setChecked({})} style={{ marginLeft: "auto", padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b" }}>
            ↺ Reset
          </button>
          <button className="filter-btn" onClick={() => {
            const link = document.createElement('a');
            link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(checked, null, 2));
            link.download = 'checklist-' + new Date().toISOString().slice(0, 10) + '.json';
            link.click();
          }} style={{ padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b" }}>
            ⬇️ Export
          </button>
        </div>
      </div>

      {/* SECTIONS */}
      <div style={{ padding: "0 24px 48px", display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        {SECTIONS.map((section) => {
          const { done, total } = getSectionProgress(section);
          const isOpen = openSections[section.id];
          const items = filteredItems(section.items);
          if (items.length === 0) return null;

          return (
            <div key={section.id} style={{ background: "#1a1a23", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div onClick={() => toggleSection(section.id)} style={{ display: "flex", alignItems: "center", padding: "16px 20px", cursor: "pointer", gap: 12, userSelect: "none" }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: `${section.color}20`, flexShrink: 0 }}>
                  {section.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>{section.title}</span>
                    {done === total && <span style={{ fontSize: 11, background: "#10b98120", color: "#10b981", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>✓ Hoàn thành</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                    <div style={{ flex: 1, maxWidth: 160, background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, width: `${(done / total) * 100}%`, background: section.color, transition: "width 0.4s ease" }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#475569" }}>{done}/{total}</span>
                  </div>
                </div>
                <span style={{ color: "#475569", fontSize: 18, transition: "transform 0.2s", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}>▾</span>
              </div>

              {isOpen && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  {items.map((item, idx) => {
                    const isChecked = !!checked[item.id];
                    const pConfig = PRIORITY_CONFIG[item.priority];
                    return (
                      <div key={item.id} className="item-row" onClick={() => toggle(item.id)} style={{ display: "flex", alignItems: "center", padding: "12px 20px", gap: 14, cursor: "pointer", borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.03)" : "none", background: isChecked ? "rgba(99,102,241,0.04)" : "transparent" }}>
                        <div className="check-box" style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: isChecked ? "none" : "2px solid rgba(255,255,255,0.15)", background: isChecked ? section.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isChecked && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
                        </div>
                        <span style={{ flex: 1, fontSize: 14, color: isChecked ? "#475569" : "#cbd5e1", textDecoration: isChecked ? "line-through" : "none", fontWeight: isChecked ? 400 : 500, transition: "all 0.15s ease" }}>
                          {item.text}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, color: pConfig.color, background: `${pConfig.color}18`, border: `1px solid ${pConfig.color}30`, whiteSpace: "nowrap", flexShrink: 0 }}>
                          {pConfig.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {progress === 100 && (
          <div style={{ textAlign: "center", padding: "32px", background: "linear-gradient(135deg, #10b98120, #6366f120)", borderRadius: 14, border: "1px solid #10b98130" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#10b981" }}>Hoàn thành 100%!</p>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Website của bạn đã sẵn sàng ra mắt!</p>
          </div>
        )}
      </div>
    </div>
  );
}
