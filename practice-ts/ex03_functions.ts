// =====================================================================
// BÀI 03 (TS) — Kiểu hàm: tham số, return, overload, this, predicate
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Kiểu tham số + return; tham số optional và mặc định.
//   2. Rest parameter có kiểu; tham số không dùng đặt dấu _ trước.
//   3. void vs unknown vs never làm kiểu trả về.
//   4. Function overload (khai báo chữ ký nhiều lần) vs union return.
//   5. Type predicate (x là T) để viết hàm narrow dùng với filter.
//   6. this có kiểu trong hàm thông thường; arrow function không có this.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex03_functions.ts
// =====================================================================

// --- 1. Cơ bản ---
function cong(a: number, b: number): number {
  return a + b;
}
const tinhTien = (soLuong: number, donGia: number = 100_000, thue = 0.1): number =>
  soLuong * donGia * (1 + thue);
console.log(cong(2, 3), tinhTien(2).toFixed(0), tinhTien(2, 250_000, 0).toFixed(0));

function moTa(ten: string, tuoi?: number): string {
  // optional -> trong hàm là string | undefined
  return tuoi === undefined ? `${ten}` : `${ten} ${tuoi}`;
}
console.log(moTa("Minh"), "|", moTa("An", 20));

// --- 2. Rest ---
function tong(...cacSo: number[]): number {
  return cacSo.reduce((t, n) => t + n, 0);
}
console.log("rest:", tong(1, 2, 3, 4));
const vocCung = (a: number, b: number, c: number) => a + c; // b không dùng -> TS không phàn nàn nếu không bật noUnusedParameters

// --- 3. void / unknown / never ---
function chiIn(msg: string): void {
  console.log("void:", msg);
}
const ketQuaVoid: void = chiIn("không có gì trả về");
console.log("void thực tế là:", ketQuaVoid);

function batKy(p: () => unknown): unknown {
  return p();
}
console.log("unknown return:", batKy(() => 42));

function lapVoTan(): never {
  while (true) {
    // không bao giờ kết thúc
  }
}
// lapVoTan(); // đừng gọi

// --- 4. Overload ---
function cat(chuoi: string, soLuong: number): string;
function cat(chuoi: string, batDau: number, ketThuc: number): string;
function cat(chuoi: string, a: number, b?: number): string {
  return b === undefined ? chuoi.slice(0, a) : chuoi.slice(a, b);
}
console.log("overload:", cat("TypeScript", 4), "|", cat("TypeScript", 4, 8));
// cat("x", "y"); // LỖI

// Union return (linh hoạt hơn overload trong nhiều trường hợp)
function timSo(text: string): number | null {
  const m = text.match(/\d+/);
  return m ? Number(m[0]) : null;
}
const found = timSo("abc123");
console.log("union return:", found === null ? "không có" : found * 2);

// --- 5. Type predicate: cực kỳ hữu ích với filter ---
interface CoLoai {
  loai: string;
}
function laSo(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
const honHon: (number | string | null)[] = [1, "a", 2, null, 3];
const chiSo = honHon.filter(laSo); // (number)[] — nếu bỏ laSo, TS không biết
console.log("predicate filter:", chiSo, "tổng:", chiSo.reduce((a, b) => a + b, 0));

function laCoLoai<T extends CoLoai>(v: unknown, loai: T["loai"]): v is T {
  return typeof v === "object" && v !== null && (v as T).loai === loai;
}
const vat: unknown[] = [{ loai: "mew" }, { loai: "dog" }, 5];
const muoi = vat.filter((v): v is { loai: "mew" } => laCoLoai<{ loai: "mew" }>(v, "mew"));
console.log("predicate generic:", muoi);

// --- 6. this có kiểu ---
interface Dem {
  count: number;
  tang: (this: Dem, buoc?: number) => number;
}
const dem: Dem = {
  count: 0,
  tang(this: Dem, buoc = 1) {
    this.count += buoc;
    return this.count;
  },
};
dem.tang();
console.log("this typed:", dem.tang(5), dem.count);
const hamMuiTen = (): number => dem.count; // arrow không có this, chỉ đọc closure

console.log("arrow đọc this qua closure:", hamMuiTen());

// Bài tập tự làm
// 1)Viết hàm overload dap(x: number): number; dap(x: string): string (twice).
// 2) Viết isEmail(v: unknown): v is string dùng regex.
// 3) Viết mapFilter<T,U>(ds: T[], f: (t: T) => U | null): U[] dùng predicate.
