# TypeScript & JavaScript — sổ tay kiến thức + bài tập

Repo luyện tập gồm **20 bài JavaScript** ([practice-js/](practice-js/)) và **17 bài TypeScript**
([practice-ts/](practice-ts/)). Mỗi file có `ĐỀ BÀI` ở đầu, code demo có chú giải bên dưới,
và `Bài tập tự làm` ở cuối. File này tổng hợp **toàn bộ kiến thức** tương ứng với các bài đó.

## Chạy code

```bash
# JavaScript — ES Module, chạy trực tiếp bằng Node (>= 18), không cần build
node practice-js/ex01_variables-types.js

# TypeScript — dùng ts-node đã cài sẵn
npm run practice:ts -- practice-ts/ex01_basic-types.ts   # chạy 1 bài
npm run practice:ts:check                                # check kiểu toàn bộ bài TS
```

Cấu hình `tsconfig.json` gốc đang bật `strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `isolatedModules` —
[practice-ts/tsconfig.json](practice-ts/tsconfig.json) kế thừa nguyên bộ cờ đó,
nên các dòng `// LỖI:` trong bài là lỗi **thật**, bỏ comment để xem compiler báo gì.

---

# PHẦN I — JAVASCRIPT

## 1. Biến và kiểu dữ liệu → [ex01](practice-js/ex01_variables-types.js)

| Cách khai báo | Phạm vi | Gán lại | Hoisting | Khi nào dùng |
|---|---|---|---|---|
| `const` | block | Không | TDZ | Mặc định, dùng mọi lúc có thể |
| `let` | block | Có | TDZ | Khi thật sự cần gán lại / biến đếm |
| `var` | function | Có | Khởi tạo `undefined` | Không dùng nữa |

Bảy kiểu primitive: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.

```js
typeof null            // "object"  ← bug lịch sử, không sửa được
typeof NaN             // "number"
0.1 + 0.2 === 0.3      // false ← số float 64-bit
Number.isNaN(x)        // đúng, thay vì isNaN(x)
(25).toString(2)       // "11001" — BigInt: 9007199254740993n
```

* `number` chỉ có một kiểu (double 64-bit); an toàn nguyên ở ±(2⁵³−1) → `Number.MAX_SAFE_INTEGER`.
* `toFixed(n)` trả về **string**, muốn số thì `Number(x.toFixed(2))`.
* Template literal `` `${biểu_thức}` `` thay cho nối chuỗi bằng `+`.

## 2. Toán tử, so sánh, điều kiện → [ex02](practice-js/ex02_operators-conditions.js)

