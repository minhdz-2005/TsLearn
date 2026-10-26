// =====================================================================
// BÀI 11 (TS) — Utility types: Partial/Required/Pick/Omit/Record/
//                 Exclude/Extract/NonNullable/Readonly/Parameters...
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Partial/Required/Readonly: biến đổi tính chất property.
//   2. Pick/Omit: chọn hoặc bỏ key.
//   3. Record<K,V>: tạo bảng theo key.
//   4. Exclude/Extract/NonNullable: biến đổi union.
//   5. ReturnType/Parameters/InstanceType/Awaited: trích từ hàm & class.
//   6. Tự viết utility đơn giản để hiểu cách nó hoạt động.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex11_utility-types.ts
// =====================================================================

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  role: "admin" | "staff" | "guest";
}

const user: User = { id: 1, name: "Minh", email: "m@x.vn", role: "staff" };

// --- 1. Partial / Required / Readonly ---
function capNhat(p: Partial<User>): string {
  // mọi field đều optional -> phải kiểm tra trước khi dùng
  const tenMoi = p.name ?? user.name;
  return `${tenMoi} (${p.role ?? user.role})`;
}
console.log("Partial:", capNhat({ name: "An" }), capNhat({}));
const dayDu: Required<User> = { ...user, age: 21 };
console.log("Required:", dayDu.age.toFixed(0), dayDu.email);
const khoa: Readonly<User> = user;
// khoa.name = "x"; // LỖI: readonly

// --- 2. Pick / Omit ---
type UserPreview = Pick<User, "id" | "name">;
type UserWithoutId = Omit<User, "id">;
const preview: UserPreview = { id: 1, name: "Minh" };
const deTao: UserWithoutId = { name: "An", email: "a@x.vn", role: "guest" };
console.log("Pick:", preview, "| Omit (dùng cho POST):", deTao);

// --- 3. Record ---
const bangXepHang: Record<User["role"], number> = { admin: 1, staff: 2, guest: 3 };
console.log("Record<union, number>:", bangXepHang.admin, bangXepHang["guest"]);
const demTheoNgay: Record<string, number> = {};
for (const key of ["a", "b", "a"]) demTheoNgay[key] = (demTheoNgay[key] ?? 0) + 1;
console.log("Record<string,...> đếm:", demTheoNgay);

// --- 4. Biến đổi union ---
type KhongPhaiGuest = Exclude<User["role"], "guest">; // "admin" | "staff"
type ChiGuest = Extract<User["role"], "guest">; // "guest"
type KhongUndefined = NonNullable<User["age"]>; // number
const x: KhongPhaiGuest = "admin";
const g: ChiGuest = "guest";
console.log("Exclude/Extract/NonNullable:", x, "|", g, "|", 1 as KhongUndefined);

type NenTang = string | number | null | undefined;
type AnToan = NonNullable<NenTang>; // string | number
function gop(v: AnToan): string {
  return String(v).toUpperCase();
}
console.log("NonNullable union:", gop("ts"), gop(42));

// --- 5. Trích từ hàm & class ---
declare function apiGet(id: number, full?: boolean): Promise<User>;
type ApiResult = Awaited<ReturnType<typeof apiGet>>; // User
type ApiArgs = Parameters<typeof apiGet>; // [id: number, full?: boolean | undefined]
console.log("ReturnType/Awaited:", "" as unknown as ApiResult, "| args:", [] as unknown as ApiArgs);

class Service {
  constructor(public url: string) {}
  ping(): number {
    return 1;
  }
}
type FromCtor = InstanceType<typeof Service>; // Service
const sv: FromCtor = new Service("http://localhost");
console.log("InstanceType:", sv.url, sv.ping());

const asyncFn = async (): Promise<{ ok: boolean }> => ({ ok: true });
const awaited = await asyncFn();
type T = Awaited<ReturnType<typeof asyncFn>>; // { ok: boolean }
const t: T = awaited;
console.log("Awaited của promise-returning fn:", t);

// --- 6. Tự viết utility ---
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyNonNullable<T> = T extends null | undefined ? never : T;
type MyExclude<T, U> = T extends U ? never : T;
type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };

const p1: MyPartial<User> = { name: "tự viết" };
const r1: MyReadonly<User> = user;
const u1: MyExclude<"a" | "b" | "c", "b"> = "a"; // "a" | "c"
console.log("tự viết utility:", p1.name, "|", r1.id, "|", u1, "|", "" as MyNonNullable<string | null>);

// Bài tập tự làm
// 1) type UpdateDto = Partial<Omit<User,"id">> và hàm update(id, dto).
// 2) Viết DeepReadonly<T> (gợi ý: mapped type + T extends object).
// 3) Dùng Record để map mỗi role thành mô tả tiếng Việt, bắt buộc đủ key.
