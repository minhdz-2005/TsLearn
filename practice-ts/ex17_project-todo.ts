// =====================================================================
// BÀI 17 (TS) — MINI PROJECT: Quản lý công việc có kiểu đầy đủ
// ---------------------------------------------------------------------
// KẾT HỢP: generic, discriminated union, mapped/conditional type,
// type guard, class + private field, readonly, Record, satisfies,
// async/await có kiểu, không `any` không `!`.
//
// ĐỀ BÀI:
//   1. Todo có priority (union literal) và tags (readonly array).
//   2. Store phát hành event (discriminated union) -> logger an toàn kiểu.
//   3. Bộ lọc kiểu generic: loc<T> dùng được cho mọi trường của Todo.
//   3. Validation dữ liệu từ JSON (unknown -> Todo) bằng type guard.
//   4. Stats tính bằng reduce, xuất bằng console.table.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex17_project-todo.ts
// =====================================================================

type Priority = "low" | "mid" | "high";
type TodoId = string & { readonly __brand: "TodoId" }; // nominal typing bằng brand

interface Todo {
  readonly id: TodoId;
  title: string;
  done: boolean;
  priority: Priority;
  tags: readonly string[];
  due?: Date;
}

// Event của store: discriminated union -> xử lý switch an toàn
type StoreEvent =
  | { type: "added"; todo: Todo }
  | { type: "toggled"; id: TodoId; done: boolean }
  | { type: "removed"; id: TodoId }
  | { type: "cleared"; count: number };

const PRIORITIES = ["low", "mid", "high"] as const satisfies readonly Priority[];

function newId(seed: number): TodoId {
  return `todo-${seed.toString(36).padStart(4, "0")}` as TodoId;
}

// --- Type guard cho dữ liệu không tin cậy ---
const isPriority = (v: unknown): v is Priority => PRIORITIES.includes(v as Priority);

function parseTodo(v: unknown): Todo | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as Record<string, unknown>;
  if (typeof o["title"] !== "string" || o["title"].trim() === "") return null;
  if (!isPriority(o["priority"])) return null;
  const tags = Array.isArray(o["tags"]) ? (o["tags"] as unknown[]).filter((t): t is string => typeof t === "string") : [];
  return {
    id: newId(Number(o["id"] ?? 0)),
    title: o["title"].trim(),
    done: o["done"] === true,
    priority: o["priority"],
    tags,
    ...(o["due"] !== undefined ? { due: new Date(String(o["due"])) } : {}),
  };
}

// --- Store với generic & filter có kiểu ---
class TodoStore {
  #items = new Map<TodoId, Todo>();
  #listeners: Array<(e: StoreEvent) => void> = [];

  add(input: { title: string; priority?: Priority; tags?: readonly string[]; due?: Date }): Todo {
    const todo: Todo = {
      id: newId(this.#items.size + 1),
      title: input.title,
      done: false,
      priority: input.priority ?? "mid",
      tags: input.tags ?? [],
      ...(input.due !== undefined ? { due: input.due } : {}),
    };
    this.#items.set(todo.id, todo);
    this.#emit({ type: "added", todo });
    return todo;
  }

  toggle(id: TodoId): boolean {
    const cur = this.#items.get(id);
    if (!cur) throw new Error(`không tìm thấy ${id}`);
    const next: Todo = { ...cur, done: !cur.done };
    this.#items.set(id, next);
    this.#emit({ type: "toggled", id, done: next.done });
    return next.done;
  }

  remove(id: TodoId): boolean {
    const ok = this.#items.delete(id);
    if (ok) this.#emit({ type: "removed", id });
    return ok;
  }

  clear(): number {
    const n = this.#items.size;
    this.#items.clear();
    this.#emit({ type: "cleared", count: n });
    return n;
  }

  // Generic: chọn trường bằng keyof -> không bao giờ sai tên field
  filter<K extends keyof Todo>(key: K, value: Todo[K]): Todo[] {
    return [...this.#items.values()].filter((t) => t[key] === value);
  }

  mapAll<T>(fn: (t: Todo) => T): T[] {
    return [...this.#items.values()].map(fn);
  }

  get all(): readonly Todo[] {
    return [...this.#items.values()];
  }

  on(fn: (e: StoreEvent) => void): () => void {
    this.#listeners.push(fn);
    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== fn);
    };
  }

  #emit(e: StoreEvent): void {
    for (const l of this.#listeners) l(e);
  }
}

// --- Logger xử lý discriminated union, exhaustiveness check ---
function describeEvent(e: StoreEvent): string {
  switch (e.type) {
    case "added":
      return `+ ${e.todo.title} [${e.todo.priority}]`;
    case "toggled":
      return `~ ${e.id} -> done=${e.done}`;
    case "removed":
      return `- ${e.id}`;
    case "cleared":
      return `x clear ${e.count} mục`;
    default: {
      const never: never = e; // thêm event mới mà quên xử lý -> lỗi biên dịch
      throw new Error(`unhandled ${JSON.stringify(never)}`);
    }
  }
}

// --- async có kiểu ---
async function loadFromJson(raw: string): Promise<Todo[]> {
  await new Promise((r) => setTimeout(r, 10));
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.map(parseTodo).filter((t): t is Todo => t !== null);
}

// --- chạy thử ---
const log: string[] = [];
const store = new TodoStore();
const off = store.on((e) => log.push(describeEvent(e)));

store.add({ title: "học generic", priority: "high", tags: ["ts"], due: new Date() });
store.add({ title: "làm bài 12", tags: ["ts", "hw"] });
const t3 = store.add({ title: "đi chợ", priority: "low" });
store.toggle(t3.id);
store.remove(t3.id);

console.log("--- events ---");
console.log(log.join(" | "));

// filter dùng keyof: sai tên field sẽ lỗi ngay
console.log("--- filters ---");
console.log("high:", store.filter("priority", "high").map((t) => t.title));
console.log("chưa xong:", store.filter("done", false).length);
// store.filter("previouly", "high"); // LỖI: không có key đó

console.log("--- import JSON không tin cậy ---");
const dirty = `[
  {"id":1,"title":"mục hợp lệ","priority":"mid","done":false,"tags":["a"]},
  {"id":2,"title":"","priority":"mid"},
  {"id":3,"title":"priority sai","priority":"urgent"},
  {"not":"an object"}
]`;
const imported = await loadFromJson(dirty);
console.log(`accept ${imported.length}/4 dòng`, "|", imported.map((t) => t.title));

for (const t of imported) store.add({ title: t.title, priority: t.priority, tags: t.tags });

const stats = store.mapAll((t) => t.priority).reduce<Record<Priority, number>>(
  (acc, p) => {
    acc[p] += 1;
    return acc;
  },
  { low: 0, mid: 0, high: 0 } satisfies Record<Priority, number>,
);
console.log("--- stats ---", stats);
console.table(store.all.map((t) => ({ id: t.id, title: t.title, done: t.done, priority: t.priority, tags: t.tags.join("/") })));

off();
store.clear();
console.log("sau off(), listener không nhận thêm:", log.length, "| còn mục:", store.all.length);

// Bài tập mở rộng
// 1) Thêm sort("priority") dùng bảng xếp hạng Record<Priority, number>.
// 2) Thêm search(text: string) không phân biệt hoa/thường, có guard kiểu.
// 3) Chuyển sang file dùng chung shared-types/index.ts để thấy re-export giúp gì.