**8 giá trị falsy:** `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Tất cả còn lại truthy
(kể cả `"0"`, `[]`, `{}`).

```js
5 == "5"        // true  – ép kiểu
5 === "5"       // false – so cả kiểu; LUÔN dùng ===
null == undefined   // true
null === undefined  // false
NaN === NaN         // false
```

```js
a || b   // b nếu a falsy        → 0 || 10        = 10  (dễ hỏng khi a = 0/"")
a ?? b   // b chỉ khi a null/undefined → 0 ?? 10  = 0  ✅ khuyến nghị
a ??= b  // gán chỉ khi a null/undefined
x?.y     // optional chaining, dừng ngay khi x null/undefined
```

`switch` có fallthrough (quên `break` sẽ chạy sang case dưới); `default` đặt cuối.

## 3. Vòng lặp → [ex03](practice-js/ex03_loops.js)

```js
for (let i = 0; i < n; i++)          // cần chỉ số / chạy n lần
for (const x of arr)                 // mảng, Set, Map, string — DUYẾT GIÁ TRỊ
for (const [i, x] of arr.entries())  // vừa chỉ số vừa giá trị
for (const k in obj)                 // object — duyệt KEY (cả key kế thừa!)
while (dk) { }                       // có thể không chạy lần nào
do { } while (dk)                    // chắc chắn chạy ≥ 1 lần
```

`break` dừng hẳn, `continue` bỏ lượt, `label:` + `break label` thoát vòng lặp lồng nhau.
Với mảng luôn dùng `for...of`, đừng dùng `for...in` (nó duyệt cả thuộc tính kế thừa và thứ tự là chuỗi).

## 4. Mảng → [ex04](practice-js/ex04_arrays-basics.js), [ex05](practice-js/ex05_array-methods.js)

| Mutates mảng gốc | Không mutate (trả mới / trả giá trị) |
|---|---|
| `push pop shift unshift splice sort reverse fill` | `slice concat map filter reduce flat at includes indexOf find findIndex join` |

```js
arr.at(-1)                  // phần tử cuối, không lo arithmetic index
arr.slice(1, 3)             // [e1, e2] — không gồm index 3
arr.splice(1, 2, "x")       // xóa 2 phần tử từ idx 1, chèn "x"
[...arr]                    // copy nông
[...new Set(arr)]           // loại trùng
arr.sort((a, b) => a - b)   // SÓ PHẢI có comparator cho số
arr.sort((a, b) => b - a)   // giảm dần
arr.sort((a, b) => a.name.localeCompare(b.name, "vi"))  // tiếng Việt đúng thứ tự
```

Không có comparator, `sort()` so như **chuỗi**: `[10,1,2].sort()` → `[1,10,2]`.

Ba hàm nền tảng:

```js
const map    = arr.map(x => f(x))        // 1-1, trả mảng mới cùng độ dài
const keep   = arr.filter(x => cond(x))  // giữ phần tử thỏa điều kiện
const sum    = arr.reduce((acc, x) => acc + x, 0)  // gộp về 1 giá trị
```

`reduce` cũng dùng để **group by**:

```js
const groups = list.reduce((acc, item) => {
  (acc[keyOf(item)] ??= []).push(item);
  return acc;
}, {});
```

`some` (có ≥1?), `every` (tất cả?), `find` (→ phần tử | `undefined`), `findIndex` (→ chỉ số | `-1`),
`flatMap` (map + flatten 1 cấp).

## 5. String / Number / Math → [ex06](practice-js/ex06_strings-numbers.js)

```js
s.slice(a, b)  s.split(sep)  s.replaceAll / replace(/\s+/g, " ")
s.trim()  s.padStart(n, "0")  s.repeat(n)  s.match(/\d+/g)  s.includes/startsWith/endsWith
s.indexOf(x) !== -1  →  hiện đại hơn: s.includes(x)

Number("42")   +"3.5"   parseInt("10px", 10)   parseFloat("1.5em")   // NaN nếu không parse được
(1234567.89).toLocaleString("vi-VN")            // "1.234.567,89"

