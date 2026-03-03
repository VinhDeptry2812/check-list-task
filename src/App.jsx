import { useState, useEffect } from "react";
import {
  auth, db, signInAnonymously, onAuthStateChanged,
  doc, setDoc, getDoc, onSnapshot
} from "./firebase";

const SECTIONS = [
  {
    id: "account",
    icon: "👤",
    title: "Tài Khoản Người Dùng",
    color: "#6366f1",
    items: [
      { id: "a1", text: "Đăng ký tài khoản bằng email", priority: "must" },
      { id: "a2", text: "Đăng nhập / Đăng xuất", priority: "must" },
      { id: "a3", text: "Đăng nhập qua Google / Facebook", priority: "should" },
      { id: "a4", text: "Quên mật khẩu & đặt lại qua email", priority: "must" },
      { id: "a5", text: "Xác thực email sau khi đăng ký", priority: "should" },
      { id: "a6", text: "Xác thực 2 lớp (2FA)", priority: "nice" },
      { id: "a7", text: "Chỉnh sửa thông tin cá nhân", priority: "must" },
      { id: "a8", text: "Quản lý địa chỉ giao hàng nhiều địa chỉ", priority: "must" },
      { id: "a9", text: "Xem lịch sử đơn hàng", priority: "must" },
      { id: "a10", text: "Danh sách yêu thích (Wishlist)", priority: "should" },
    ],
  },
  {
    id: "product",
    icon: "🛍️",
    title: "Trang Sản Phẩm",
    color: "#f59e0b",
    items: [
      { id: "p1", text: "Danh mục & danh mục con phân cấp", priority: "must" },
      { id: "p2", text: "Trang danh sách sản phẩm", priority: "must" },
      { id: "p3", text: "Trang chi tiết sản phẩm", priority: "must" },
      { id: "p4", text: "Gallery ảnh sản phẩm (nhiều ảnh + zoom)", priority: "must" },
      { id: "p5", text: "Biến thể sản phẩm (màu, size, chất liệu)", priority: "should" },
      { id: "p6", text: "Giá gốc & giá khuyến mãi", priority: "must" },
      { id: "p7", text: "Trạng thái tồn kho (còn hàng / hết hàng)", priority: "must" },
      { id: "p8", text: "Tìm kiếm sản phẩm full-text", priority: "must" },
      { id: "p9", text: "Lọc & sắp xếp sản phẩm", priority: "should" },
      { id: "p10", text: "Sản phẩm liên quan / gợi ý", priority: "should" },
      { id: "p11", text: "Badge: Mới / Bán chạy / Sale", priority: "should" },
      { id: "p12", text: "Video sản phẩm", priority: "nice" },
      { id: "p13", text: "Xem nhanh (Quick View popup)", priority: "nice" },
    ],
  },
  {
    id: "cart",
    icon: "🛒",
    title: "Giỏ Hàng & Đặt Hàng",
    color: "#10b981",
    items: [
      { id: "c1", text: "Thêm sản phẩm vào giỏ hàng", priority: "must" },
      { id: "c2", text: "Xem & chỉnh sửa số lượng trong giỏ", priority: "must" },
      { id: "c3", text: "Icon giỏ hiển thị số lượng sản phẩm", priority: "must" },
      { id: "c4", text: "Tính tổng tiền tự động", priority: "must" },
      { id: "c5", text: "Nhập mã giảm giá / voucher", priority: "should" },
      { id: "c6", text: "Chọn địa chỉ giao hàng", priority: "must" },
      { id: "c7", text: "Chọn phương thức vận chuyển", priority: "must" },
      { id: "c8", text: "Tính phí ship tự động theo khu vực", priority: "should" },
      { id: "c9", text: "Xác nhận & đặt hàng thành công", priority: "must" },
      { id: "c10", text: "Trang cảm ơn sau đặt hàng", priority: "must" },
      { id: "c11", text: "Email xác nhận đơn hàng tự động", priority: "must" },
      { id: "c12", text: "Nút Mua Ngay (không qua giỏ)", priority: "should" },
    ],
  },
  {
    id: "payment",
    icon: "💳",
    title: "Thanh Toán",
    color: "#ec4899",
    items: [
      { id: "pay1", text: "Thanh toán khi nhận hàng (COD)", priority: "must" },
      { id: "pay2", text: "Chuyển khoản ngân hàng", priority: "must" },
      { id: "pay3", text: "Thẻ tín dụng / ghi nợ (Visa, Mastercard)", priority: "should" },
      { id: "pay4", text: "Ví MoMo", priority: "should" },
      { id: "pay5", text: "VNPay / ZaloPay", priority: "should" },
      { id: "pay6", text: "Trả góp 0%", priority: "nice" },
      { id: "pay7", text: "Mã hóa SSL & bảo mật thanh toán", priority: "must" },
      { id: "pay8", text: "Xuất hoá đơn điện tử / VAT", priority: "should" },
    ],
  },
  {
    id: "order",
    icon: "📦",
    title: "Quản Lý Đơn Hàng",
    color: "#8b5cf6",
    items: [
      { id: "o1", text: "Theo dõi trạng thái đơn hàng real-time", priority: "must" },
      { id: "o2", text: "SMS / Email thông báo cập nhật đơn", priority: "should" },
      { id: "o3", text: "Hủy đơn hàng (trước khi xử lý)", priority: "must" },
      { id: "o4", text: "Yêu cầu đổi / trả hàng", priority: "should" },
      { id: "o5", text: "In hoá đơn đơn hàng", priority: "should" },
      { id: "o6", text: "Đặt lại đơn cũ (Reorder)", priority: "nice" },
    ],
  },
  {
    id: "review",
    icon: "⭐",
    title: "Đánh Giá & Tương Tác",
    color: "#f97316",
    items: [
      { id: "r1", text: "Đánh giá sản phẩm bằng sao (1–5)", priority: "should" },
      { id: "r2", text: "Viết nhận xét & bình luận", priority: "should" },
      { id: "r3", text: "Upload ảnh kèm đánh giá", priority: "nice" },
      { id: "r4", text: "Lọc đánh giá theo số sao", priority: "nice" },
      { id: "r5", text: "Chia sẻ sản phẩm lên mạng xã hội", priority: "should" },
      { id: "r6", text: "Hỏi & đáp về sản phẩm (Q&A)", priority: "nice" },
    ],
  },
  {
    id: "marketing",
    icon: "📈",
    title: "Marketing & Khuyến Mãi",
    color: "#14b8a6",
    items: [
      { id: "m1", text: "Trang Flash Sale / Khuyến mãi riêng", priority: "should" },
      { id: "m2", text: "Countdown timer đếm ngược", priority: "should" },
      { id: "m3", text: "Hệ thống mã giảm giá (Coupon)", priority: "must" },
      { id: "m4", text: "Chương trình tích điểm / loyalty", priority: "nice" },
      { id: "m5", text: "Referral – Giới thiệu bạn bè", priority: "nice" },
      { id: "m6", text: "Tích hợp email marketing", priority: "should" },
      { id: "m7", text: "Popup thu thập email newsletter", priority: "should" },
      { id: "m8", text: "Facebook Pixel / Google Analytics", priority: "must" },
      { id: "m9", text: "SEO: URL thân thiện, meta tags, sitemap", priority: "must" },
      { id: "m10", text: "Tích hợp Google Shopping", priority: "nice" },
    ],
  },
  {
    id: "support",
    icon: "💬",
    title: "Hỗ Trợ Khách Hàng",
    color: "#06b6d4",
    items: [
      { id: "s1", text: "Trang FAQ (câu hỏi thường gặp)", priority: "should" },
      { id: "s2", text: "Live Chat trực tuyến", priority: "should" },
      { id: "s3", text: "Chatbot tự động", priority: "nice" },
      { id: "s4", text: "Form liên hệ / gửi yêu cầu hỗ trợ", priority: "must" },
      { id: "s5", text: "Hotline hiển thị rõ ràng trên trang", priority: "must" },
      { id: "s6", text: "Chính sách đổi trả rõ ràng", priority: "must" },
      { id: "s7", text: "Chính sách bảo hành", priority: "should" },
      { id: "s8", text: "Hướng dẫn mua hàng", priority: "should" },
    ],
  },
  {
    id: "admin",
    icon: "🛠️",
    title: "Quản Trị Admin",
    color: "#64748b",
    items: [
      { id: "ad1", text: "Quản lý sản phẩm (thêm / sửa / xóa)", priority: "must" },
      { id: "ad2", text: "Quản lý kho hàng & tồn kho", priority: "must" },
      { id: "ad3", text: "Quản lý đơn hàng & xử lý đơn", priority: "must" },
      { id: "ad4", text: "Quản lý khách hàng", priority: "must" },
      { id: "ad5", text: "Quản lý mã giảm giá & khuyến mãi", priority: "should" },
      { id: "ad6", text: "Báo cáo doanh thu & thống kê", priority: "must" },
      { id: "ad7", text: "Quản lý banner & nội dung trang chủ", priority: "should" },
      { id: "ad8", text: "Phân quyền nhân viên (roles)", priority: "should" },
      { id: "ad9", text: "Quản lý vận chuyển & đối tác ship", priority: "should" },
      { id: "ad10", text: "Backup dữ liệu định kỳ", priority: "must" },
    ],
  },
  {
    id: "tech",
    icon: "🔒",
    title: "Kỹ Thuật & Bảo Mật",
    color: "#ef4444",
    items: [
      { id: "t1", text: "HTTPS / SSL Certificate", priority: "must" },
      { id: "t2", text: "Tốc độ tải trang dưới 3 giây", priority: "must" },
      { id: "t3", text: "Giao diện responsive (mobile-first)", priority: "must" },
      { id: "t4", text: "Tối ưu ảnh (WebP, lazy load)", priority: "should" },
      { id: "t5", text: "Bảo vệ chống DDoS", priority: "should" },
      { id: "t6", text: "Captcha chống spam form", priority: "should" },
      { id: "t7", text: "Trang chính sách bảo mật & cookies", priority: "must" },
      { id: "t8", text: "Tương thích đa trình duyệt", priority: "must" },
      { id: "t9", text: "Kiểm thử thanh toán thật (UAT)", priority: "must" },
      { id: "t10", text: "CDN cho tốc độ toàn cầu", priority: "nice" },
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
  const [syncStatus, setSyncStatus] = useState("offline"); // offline, syncing, synced
  const [lastSync, setLastSync] = useState(null);

  // Firebase Firestore - Real-time sync with shared ID
  useEffect(() => {
    setSyncStatus("syncing");

    // Auth vẫn chạy để đảm bảo có quyền truy cập Firestore (theo rules)
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        signInAnonymously(auth).catch(err => console.error("Auth lỗi:", err));
      }
    });

    // Load dữ liệu ban đầu từ Firestore
    const initLoad = async () => {
      try {
        const docRef = doc(db, "checklists", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firebaseData = docSnap.data().checked || {};
          setChecked(firebaseData);
          localStorage.setItem("checklist_checked", JSON.stringify(firebaseData));
        }
        setSyncStatus("synced");
        setLastSync(new Date());
      } catch (err) {
        console.error("Load từ Firestore lỗi:", err);
        setSyncStatus("offline");
      }
    };

    initLoad();

    // Lắng nghe thay đổi real-time từ Firestore dựa trên userId (hiện là mã chung)
    const unsubscribeFirestore = onSnapshot(doc(db, "checklists", userId), (doc) => {
      if (doc.exists()) {
        const firebaseData = doc.data().checked || {};
        // Chỉ cập nhật state nếu dữ liệu khác với hiện tại để tránh loop vô tận
        setChecked(prev => {
          if (JSON.stringify(prev) === JSON.stringify(firebaseData)) return prev;
          return firebaseData;
        });
        localStorage.setItem("checklist_checked", JSON.stringify(firebaseData));
        setSyncStatus("synced");
        setLastSync(new Date());
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  // Lưu checked vào localStorage + Firestore
  useEffect(() => {
    localStorage.setItem("checklist_checked", JSON.stringify(checked));

    if (userId) {
      setSyncStatus("syncing");
      setDoc(doc(db, "checklists", userId), { checked }, { merge: true })
        .then(() => {
          setSyncStatus("synced");
          setLastSync(new Date());
        })
        .catch(err => {
          console.error("Sync lỗi:", err);
          setSyncStatus("offline");
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
