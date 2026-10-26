// =====================================================================
// BÀI 19 — MINI PROJECT: Sổ thu chi (kết hợp gần như mọi kỹ thuật đã học)
// ---------------------------------------------------------------------
// KỸ NĂNG DÙNG VÀO ĐÂY:
//   class + private field, Map, filter/reduce, destructuring,
//   template literal, Intl.NumberFormat, throw Error, module (file này tự chạy).
//
// ĐỀ BÀI:
//   1. Quản lý giao dịch: thêm, xóa theo id, lọc theo nhóm, thống kê.
//   2. Số dư luôn tính lại từ dữ liệu gốc (derived state), không lưu tay.
//   3. Validation: số tiền khác 0, nhóm hợp lệ, id tồn tại.
//   4. Xuất báo cáo đẹp bằng console.table + Intl.
//
// CÁCH CHẠY:  node practice-js/ex19_mini-project.js
// =====================================================================

const NHOM = ["an", "ho", "di", "luong", "khac"];

const dinhDangTien = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

class SoThuChi {
  #danhSach = new Map(); // id -> giao dịch
  #ten;

  constructor(ten) {
    this.#ten = ten;
  }

  them({ tien, nhom = "khac", moTa = "", ngay = new Date() }) {
    if (!Number.isFinite(tien) || tien === 0) throw new RangeError("tien phai la so khac 0");
    if (!NHOM.includes(nhom)) throw new TypeError(`nhom "${nhom}" không hợp lệ`);
    const id = crypto.randomUUID().slice(0, 8);
    this.#danhSach.set(id, { id, tien, nhom, moTa, ngay });
    return id;
  }

  xoa(id) {
    if (!this.#danhSach.has(id)) throw new Error(`không có giao dịch ${id}`);
    return this.#danhSach.delete(id);
  }

  get soGiaoDich() {
    return this.#danhSach.size;
  }

  get soDu() {
    return [...this.#danhSach.values()].reduce((t, g) => t + g.tien, 0);
  }

  loc({ nhom, min = -Infinity, max = Infinity } = {}) {
    return [...this.#danhSach.values()].filter(
      (g) => (!nhom || g.nhom === nhom) && g.tien >= min && g.tien <= max,
    );
  }

  thongKe() {
    const theoNhom = new Map();
    for (const g of this.#danhSach.values()) {
      theoNhom.set(g.nhom, (theoNhom.get(g.nhom) ?? 0) + g.tien);
    }
    const chi = [...this.#danhSach.values()].filter((g) => g.tien < 0);
    const thu = [...this.#danhSach.values()].filter((g) => g.tien > 0);
    return {
      ten: this.#ten,
      soGiaoDich: this.soGiaoDich,
      tongThu: thu.reduce((t, g) => t + g.tien, 0),
      tongChi: chi.reduce((t, g) => t + g.tien, 0),
      soDu: this.soDu,
      theoNhom: Object.fromEntries(theoNhom),
      lonNhat: [...this.#danhSach.values()].sort((a, b) => Math.abs(b.tien) - Math.abs(a.tien))[0],
    };
  }

  baoCao() {
    const tk = this.thongKe();
    const lines = [
      `=== Sổ của ${tk.ten} ===`,
      `${tk.soGiaoDich} giao dịch | thu ${dinhDangTien.format(tk.tongThu)} | chi ${dinhDangTien.format(tk.tongChi)}`,
      `Số dư: ${dinhDangTien.format(tk.soDu)}`,
      `Lớn nhất: ${tk.lonNhat.moTa} (${dinhDangTien.format(tk.lonNhat.tien)})`,
    ];
    console.log(lines.join("\n"));
    console.table(this.loc());
    return tk;
  }
}

// --- chạy thử ---
const so = new SoThuChi("Minh");
const idLuong = so.them({ tien: 15_000_000, nhom: "luong", moTa: "lương tháng 10" });
so.them({ tien: -250_000, nhom: "an", moTa: "cơm trưa" });
so.them({ tien: -1_200_000, nhom: "ho", moTa: "tiền nhà" });
so.them({ tien: -89_000, nhom: "an", moTa: "cafe" });
so.them({ tien: -400_000, nhom: "di", moTa: "xăng + xe" });

console.log("dư sau 5 giao dịch:", dinhDangTien.format(so.soDu));
console.log("lọc nhóm 'an':", so.loc({ nhom: "an" }).map((g) => g.moTa));
console.log("lọc chi >= 200k:", so.loc({ min: -200_000, max: 0 }).map((g) => g.moTa));

so.xoa(idLuong);
console.log("sau xóa lương, dư:", dinhDangTien.format(so.soDu), "| số GD:", so.soGiaoDich);
so.them({ tien: 15_000_000, nhom: "luong", moTa: "lương tháng 10" });

so.baoCao();

try {
  so.them({ tien: -1000, nhom: "trà sữa" });
} catch (e) {
  console.log("bắt lỗi validation:", e.constructor.name, "-", e.message);
}
try {
  so.xoa("abcd1234");
} catch (e) {
  console.log("bắt lỗi xóa:", e.message);
}

// Bài tập mở rộng
// 1) Thêm tìm kiếm theo moTa (không phân biệt hoa/thường).
// 2) Thêm export/import JSON (JSON.stringify([...so.loc()])) để lưu file.
// 3) Chuyển sang TypeScript ở practice-ts/ex17 để thấy type giúp gì.