Math.round / floor / ceil / trunc / abs / sqrt / pow / max / min / random
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
```

Vd. chuẩn hóa họ tên: `trim → toLowerCase → split(/\s+/) → viết hoa chữ đầu → join(" ")`.

## 6. Hàm → [ex07](practice-js/ex07_functions.js)

```js
function decl(a){}            // hoisted
const expr = function(a){}    // không hoisted, có .name
const arrow = (a) => a * 2;   // không có this/arguments riêng
const obj = (x) => ({ v: x }); // arrow trả object phải bọc ()
```

* **Default param** chỉ áp dụng khi giá trị là `undefined` (không áp dụng cho `null`).
* **Rest** `(...args)` gom tham số thành mảng; **spread** `f(...arr)` tách mảng thành tham số.
* destructuring ngay trong chữ ký hàm: `f({ a, b = 1 })`, `f([x, y])`.
* **this** phụ thuộc cách gọi: `obj.f()` → `obj`; `const g = obj.f; g()` → `undefined` (ESM strict);
  `arrow` lấy `this` của nơi khai báo → hay dùng trong `setTimeout`/callback.
* `call(thisArg, ...args)` gọi ngay; `apply(thisArg, [args])`; `bind(thisArg, ...preset)` trả hàm mới.

```js
function counter(start = 0) {         // higher-order: hàm trả về hàm
  return () => ++start;
}
```

## 7. Scope, closure → [ex09](practice-js/ex09_scope-closure.js)

**Closure** = hàm + môi trường nơi nó được tạo. Hàm "nhớ" biến ngay cả khi scope ngoài đã tắt.

```js
function factory() {
  let privateVar = 0;                 // không thể truy cập từ ngoài
  return { inc: () => ++privateVar, get: () => privateVar };
}
```

Ứng dụng: private state, memoize, debounce, module pattern.

```js
for (let i = 0; i < 3; i++) fns.push(() => i);  // [0,1,2] — mỗi vòng một binding
for (var j = 0; j < 3; j++) fns.push(() => j);  // [3,3,3] — chia sẻ một biến
```

TDZ (temporal dead zone): truy cập `let/const` trước dòng khai báo → `ReferenceError`.

## 8. Object → [ex08](practice-js/ex08_objects.js)

```js
const o = { key, shorthand, "spaced key": 1, [dynamic]: v, method() {} };
Object.keys / values / entries / fromEntries / hasOwn / freeze / assign
const { a, b: renamed = def, ...rest } = o;        // destructuring + rest
const clone = { ...o, a: newValue };               // copy & ghi đè (shallow)
delete o.key;                                        // "key" in o → false
```

* `for...in` duyệt cả key kế thừa → bọc `Object.hasOwn(o, k)` hoặc dùng `Object.entries`.
* `Object.freeze` là **shallow** — object bên trong vẫn sửa được.
* `JSON.stringify` **mất** `Function`, `Symbol`, `undefined`, `Date` (thành string), `Map/Set`;
  và ném lỗi nếu có vòng tham chiếu.

## 9. Map / Set / WeakMap → [ex10](practice-js/ex10_map-set.js)

| | Object | Map | Set |
|---|---|---|---|
| Key | string/symbol | **mọi kiểu** | — (value) |
| Thứ tự | không đảm bảo (key số lại được đưa lên đầu) | chèn | chèn |
| Độ dài | `Object.keys(o).length` | `.size` | `.size` |
| Duyệt | `for...in` | `for...of` entries | `for...of` |

```js
const m = new Map([["k", 1]]);  m.get / set / has / delete
const s = new Set([1,2,2]);     // size 1
[...new Set(a), ...new Set(b)]                          // hợp
[...new Set(a)].filter(x => new Set(b).has(x))          // giao
s.has(x)   // O(1) — nhanh hơn nhiều so với arr.includes(x) O(n)
new WeakMap().set(objRef, data)  // key object, tự GC, không duyệt được
```

## 10. Class → [ex11](practice-js/ex11_classes.js)

```js
class Animal {
  #secret = 1;                        // private thật ở runtime
  static count = 0;                   // thuộc về class
  constructor(name) { this.name = name; }
  speak() { return "..."; }
  get label() { return `a: ${this.name}`; }
  set speed(v) { if (v < 0) throw new Error("..."); this._s = v; }
}
class Dog extends Animal {
  constructor(name) { super(name); }  // super() phải gọi trước khi dùng this
  speak() { return super.speak() + " + gâu"; }
}
new Dog("mập") instanceof Animal      // true — kế thừa prototype
```

* `#field` là private của **runtime** (không ghi được từ ngoài, kể cả qua index).
* `static` gọi trên class; `this` trong static method là class.
* Class là syntactic sugar của prototype; khai báo class **không** hoisted như function.

## 11. Optional chaining, JSON, Date → [ex12](practice-js/ex12_optional-json-date.js)

```js
a?.b?.[0]?.()                 // dừng tại null/undefined; () → undefined, không ném
a?.b ?? "default"
config.retries ??= 3
const { parse, stringify } = JSON;
JSON.stringify(v, replacerFn, 2)      // indent 2, lọc key nhạy cảm
const d = new Date("2026-01-01T00:00:00+07:00");  // luôn dùng ISO kèm múi giờ
d.getFullYear()  d.getMonth()+1  d.getDate()  d.getDay()  d.getTime()
(new DateB - new DateA) / 86_400_000               // chênh lệch ngày
d.toLocaleString("vi-VN", { dateStyle: "full", timeStyle: "short" })
new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(1000)
```

