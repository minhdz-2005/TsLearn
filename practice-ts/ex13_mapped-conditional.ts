// =====================================================================
// BÀI 13 (TS) — Mapped types, conditional types, infer, keyof/typeof
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Mapped type: { [K in keyof T]: ... } và modifier (? readonly -?).
//   2. Conditional type: T extends U ? X : Y, và distributive union.
//   3. infer: "suy ra" kiểu trong conditional (Awaited, First, DeepPartial).
//   4. Template literal type: `${A}-${B}`.
//   5. Kết hợp tạo utility thực dụng: DeepReadonly, OptionalKeys, RequiredKeys.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex13_mapped-conditional.ts
// =====================================================================

// --- 1. Mapped type ---
type Optional<T> = { [K in keyof T]?: T[K] };
type StrongReadonly<T> = { readonly [K in keyof T]: T[K] };
type StripOptional<T> = { [K in keyof T]-?: T[K] }; // bỏ dấu ?

interface Address {
  street: string;
  city: string;
  zip?: string;
}
type AddressDraft = Optional<Address>; // street?: string; city?: string; zip?: string
type AddressFull = StripOptional<Address>; // bắt buộc cả zip

const draft: AddressDraft = { city: "Hanoi" };
const full: AddressFull = { street: "a", city: "b", zip: "c" };
console.log("--- mapped ---");
console.log(draft, full);

// Map giá trị sang kiểu mới
type Stringify<T> = { [K in keyof T]: string };
const raw: Address = { street: "1", city: "2", zip: "3" };
const allText: Stringify<Address> = { street: raw.street, city: raw.city, zip: raw.zip ?? "" };
console.log("Stringify:", allText);

// Remap key bằng `as`
type Prefixed<T, P extends string> = { [K in keyof T as K extends string ? `${P}${K}` : never]: T[K] };
const prefixed: Prefixed<Address, "$"> = { $street: "a", $city: "b", $zip: "c" };
console.log("remap key:", Object.keys(prefixed));

// --- 2. Conditional & distributive ---
type IsString<T> = T extends string ? true : false;
type A1 = IsString<"a">; // true
type A2 = IsString<1>; // false
// Conditional phân phối trên union: mỗi thành viên được xét riêng
type A3 = IsString<string | 1>; // true | false -> boolean
console.log("--- conditional ---");
console.log("phân phối union:", true as A3, false as A1, false as A2);

type NoNull<T> = T extends null | undefined ? never : T;
type Clean = NoNull<string | null | undefined | 1>; // string | 1
const clean: Clean = "ok";
console.log("NoNull:", clean, 1 as Clean);

// Bật phân phối cho tuple/union đóng gói bằng [T] extends [...]
type IsAnyTuple<T> = [T] extends [readonly unknown[]] ? "tuple" : "other";
console.log("non-distributive:", "tuple" as IsAnyTuple<[number, string]>, "other" as IsAnyTuple<string>);

// --- 3. infer ---
type ElementType<T> = T extends (infer U)[] ? U : never;
type First<T> = T extends readonly [infer F, ...unknown[]] ? F : never;
type MyAwaited<T> = T extends Promise<infer V> ? V : T;
type Flatten<T> = T extends Array<infer U> ? U : T;

type E1 = ElementType<string[]>; // string
type F1 = First<[Date, number]>; // Date
type W1 = MyAwaited<Promise<{ a: 1 }>>; // { a: 1 }
const e1: E1 = "x";
const f1: F1 = new Date(0);
const w1: W1 = { a: 1 };
console.log("--- infer ---");
console.log(e1, f1.getFullYear(), w1.a, "flatten:", "y" as Flatten<Flatten<string[][]>>);

// Recursive conditional
type DeepFlatten<T> = T extends Array<infer U> ? DeepFlatten<U> : T;
type Flat = DeepFlatten<number[][][]>; // number
console.log("DeepFlatten:", 0 as Flat);

// --- 4. Template literal type ---
type EventName<T extends string> = `on${Capitalize<T>}`;
type handlers = EventName<"click"> | EventName<"focus">; // "onClick" | "onFocus"
const h: handlers = "onClick";
type Route = `/api/${string}`;
const r: Route = "/api/users";
console.log("--- template literal ---", h, r);

type CssSize = `${number}px` | `${number}%`;
const width: CssSize = "50%";
console.log(width);

// --- 5. Utility thực dụng ---
type OptionalKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T];
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
type OK = OptionalKeys<Address>; // "zip"
type RK = RequiredKeys<Address>; // "street" | "city"
const okKey: OK = "zip";
const rkKey: RK = "city";
console.log("--- optional/required keys ---", okKey, rkKey);

type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] };
const cfg: DeepReadonly<{ db: { host: string } }> = { db: { host: "localhost" } };
// cfg.db.host = "x"; // LỖI readonly
console.log("DeepReadonly:", cfg.db.host);

// keyof / typeof kết hợp
type AddressKeyList = (keyof Address)[];
const keys: AddressKeyList = ["street", "city", "zip"];
console.log("keyof Address:", keys);

// Bài tập tự làm
// 1) Viết type TupleToObject<T extends readonly string[]> tạo { [K in T[number]]: true }.
// 2) Viết type UnionToIntersection<U> (nâng cao, dùng infer + function trick).
// 3) Viết type Nullable<T> = { [K in keyof T]: T[K] | null }.
