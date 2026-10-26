// =====================================================================
// BÀI 02 (TS) — interface vs type alias
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. interface mô tả shape of object, mở rộng bằng extends.
//   2. type alias cho object, union, function, primitive có tên.
//   3. Property optional (?), readonly, index signature.
//   4. Khai báo lại (declaration merging) chỉ có ở interface.
//   5. Khi nào dùng interface, khi nào dùng type.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex02_interfaces-types.ts
// =====================================================================

// --- 1. interface ---
interface NguoiDung {
  readonly id: number; // không ghi lại được
  ten: string;
  email?: string; // optional
  bietDen?: number; // union với undefined
}

const nd1: NguoiDung = { id: 1, ten: "Minh" };
const nd2: NguoiDung = { id: 2, ten: "An", email: "an@x.vn", bietDen: 100 };
// nd1.id = 9; // LỖI: readonly
console.log("--- interface ---");
console.log(nd1, nd2);

interface NhanVien extends NguoiDung {
  luong: number;
  chucVu: string;
}
const nv: NhanVien = { id: 3, ten: "Khoa", luong: 20_000_000, chucVu: "Dev" };
console.log("extends:", nv);

// interface cũng mô tả được hàm
interface BoLoc {
  (ds: number[]): number[]; // chữ ký callable
  moTa: string; // kèm property
}
const locDuong: BoLoc = Object.assign((ds: number[]) => ds.filter((n) => n > 0), {
  moTa: "lọc số dương",
});
console.log("callable interface:", locDuong([-1, 2, -3, 4]), locDuong.moTa);

// --- 2. type alias ---
type Diem = number;
type ToaDo = { x: number; y: number };
type DanhSach<T> = readonly T[]; // generic type alias
type HamXuLy = (input: string) => string;
type TrangThai = "pending" | "ok" | "error"; // literal union (interface làm được nhưng vụng)
type NguoiHoacMaY = NguoiDung | ToaDo;

const toad: ToaDo = { x: 1, y: 2 };
const upCase: HamXuLy = (s) => s.toUpperCase();
const tt: TrangThai = "ok";
// const ttBad: TrangThai = "done"; // LỖI
console.log("--- type ---");
console.log(toad, upCase("xin chao"), tt);

const ds: DanhSach<number> = [1, 2, 3];
// ds.push(4); // LỖI vì readonly
console.log("readonly array:", ds, "tổng:", [...ds].reduce((a, b) => a + b, 0));

// --- 3. Index signature ---
interface BangGia {
  [maHang: string]: number;
}
const gia: BangGia = { ao: 250_000, quan: 180_000 };
console.log("index signature:", gia.ao, gia["quan"]);
// const sai: BangGia = { ao: "250k" }; // LỖI: phải là number

// kết hợp: một số key cố định kiểu khác
interface CaUHinh {
  port: number;
  [key: string]: string | number;
}
const cauHinh: CaUHinh = { port: 3000, host: "localhost", debug: true as unknown as string };
console.log("cấu hình:", cauHinh.port, cauHinh.host);

// --- 4. Declaration merging (chỉ interface) ---
interface DiemMo {
  x: number;
}
interface DiemMo {
  y: number;
}
const dm: DiemMo = { x: 1, y: 2 };
console.log("merged interface:", dm);
// type DiemMo2 = { x: number }; type DiemMo2 = { y: number }; // LỖI: trùng tên

// --- 5. Omit/Pick sẽ học ở bài utility, ở đây xem shape thực tế ---
interface HocSinh extends NguoiDung {
  lop: string;
  diemTB: number;
}
const hs: HocSinh = { id: 4, ten: "Ngoc", lop: "KTPM", diemTB: 8.4 };
function taoBaoDanh({ id, ten, lop }: HocSinh) {
  return { id, ten, lop };
}
console.log("tách qua destructuring:", taoBaoDanh(hs));

// Bài tập tự làm
// 1) interface SanPham { id, ten, gia, giamGia? } và in ra sản phẩm có/không có giảm giá.
// 2) type KhieuNai = "low" | "mid" | "high" và hàm moTa(k: KhieuNai): string.
// 3) Tạo interface Paging { page, size } và type Timed = Paging & { at: Date }.