`getMonth()` lệch 0–11; `Date` mutate khi dùng `setX` → nên copy `new Date(d)` trước.

## 12. Callback → Promise → async/await → [ex13](practice-js/ex13_callbacks.js), [ex14](practice-js/ex14_promises.js), [ex15](practice-js/ex15_async-await.js)

Quy ước **error-first callback**: `cb(err, result)` — kiểm tra `err` trước, `return` sớm.

```js
const promisify = (fn) => (...args) =>
  new Promise((res, rej) => fn(...args, (e, v) => (e ? rej(e) : res(v))));
```

**Promise** có 3 trạng thái: `pending → fulfilled | rejected` (một khi settle thì không đổi).

```js
p.then(v => ...)      // trả value hoặc promise, tự chain
 .catch(e => ...)     // bắt lỗi từ cả chuỗi phía trên
 .finally(() => ...)  // luôn chạy, không nhận giá trị

Promise.all([...])       // tất cả OK; một lỗi → reject ngay (fail-fast)
Promise.allSettled([...])// luôn resolve: {status, value|reason}
Promise.race([...])      // ai settle trước thắng → hay dùng làm timeout
Promise.any([...])       // resolve result thành công đầu tiên
```

**async/await** là đường mòn dễ đọc hơn trên Promise:

```js
async function load(id) {
  try {
    const user = await fetchUser(id);
    const posts = await Promise.all(user.ids.map(fetchPost)); // song song ✅
    return { user, posts };
  } catch (e) {
    return fallback;
  } finally {
    release();
  }
}
```

* `await` **tuần tự**: `for (const id of ids) await f(id)` chậm hơn `Promise.all(ids.map(f))`.
* `for await...of` dùng cho async iterator (`async function*`).
* helper tuple: `const [err, data] = await safely(promise)` thay cho try/catch lớn.
* Top-level `await` chạy được vì các file là ES module.

**Event loop** → [ex17](practice-js/ex17_event-loop.js):

```
call stack  →  (hết)  →  microtask queue (Promise.then, queueMicrotask, MutationObserver)
            →  (rỗng hoàn toàn)  →  macrotask (setTimeout, setImmediate, I/O)
```

Microtask sinh thêm microtask vẫn chạy **trước** macrotask kế tiếp, nên mọi microtask đều "tranh"
trước `setTimeout(0)`. Trong **cùng một** hàng đợi thì thứ tự là FIFO (đăng trước → chạy trước),
vì vậy `queueMicrotask` đăng trước `Promise.then` sẽ in trước. Thứ tự thật của bài ex17 trên Node 22:
`1, 2a, 1b, 4, 3, 2b, 5a, 5c, 5b, 6`.

## 13. Module → [ex16a](practice-js/ex16a_module.js), [ex16b](practice-js/ex16b_modules.js)

| | ESM | CommonJS |
|---|---|---|
| Nạp | `import x from "./m.js"` | `require("./m")` |
| Thời điểm | tĩnh, phân tích trước khi chạy | động, lúc chạy |
| Phần mở rộng | **bắt buộc** có `.js` | được bỏ |
| this | `undefined` | `module.exports` |
| Top-level await | có | không |

```js
export const a = 1;  export default fn;  export { a as alias };
export { x } from "./other.js";            // re-export
import * as NS from "./m.js";              // namespace
const m = await import("./heavy.js");      // dynamic → lazy load, có cache
```

Mỗi module chỉ thực thi **một lần** (singleton): nhiều file import chung một state.

## 14. Xử lý lỗi → [ex18](practice-js/ex18_errors.js)

```js
class AppError extends Error {
  constructor(msg, code = "APP_ERROR", cause) {
    super(msg, { cause });      // ES2022 giữ lỗi gốc
    this.name = "AppError"; this.code = code;
  }
}
try { risky(); }
catch (e) { if (e instanceof ValidationError) handle(e.field); else throw e; } // re-throw
finally { cleanup(); }          // return trong finally sẽ NUỐT exception → tránh
```

