// =====================================================================
// BÀI 06 (TS) — Narrowing: thu hẹp kiểu an toàn
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. typeof, Array.isArray, instanceof.
//   2. in operator, property narrowing, discriminated tag.
//   3. Truthiness narrowing và so sánh với literal.
//   4. Type guard tự viết (x is T) + assertion function (asserts x).
//   5. Narrowing không hoạt động trong callback -> trích biến ra ngoài.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex06_narrowing.ts
// =====================================================================

// --- 1. typeof ---
function processValue(v: string | number | boolean | (() => string)): string {
  if (typeof v === "function") return v();
  if (typeof v === "boolean") return v ? "yes" : "no";
  if (typeof v === "number") return String(v.toFixed(2));
  return v.trim().toUpperCase();
}
console.log(processValue(true), processValue(3.14159), processValue(" hi "), processValue(() => "fn"));

// --- Array.isArray / instanceof ---
function size(v: unknown[]): number;
function size(v: Date | string | { length: number }): number;
function size(v: unknown): number {
  if (Array.isArray(v)) return v.length; // unknown[] -> v: any[]? đã là mảng
  if (v instanceof Date) return v.getFullYear();
  if (typeof v === "object" && v !== null && "length" in v) return (v as { length: number }).length;
  if (typeof v === "string") return v.length;
  throw new TypeError("không đo được");
}
console.log("size:", size([1, 2, 3]), size("abcd"), size({ length: 7 }), size(new Date(2026, 0, 1)));

class HttpError extends Error {
  constructor(public status: number, msg: string) {
    super(msg);
    this.name = "HttpError";
  }
}
function moTaLoi(e: unknown): string {
  // catch luôn cho e: unknown -> phải narrow trước khi dùng
  if (e instanceof HttpError) return `HTTP ${e.status}: ${e.message}`;
  if (e instanceof Error) return `Error: ${e.message}`;
  if (typeof e === "string") return `string: ${e}`;
  return `khác (${typeof e})`;
}
console.log(moTaLoi(new HttpError(404, "not found")), "|", moTaLoi("oops"), "|", moTaLoi(42));

// --- 2. in operator ---
type ChuyenThuong = { loai: "regular"; gia: number };
type ChuyenVip = { loai: "vip"; gia: number; uuDon: number };
function tinhTien(c: ChuyenThuong | ChuyenVip): number {
  if ("uuDon" in c) return c.gia * (1 - c.uuDon); // c: ChuyenVip
  return c.gia;
}
console.log("in:", tinhTien({ loai: "vip", gia: 100, uuDon: 0.2 }), tinhTien({ loai: "regular", gia: 100 }));

// --- 3. Truthiness & literal comparison ---
function validate(input: string | null | undefined): string {
  if (!input) return "rỗng"; // narrow khỏi null/undefined/""
  if (input === "exit") return "thoát";
  return `độ dài ${input.length}`; // input: string
}
console.log(validate(""), validate(null), validate("exit"), validate("hello"));

// --- 4. Type guard & assertion function ---
interface Dbo {
  a?: number;
}
function laCoA(v: Dbo): v is { a: number } {
  return typeof v.a === "number";
}
const danhSach: Dbo[] = [{ a: 1 }, {}, { a: 3 }];
const coA = danhSach.filter(laCoA); // { a: number }[]
console.log("guard filter:", coA.map((x) => x.a));

function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new TypeError(`cần string, nhận ${typeof v}`);
}
function inHoa(v: unknown): string {
  assertIsString(v); // sau dòng này v: string
  return v.toUpperCase();
}
console.log("asserts:", inHoa("ts"));
try {
  inHoa(1);
} catch (e) {
  console.log("  bắt lỗi:", (e as Error).message);
}

// --- 5. Cạm bẫy trong callback ---
function demo(val: string | number): string {
  const isStr = typeof val === "string"; // giữ kết quả vào biến
  const ds = [1, 2];
  // ds.forEach(() => val.toUpperCase()) // LỖI: val vẫn là union trong callback
  return ds.map(() => (isStr ? "chuỗi" : "số")).join(",");
}
console.log("narrow trong callback:", demo("a"));

// Narrow qua closure: trích giá trị ra biến const trước
function truncate(v: string | null, max: number): string {
  if (v === null) return "(null)";
  const text = v; // const text: string
  const cap = () => (text.length > max ? `${text.slice(0, max)}…` : text);
  return cap();
}
console.log("closure narrowing:", truncate("typescript", 4), "|", truncate(null, 4));

// Bài tập tự làm
// 1) Viết isNil(v: unknown): v is null | undefined và dùng với filter.
// 2) Viết assertPositive(n: unknown): asserts n is number.
// 3) Dùng instanceof để phân biệt Error/TypeError/RangeError và in message.
