// =====================================================================
// BÀI 12 (TS) — Type assertion, `as const`, `satisfies`
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. `as` là "tin tôi đi" — không chuyển đổi giá trị, chỉ nói với compiler.
//   2. Assertion chỉ hợp lệ khi 2 kiểu "đè lên nhau" (cần as unknown làm cầu).
//   3. Non-null assertion `!` và vì sao nên tránh.
//   4. `satisfies` kiểm tra shape mà vẫn giữ literal type (khác `as`/annotation).
//   5. as const trong object/enum-like + hệ quả với Array/Record.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex12_assertion-satisfies.ts
// =====================================================================

// --- 1. Assertion cơ bản ---
const batKy: unknown = { ten: "Minh", tuoi: 21 };
const coTen = batKy as { ten: string };
console.log("as:", coTen.ten);
// coTen.tuoi; // LỖI: shape chỉ có ten

const chuoi = "TypeScript" as string; // luôn được (string là supertype)
const literal = chuoi as "TypeScript"; // từ supertype xuống subtype -> phải dùng as
console.log("assertion hướng xuống:", literal.toUpperCase());

// --- 2. Assertion "quá xa" phải đi qua unknown ---
interface A {
  a: number;
}
interface B {
  b: string;
}
const aVal: A = { a: 1 };
// const trucTiep = aVal as B; // LỖI: hai kiểu không đủ phần chung
const quaCau = aVal as unknown as B;
console.log("cầu nối unknown (chỉ demo, code thật nên viết mapper):", typeof quaCau, "giá trị thật vẫn là:", aVal.a);

// --- 3. Non-null assertion ---
interface NodeDom {
  id: string;
}
function getElemShim(): NodeDom | null {
  return { id: "root" };
}
const input = getElemShim();
// input!.id // nguy hiểm: nếu null thì runtime crash
const anToan = input?.id ?? "khong co";
console.log("thay ! bằng ?./??:", anToan);

// --- 4. satisfies: vừa kiểm tra vừa giữ type ---
type Keys = "a" | "b" | "c";
const bang = { a: 1, b: 2 } satisfies Partial<Record<Keys, number>>;
// bang.a: number, bang.c -> LỖI (không có key c) vì kiểu vẫn là shape cụ thể
const voiAnnotation: Partial<Record<Keys, number>> = { a: 1, b: 2 };
console.log("satisfies giữ type:", bang.a, "| annotation rộng hơn:", voiAnnotation.a);

type Mode = "fast" | "slow";
const modes = { fast: 10, slow: 1000 } satisfies Record<Mode, number>;
// Thêm key mới -> satisfies báo lỗi ngay tại khai báo
const duoi = { fast: 1, slow: 2 } as const satisfies Record<Mode, number>;
console.log("satisfies + as const:", duoi.fast, "kiểu literal giữ nguyên:", typeof duoi.fast);

// satisfies giúp bắt lỗi khi mở rộng union
type Status = "ok" | "err" | "pending";
const label = { ok: "ổn", err: "lỗi" } satisfies Partial<Record<Status, string>>;
// const thieu: Record<Status, string> = { ok: "ổn", err: "lỗi" }; // LỖI thiếu pending

// --- 5. as const và Record ---
const COT = ["id", "name", "role"] as const; // readonly ["id","name","role"]
type CotName = (typeof COT)[number]; // "id" | "name" | "role"
const selected: Record<CotName, boolean> = { id: true, name: false, role: true };
console.log("as const -> union:", COT.length, selected.name);

const duLieu: CotName[] = [...COT]; // copy từ readonly tuple sang mutable array
duLieu.push("id");
console.log("readonly tuple phải copy mới sửa được:", duLieu);

// as const trên tuple tham số hàm
function run<T extends readonly unknown[]>(args: T): T {
  return args;
}
const typed = run([1, "a"] as const); // readonly [1, "a"]
console.log("generic giữ as const:", typed[0], typed[1]);

// Bài tập tự làm
// 1) Viết `const ROUTES = { home: "/", user: "/u" } as const satisfies Record<string, string>`
//    rồi lấy type union của value.
// 2) Chứng minh satisfies khác as bằng cách truy cập một key không có trong shape.
// 3) Dùng as để "mở" JSON không rõ thành một interface đã biết.