* `throw` ném được mọi giá trị nhưng **chỉ nên ném `Error`** (có stack, có `name`).
* Trong ESM/`class`, code là **strict mode**: ghi vào object frozen sẽ `TypeError`.
* `process.on("uncaughtException")` chỉ để log rồi thoát, không phải cách "sửa" lỗi.

## 15. Tổng hợp → [ex19](practice-js/ex19_mini-project.js)

Mini project "sổ thu chi" ghép: `class` + `#private`, `Map` làm store, `reduce` thống kê,
destructuring tham số, `Intl.NumberFormat`, `console.table`, `throw new RangeError`, validation sớm.

---

# PHẦN II — TYPESCRIPT

## 16. Kiểu cơ bản và inference → [ex01](practice-ts/ex01_basic-types.ts)

```ts
let n: number = 1;          // annotation
const s = "a";              // TS tự suy ra string — đừng viết thừa
const mixed = [1, "a"];     // (string | number)[]
type Point = [x: number, y: number];       // labelled tuple
enum Role { Admin = "ADMIN", Staff = "STAFF" }
```

| | `any` | `unknown` | `never` |
|---|---|---|---|
| Ý nghĩa | tắt kiểm tra kiểu | giá trị chưa biết kiểu | không có giá trị nào |
| Dùng được ngay | có (không an toàn) | **không**, phải narrow | không |
| Khi nào dùng | escape hatch tạm | JSON/API chưa validate | return của hàm luôn throw/vòng lặp vô hạn, exhaustive check |

`Number.isFinite`, `typeof`, `Array.isArray` là những cách rẻ nhất để đưa `unknown` về kiểu cụ thể.

## 17. interface vs type → [ex02](practice-ts/ex02_interfaces-types.ts)

| | `interface` | `type` |
|---|---|---|
| Open extension (declaration merging) | ✅ | ❌ |
| `extends` nhiều interface | ✅ | `&` intersection |
| union / literal / primitive alias | ❌ | ✅ |
| computed key / mapped | ❌ | ✅ |

Quy tắc thực dụng: **model hình dạng object/API → `interface`; mọi thứ còn lại (union, hàm,
generic helper) → `type`**.

```ts
interface User { readonly id: number; name: string; email?: string }
interface Staff extends User { role: string }
type Id = string | number;                       // alias
type Handler = (e: Event) => void;               // hàm
type Row = Record<string, number>;               // index signature
interface Cfg { port: number; [k: string]: string | number }
```

Object literal gán **trực tiếp** mà thừa key → lỗi *excess property check*; gán qua biến trung gian thì không.

## 18. Kiểu hàm → [ex03](practice-ts/ex03_functions.ts)

```ts
function f(a: number, b = 1, c?: number): number {}   // default / optional
function g(...nums: number[]): number {}              // rest có kiểu
function h(a: string, b: number): void {}             // void = không quan tâm return
type Cb = (x: number) => void;

// Overload
function cut(s: string, n: number): string;
function cut(s: string, a: number, b: number): string;
function cut(s: string, a: number, b?: number) { return b === undefined ? s.slice(0, a) : s.slice(a, b); }

// Type predicate — chìa khóa cho filter
function isNum(v: unknown): v is number { return typeof v === "number"; }
const nums = mixedArr.filter(isNum);      // number[] thay vì (number|string)[]

// Assertion function
function assertStr(v: unknown): asserts v is string { if (typeof v !== "string") throw new TypeError(""); }

// this có kiểu
interface Counter { n: number; inc(this: Counter, by?: number): number }
```

## 19. Generics → [ex04](practice-ts/ex04_generics.ts)

```ts
function first<T>(a: T[], fb: T): T { ... }
first([1, 2, 3], 0);          // T suy ra = number
first<string>([], "");        // hoặc chỉ định

function findById<T extends { id: number }>(items: T[], id: number): T | undefined
function pick<T extends object, K extends keyof T>(o: T, keys: K[]): Pick<T, K>

class Stack<T> { push(v: T): this; pop(): T | undefined }
interface Result<T, E = string> { ok: boolean; data?: T; error?: E }
```

