// =====================================================================
// BÀI 14 (TS) — Strict mode trong thực tế: các cờ khó & cách xử lý
// ---------------------------------------------------------------------
// ĐỀ BÀI (repo này đang bật strict + noUncheckedIndexedAccess
//          + exactOptionalPropertyTypes):
//   1. Index an toàn: helper first/last, for...of, Object.hasOwn.
//   2. Union với undefined khi gọi hàm/property.
//   3. map/get của Map cho ra T | undefined -> cần ?? hoặc if.
//   4. Function nhận đối số "có thể thiếu" và NaN-safe math.
//   5. Structural typing trong thực tế: object rỗng {}, unknown, escape hatch.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex14_strict-mode.ts
// =====================================================================

// --- 1. Index an toàn ---
const ds: number[] = [10, 20, 30];

const first = <T>(a: readonly T[]): T | undefined => a[0];
const last = <T>(a: readonly T[]): T | undefined => a.at(-1);
console.log("--- index access ---");
console.log("first/last:", first(ds), last(ds));

// Duyệt an toàn: for...of không sinh ra undefined
let tong = 0;
for (const n of ds) tong += n;
console.log("for...of tổng:", tong);

// for cổ điển: phải narrow
for (let i = 0; i < ds.length; i++) {
  const n = ds[i];
  if (n !== undefined) console.log("  idx", i, "=", n * 2);
}

// Object.keys + index
const map: Record<string, number> = { a: 1, b: 2 };
for (const k of Object.keys(map)) {
  const v = map[k] ?? 0;
  console.log("  entry", k, v);
}
console.log("hasOwn:", Object.hasOwn(map, "a"), Object.hasOwn(map, "toString"));

// --- 2/3. Map & Get với strict ---
const luong = new Map<string, number>([
  ["Minh", 10],
  ["An", 8],
]);
const cuaMinh = luong.get("Minh"); // number | undefined
if (cuaMinh !== undefined) {
  console.log("--- Map strict --- get Minh:", cuaMinh * 1_000_000);
}
const cuaKhoa = luong.get("Khoa") ?? 0;
console.log("default cho key thiếu:", cuaKhoa);

// Set.has vẫn boolean, an toàn
const daCo = luong.has("An");
console.log("Set/Map has:", daCo);

// --- 4. Hàm với đối số có thể thiếu ---
function tinhTien({ soLuong, donGia = 100, phanTram = 100 }: {
  soLuong: number;
  donGia?: number;
  phanTram?: number;
}): number {
  return soLuong * donGia * (phanTram / 100);
}
console.log("--- optional args ---", tinhTien({ soLuong: 2 }), tinhTien({ soLuong: 2, donGia: 50, phanTram: 90 }));

function safeDivide(a: number, b: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
  return a / b;
}
console.log("safeDivide:", safeDivide(10, 3)?.toFixed(2), safeDivide(1, 0));

// --- 5. Cạm bẫy thường gặp ---
function docObjectRong(v: Record<string, unknown>) {
  // Không dùng được v.anything nếu chưa narrow
  const found = v["a"];
  return typeof found === "number" ? found : 0;
}
console.log("--- Record<string, unknown> ---", docObjectRong({ a: 5, b: "x" }));

// Mẹo parse dữ liệu không tin cậy (input từ API/user)
interface Product {
  id: number;
  name: string;
}
function isProduct(v: unknown): v is Product {
  return (
    typeof v === "object" &&
    v !== null &&
    "id" in v &&
    "name" in v &&
    typeof (v as Product).id === "number" &&
    typeof (v as Product).name === "string"
  );
}
const inputs: unknown[] = [{ id: 1, name: "a" }, { id: "x" }, null, 42];
const products = inputs.filter(isProduct);
console.log("validate unknown -> Product[]:", products);

// Bẫy: array method trả về T | undefined (find/at/pop)
const found2 = ds.find((n) => n > 15);
console.log("find:", found2 ?? "không có");
const popped = [...ds].pop();
console.log("pop:", popped ?? "mảng rỗng");

// Bẫy: Promise resolve value là unknown nếu viết Promise<unknown>
const p: Promise<unknown> = Promise.resolve("x" as unknown);
p.then((v) => console.log("unknown from promise:", typeof v));

// any vs unknown khi cần escape hatch
const tuApi = JSON.parse('[{"id":1,"name":"a"}]') as unknown;
const productsFromJson = (Array.isArray(tuApi) ? tuApi : []).filter(isProduct);
console.log("JSON -> typed:", productsFromJson);

// Bài tập tự làm
// 1) Viết hàm layBangHieu(ds: string[], index: number): string | undefined + test 3 case.
// 2) Viết sumOfValues(map: Map<string, number>): number mà không dùng ! ở đâu.
// 3) Sắp xếp tuple [key, value][] theo value giảm dần với strict types.
