// =====================================================================
// BÀI 07 (TS) — Tuple, as const, object literal, index & noUncheckedIndexedAccess
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Tuple có nhãn (labelled tuple), tuple bất biến với `as const`.
//   2. Trải tuple vào tham số hàm (spread) — an toàn theo vị trí.
//   3. Object literal: excess property check (thừa key sẽ bị lỗi).
//   4. Repo này bật noUncheckedIndexedAccess -> arr[i] là T | undefined.
//   5. Record<...> và key an toàn.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex07_tuples-objects.ts
// =====================================================================

// --- 1. Tuple ---
type DiemDs = [x: number, y: number]; // labelled tuple: tự document
type HTTPResponse = [status: number, body: string, headers: Record<string, string>];

const p: DiemDs = [1, 2];
const res: HTTPResponse = [200, "{}", { "content-type": "application/json" }];
console.log("tuple:", p, res[0], res[2]);

const phanLoai = [1, "a", true] as const; // readonly [1, "a", true]
type PhanLoaiType = typeof phanLoai;
// phanLoai[0] = 2; // LỖI: readonly
console.log("as const:", phanLoai, phanLoai.length);

// as const cả object -> mọi field thành literal readonly
const CONFIG = {
  api: { url: "https://x.vn", timeout: 5000 },
  features: ["auth", "search"],
} as const;
type ApiUrl = typeof CONFIG.api.url; // "https://x.vn" (literal!)
console.log("as const object:", CONFIG.api.timeout, "kiểu:", "" as ApiUrl === CONFIG.api.url);

// --- 2. Spread tuple vào tham số ---
function veThi(x: number, y: number, moTa: string): string {
  return `(${x},${y}) ${moTa}`;
}
const toaDo: DiemDs = [3, 4];
console.log("spread tuple:", veThi(...toaDo, "điểm A"));
// tuple bất biến + spread
const danThamSo = ["a", 1, false] as const;
function baThamSo(a: string, b: number, c: boolean) {
  return `${a}${b}${c}`;
}
console.log("spread as const:", baThamSo(...danThamSo));

// --- 3. Excess property check ---
interface HinhChuNhat {
  dai: number;
  rong: number;
}
const h: HinhChuNhat = { dai: 5, rong: 3 }; // ok
// const bad: HinhChuNhat = { dai: 5, rong: 3, cao: 1 }; // LỖI: 'cao' không có trong type
console.log("object literal:", h, "keys:", Object.keys(h));
// Mẹo: gán qua biến trung gian thì không bị excess check (TS chỉ siết literal trực tiếp)
const tam = { dai: 1, rong: 2, cao: 3 };
const okGiam: HinhChuNhat = tam; // được phép: tam có đủ field cần

// --- 4. noUncheckedIndexedAccess ---
const dsTen = ["Minh", "An", "Khoa"];
const dau = dsTen[0]; // string | undefined (vì repo bật strict flag)
if (dau !== undefined) console.log("an toàn khi đã kiểm tra:", dau.toUpperCase());
// dsTen[0].toUpperCase(); // LỖI: có thể undefined

// Cách xử lý phổ biến: at/first, default, filter Boolean
const thuHai = dsTen[1] ?? "Khách";
const daCo = dsTen.find((t) => t === "An") ?? null;
const notNull = [dsTen[0], dsTen[9]].filter((x): x is string => x !== undefined);
console.log("default:", thuHai, "| find:", daCo, "| lọc undefined:", notNull);

// với object Record, index cũng cho ra | undefined
const luong: Record<string, number> = { Minh: 10, An: 8 };
const cuaMinh = luong["Minh"]; // number | undefined
console.log("Record index:", (cuaMinh ?? 0) * 1_000_000);
for (const [ten, giaTri] of Object.entries(luong)) console.log("  ", ten, "->", giaTri);

// --- 5. Record với key hữu hạn ---
type LoaiXe = "bike" | "car" | "bus";
const giaXe: Record<LoaiXe, number> = { bike: 2, car: 7, bus: 10 }; // bắt buộc đủ 3 key
// const thieu: Record<LoaiXe, number> = { bike: 2 }; // LỖI: thiếu car, bus
function phiXuat(loai: LoaiXe): number {
  return giaXe[loai]; // luôn an toàn vì loai là union đã biết
}
console.log("Record<union>:", phiXuat("car"), Object.keys(giaXe).length, "loại");

// Bài tập tự làm
// 1) Viết tuple [lat, long, label?] và in khi label tồn tại.
// 2) Tạo bảng giaXe bằng Partial<Record<LoaiXe, number>> và xử lý undefined.
// 3) Viết hàm themVaoCuoi<T>(ds: readonly T[], v: T): T[].