Bốn khuôn hay dùng: `T extends { … }` (bảo đảm field), `K extends keyof T` (an toàn tên field),
`Record<K, T[]>` cho `groupBy`, `T | undefined` cho mọi phép truy cập có thể trượt.

## 20. Union, literal, discriminated union → [ex05](practice-ts/ex05_unions-literals.ts)

```ts
type Status = "idle" | "loading" | "ready";         // string literal
type Kind = 1 | 2 | 3;                              // numeric literal

type State<T> =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; data: T }
  | { status: "error"; code: number; message: string };
```

Một field chung làm **tag** (`status`, `type`, `kind`) → TS biết chính xác branch nào đang sống.
Chỉ field **chung** của union mới truy cập được trực tiếp; field riêng phải narrow trước.

**Exhaustiveness check** — thêm branch mới mà quên xử lý thì biên dịch fail:

```ts
default: {
  const unhandled: never = shape;   // lỗi nếu switch chưa xử lý đủ branch
  throw new Error(`chưa xử lý ${JSON.stringify(unhandled)}`);
}
```

`as const` trên object + `(typeof O)[keyof typeof O]` là cách thay thế enum nhẹ hơn.

## 21. Narrowing → [ex06](practice-ts/ex06_narrowing.ts)

```ts
typeof v === "string"        Array.isArray(v)        v instanceof Error
"type" in v                  v.kind === "tag"        v === null / undefined
isTodo(v)  // v is Todo      assertString(v) // asserts v is string
```

Cạm bẫy lớn nhất: **narrowing không tự lan vào callback**.

```ts
function f(v: string | number) {
  const isStr = typeof v === "string";
  [1,2].forEach(() => isStr ? v.toUpperCase() : v);   // nếu dùng v trực tiếp vẫn là union
}
```

Cách xử lý: trích kết quả narrow vào `const` rồi dùng trong closure, hoặc narrow lại bên trong.

## 22. Tuple, index, `Record` → [ex07](practice-ts/ex07_tuples-objects.ts)

`noUncheckedIndexedAccess` (đang bật ở repo) khiến `arr[i]` có kiểu `T | undefined`:

```ts
const a = arr[0];                       // T | undefined
if (a !== undefined) a.toUpperCase();    // phải narrow
const b = arr[0] ?? default;             // hoặc cấp default
const c = arr.at(-1);                    // vẫn | undefined
const d = arr.find(x => ...);            // T | undefined — như find/pop/at
```

`as const` biến giá trị thành literal **readonly**:

```ts
const C = ["id", "name"] as const;       // readonly ["id","name"]
type Col = (typeof C)[number];           // "id" | "name"
const table: Record<Col, boolean> = { id: true, name: false };  // bắt buộc đủ key
```

## 23. optional / undefined / nullish → [ex08](practice-ts/ex08_optional-nullish.ts)

Với **`exactOptionalPropertyTypes: true`** (repo đang bật):

```ts
interface A { note?: string }              // được THIẾU key, nhưng KHÔNG được gán undefined
const x: A = {};                           // ✅
const y: A = { note: undefined };          // ❌ LỖI
interface B { note?: string | undefined }  // cho phép cả hai
delete (copy as A).note;                   // cách đúng để "xóa" optional property
```

Branch-narrow trên option: `type Opt = { debug: true; optimize?: boolean } | { debug: false; optimize: boolean }`.

## 24. enum và thay thế → [ex09](practice-ts/ex09_enums.ts)

```ts
enum P { Low, Mid, High = 5 }              // numeric: có reverse map P[5] === "High"
enum R { Admin = "ADMIN" }                 // string enum: log/debug dễ
const S = { ok: "OK", err: "ERR" } as const;   // ✅ khuyến nghị hiện đại
type SVal = (typeof S)[keyof typeof S];
```

