// =====================================================================
// BÀI 10 (TS) — Class trong TypeScript: modifier, abstract, implements
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. public / private / protected; private của TS chỉ tồn tại lúc biên dịch.
//   2. Parameter properties: constructor(private readonly x) — cú pháp TS.
//   3. abstract class bắt buộc class con implement.
//   4. implements interface; getter/setter có kiểu; static.
//   5. Generic class + #private field (runtime-true private).
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex10_classes.ts
// =====================================================================

interface Dap {
  moTa(): string;
}

abstract class DongVat implements Dap {
  constructor(public readonly ten: string, protected soChan: number) {} // parameter properties
  abstract keu(): string; // class con buộc phải có
  moTa(): string {
    return `${this.ten} (${this.soChan} chân)`;
  }
  private secret(): string {
    return "chỉ nội bộ class này";
  }
  protected ghiAm(): string {
    return this.secret() + "!";
  }
}

class Meo extends DongVat {
  #tuoi = 2; // private thật sự ở runtime
  constructor(ten: string, tuoi: number) {
    super(ten, 4);
    this.#tuoi = tuoi;
  }
  keu(): string {
    return "meo";
  }
  moTaThem(): string {
    return `${this.moTa()} | ${this.ghiAm()} | ${this.#tuoi} tuổi`;
  }
}

class Ca extends DongVat {
  constructor(ten: string) {
    super(ten, 0);
  }
  keu(): string {
    return "(im lặng)";
  }
}

console.log("--- abstract & modifiers ---");
const m = new Meo("Minky", 3);
const c = new Ca("Nemo");
console.log(m.moTaThem(), "|", c.moTa(), "|", m.keu(), c.keu());
// console.log(m.soChan);   // LỖI: protected
// console.log(m.secret()); // LỖI: private
console.log("public readonly ten:", m.ten);
// m.ten = "x"; // LỖI: readonly
console.log("implements Dap?", m instanceof Meo, "| có moTa:", typeof m.moTa === "function");
console.log("#private không thấy từ ngoài:", (m as unknown as Record<string, unknown>)["#tuoi"]);

// --- Generic class + interface ---
interface Store<T> {
  add(item: T): void;
  all(): readonly T[];
  find(pred: (t: T) => boolean): T | undefined;
}

class InMemoryStore<T> implements Store<T> {
  #items: T[] = [];
  constructor(private readonly clone: (t: T) => T = (x) => x) {}
  add(item: T): void {
    this.#items.push(this.clone(item));
  }
  all(): readonly T[] {
    return [...this.#items];
  }
  find(pred: (t: T) => boolean): T | undefined {
    return this.#items.find(pred);
  }
  get size(): number {
    return this.#items.length;
  }
}

type Task = { id: number; title: string; done: boolean };
const store: InMemoryStore<Task> = new InMemoryStore<Task>();
store.add({ id: 1, title: "học TS", done: false });
store.add({ id: 2, title: "làm bài 10", done: true });
console.log("--- generic class ---");
console.log("size:", store.size, "| done:", store.find((t) => t.done)?.title);
// store.add({ id: 3, title: 42, done: false }); // LỖI: title phải string

// --- Static, getter/setter có kiểu ---
class Counter {
  static readonly MAX = 10;
  static #instances = 0;
  #value = 0;
  constructor() {
    Counter.#instances++;
  }
  static get soLuong(): number {
    return Counter.#instances;
  }
  get value(): number {
    return this.#value;
  }
  set value(v: number) {
    if (v > Counter.MAX) throw new RangeError(`vượt MAX=${Counter.MAX}`);
    this.#value = v;
  }
}
const k1 = new Counter();
k1.value = 5;
console.log("--- static/getter/setter ---");
console.log("value:", k1.value, "| instances:", Counter.soLuong, "| MAX:", Counter.MAX);
try {
  k1.value = 99;
} catch (e) {
  console.log("chặn setter:", (e as Error).message);
}

// Bài tập tự làm
// 1) abstract class Hinh với abstract area() và 2 class con (Tron, Vuong).
// 2) Viết class Stack<T> implements Store-like với pop() trả về T | undefined.
// 3) Thêm static create(...) factory cho Counter và giải thích khác gì constructor.
