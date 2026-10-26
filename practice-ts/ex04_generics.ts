// =====================================================================
// BÀI 04 (TS) — Generics cơ bản
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Generic hàm: <T>, để TS suy ra T từ đối số.
//   2. Ràng buộc bằng extends (T extends { id: number }).
//   3. Generic interface / type / class.
//   4. nhiều tham số kiểu <T, U>, key constraint <K extends keyof T>.
//   5. Default type argument <T = string>.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex04_generics.ts
// =====================================================================

// --- 1. Generic hàm ---
function firstOr<T>(ds: T[], fallback: T): T {
  return ds.length > 0 ? (ds[0] as T) : fallback;
}
console.log(firstOr([1, 2, 3], 0), firstOr<string>([], "empty"), firstOr([], null));

function zip<T, U>(a: readonly T[], b: readonly U[]): Array<[T, U]> {
  const out: Array<[T, U]> = [];
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) out.push([a[i] as T, b[i] as U]);
  return out;
}
console.log("zip:", zip(["a", "b"], [1, 2, 3]));

// --- 2. Constraint ---
interface CoId {
  id: number;
}
function timTheoId<T extends CoId>(ds: readonly T[], id: number): T | undefined {
  return ds.find((x) => x.id === id); // x.id hợp lệ nhờ constraint
}
const users = [
  { id: 1, ten: "Minh" },
  { id: 2, ten: "An" },
];
console.log("constraint:", timTheoId(users, 2), "| không thấy:", timTheoId(users, 9));

type CoTen = { ten: string };
function layTen<T extends CoTen>(ds: readonly T[]): string[] {
  return ds.map((x) => x.ten);
}
console.log("layTen:", layTen(users));

// --- 3. Generic type / class ---
interface Result<T, E = string> {
  ok: boolean;
  data?: T;
  error?: E;
}
function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}
function fail<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
const r1: Result<number> = ok(42);
const r2: Result<number, Error> = fail(new Error("boom"));
console.log("Result:", r1, r2.error?.message);

class Stack<T> {
  private items: T[] = [];
  push(v: T): this {
    this.items.push(v);
    return this;
  }
  pop(): T | undefined {
    return this.items.pop();
  }
  get size(): number {
    return this.items.length;
  }
}
const s = new Stack<number>().push(1).push(2);
console.log("Stack<number>:", s.pop(), "| còn:", s.size);
const sText = new Stack<string>();
// sText.push(1); // LỖI: phải là string

// --- 4. keyof constraint ---
function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}
const person = { id: 1, ten: "Minh", email: "m@x.vn", active: true };
console.log("pick:", pick(person, ["id", "ten"] as const));

function getByKey<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // kiểu trả về chính xác theo key
}
console.log("getByKey typed:", getByKey(person, "email").toUpperCase());

// --- 5. Generic với hàm callback ---
function groupBy<T, K extends string | number>(ds: readonly T[], keyOf: (item: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of ds) {
    const k = keyOf(item);
    (out[k] ??= []).push(item);
  }
  return out;
}
const theoNhom = groupBy(users, (u) => (u.id % 2 === 0 ? "chan" : "le"));
console.log("groupBy:", theoNhom);

// Bài tập tự làm
// 1) Viết swap<T,U>(pair: [T, U]): [U, T].
// 2) Viết last<T>(ds: readonly T[]): T | undefined (dùng at(-1)).
// 3) Viết class Queue<T> với enqueue/dequeue và test với number và string.