`const enum` **không dùng được** khi `isolatedModules` bật (repo đang bật) → dùng `as const` object:
không sinh code runtime, tree-shaking tốt, và vẫn lấy được union.

## 25. Class trong TS → [ex10](practice-ts/ex10_classes.ts)

| Modifier | Tồn tại lúc | Ghi chú |
|---|---|---|
| `public` | — | mặc định |
| `protected` | compile-time | class con dùng được |
| `private` | compile-time | vẫn thấy được ở runtime |
| `#field` | runtime | private thật, không thể đụng tới |
| `readonly` | compile-time | chỉ gán trong constructor |

```ts
abstract class Shape implements Serializable {
  constructor(public readonly name: string, protected sides: number) {}  // parameter properties
  abstract area(): number;                                               // class con buộc có
}
class Box extends Shape {
  static readonly MAX = 10;
  #count = 0;
  get value() { ... }  set value(v: number) { if (v > Box.MAX) throw new RangeError(); }
}
```

`implements` không tạo kiểu mới, chỉ **kiểm tra** class có đủ shape; `declare` dùng khi giá trị đã tồn tại ở runtime.

## 26. Utility types → [ex11](practice-ts/ex11_utility-types.ts)

| Utility | Tác dụng |
|---|---|
| `Partial<T>` / `Required<T>` | mọi field thành optional / bắt buộc |
| `Readonly<T>` / `ReadonlyArray<T>` | không gán lại |
| `Pick<T,K>` / `Omit<T,K>` | chọn key / bỏ key |
| `Record<K,V>` | object kiểu `{ [K]: V }` |
| `Exclude<T,U>` / `Extract<T,U>` | loại / giữ thành viên union |
| `NonNullable<T>` | bỏ `null \| undefined` |
| `Parameters<T>` / `ReturnType<T>` / `InstanceType<T>` | trích từ hàm/class |
| `Awaited<T>` | "bóc" Promise lồng nhau |

Tự viết để hiểu cơ chế:

```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };
```

Pattern thực tế: `type UpdateDto = Partial<Omit<User, "id">>` cho PATCH API.

## 27. `as`, `satisfies`, non-null → [ex12](practice-ts/ex12_assertion-satisfies.ts)

```ts
const v = unknownVal as Foo;         // nói "tin tôi" — KHÔNG chuyển đổi runtime
const x = a as unknown as B;         // 2 kiểu quá xa phải bắc cầu qua unknown
el!.id;                              // non-null assertion: nguy hiểm, thay bằng ?. / ??
const cfg = { a: 1 } satisfies Shape; // kiểm tra Shape nhưng GIỮ literal type hẹp
```

`satisfies` hơn annotation ở điểm: annotation **rộng hóa** kiểu (`Partial<Record<K,V>>`), còn
`satisfies` vừa chặn sai key vừa cho `cfg.a` giữ kiểu chính xác → autocomplete và `as const` tốt hơn.

## 28. Mapped / conditional / infer → [ex13](practice-ts/ex13_mapped-conditional.ts)

```ts
type Optional<T>      = { [K in keyof T]?: T[K] };
type StripOpt<T>      = { [K in keyof T]-?: T[K] };
type Stringify<T>     = { [K in keyof T]: string };
type Prefixed<T, P extends string> = { [K in keyof T as K extends string ? `${P}${K}` : never]: T[K] };

type IsString<T> = T extends string ? true : false;   // phân phối trên union
type NoNull<T>   = T extends null | undefined ? never : T;
type Elem<T>     = T extends (infer U)[] ? U : never;  // infer "bắt" kiểu
type MyAwaited<T> = T extends Promise<infer V> ? V : T;
type Handlers = `on${Capitalize<"click" | "focus">}`;  // "onClick" | "onFocus"
type Route = `/api/${string}`;
```

* `? :` với union sẽ **phân phối** từng thành viên; bọc `[T] extends [U]` để tắt phân phối.
* Conditional + `infer` là cách mọi utility nâng cao (DeepPartial, DeepReadonly, First, Last) hoạt động.
* Đếm tính chất bằng mapped-then-index: `OptionalKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T]`.

## 29. Strict mode trong thực chiến → [ex14](practice-ts/ex14_strict-mode.ts)

```ts
const m: Map<string, number> = ...;
const v = m.get("k");            // number | undefined → ?? hoặc if
const o: Record<string, number> = {};
const x = o["k"] ?? 0;
for (const k of Object.keys(o)) { /* o[k] vẫn | undefined */ }
for (const item of arr) { }      // an toàn nhất khi không cần index
```

Dữ liệu không tin cậy → **validate rồi mới tin kiểu**:

```ts
function isProduct(v: unknown): v is Product { /* typeof + in + typeof field */ }
const list = (Array.isArray(raw) ? raw : []).filter(isProduct);   // Product[]
```

* `!` (non-null) và `as` là hai thứ **nên loại bỏ khỏi đường đi chính**; thay bằng guard/default.
* JSON từ API là `unknown` cho tới khi bạn chứng minh được nó là `T`.

## 30. Module, `import type`, global → [ex15](practice-ts/ex15_modules.ts) + [shared-types/](practice-ts/shared-types/index.ts)

```ts
import type { Product } from "./shared-types/index.js";   // chỉ kiểu → xóa sạch khi biên dịch
import { money, default as total } from "./shared-types/index.js";
import * as Shop from "./shared-types/index.js";
export type { Product as Item } from "./shared-types/index.js";
```

* `verbatimModuleSyntax` (đang bật) **buộc** dùng `import type` cho type, `export type` cho type re-export.
* Dưới `nodenext`, import file TS phải ghi phần mở rộng **`.js`** (TS tự map về `.ts`).
* `declare global { var __x: string | undefined }` cần `var` (không phải `let/const`);
  augmentation của thư viện: `declare module "some-lib" { interface Options { retry?: number } }`.

## 31. Tổng hợp → [ex16](practice-ts/ex16_api-client.ts), [ex17](practice-ts/ex17_project-todo.ts)

Hai mini project ghép toàn bộ ở trên:

* **API client có kiểu**: `ApiResult<T>` discriminated union, *route map* `interface Routes { "/users": UserDto[] }`
  để kiểu response tự đúng theo path, `parseList(raw, guard)` bóc `unknown → T[]`, `retry()`/timeout với `Promise.race`.
* **Todo store**: generic `filter<K extends keyof Todo>(key: K, value: Todo[K])`, event union +
  exhaustiveness `never`, branded id (`string & { __brand }`), `satisfies Record<Priority, number>`,
  `parseTodo(unknown): Todo | null`, async load từ JSON rác.

---

## Lộ trình học đề xuất

| Giai đoạn | JS | TS |
|---|---|---|
| 1. Nền tảng | ex01 → ex06 | ex01 → ex03 |
| 2. Cấu trúc dữ liệu | ex07 → ex12 | ex04 → ex09 |
| 3. Bất đồng bộ & module | ex13 → ex18 | ex10 → ex15 |
| 4. Tổng hợp | ex19 | ex16 → ex17 |

Gợi ý cách làm: đọc `ĐỀ BÀI` → tự viết code vào phần `Bài tập tự làm` ở cuối file → chạy để đối chiếu
kết quả với phần demo → `npm run practice:ts:check` để chắc chắn phần TS của bạn không còn `any`/`!`.

## Thói nên giữ / nên bỏ

| Nên | Bỏ |
|---|---|
| `const` mặc định, `let` khi cần | `var` |
| `===`, `??`, `?.` | `==`, `||` cho default số |
| `for...of`, `map/filter/reduce` | `for...in` trên mảng |
| `unknown` + type guard, `satisfies` | `any`, `as` rải rác, `!` non-null |
| `interface` cho object model, `type` cho union/helper | một kiểu duy nhất cho mọi thứ |
| `Promise.all` khi có thể song song | `await` trong vòng lặp khi không cần tuần tự |
| `Error` subclass có `code`, `cause` | `throw "chuỗi"` |
| `as const` object thay enum (vì `isolatedModules`) | `const enum` |
