// =====================================================================
// BÀI 05 (TS) — Union, literal types, discriminated union
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Union type: string | number, và cách dùng sau khi thu hẹp.
//   2. Literal type: "a" | "b", số literal, kết hợp boolean.
//   3. Discriminated union: field phân biệt + switch exhaustive.
//   4. never để "bảo đảm đã xử lý mọi trường hợp" (exhaustiveness check).
//   5. Union của object: truy cập field chung thì được, field riêng phải narrow.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex05_unions-literals.ts
// =====================================================================

// --- 1. Union ---
function moTa(value: string | number): string {
  if (typeof value === "string") {
    return `chuỗi dài ${value.length}`; // value: string
  }
  return `gấp đôi = ${value * 2}`; // value: number
}
console.log(moTa("abc"), "|", moTa(21));

// --- 2. Literal types ---
type KeTuc = "left" | "right" | "center";
type Nhip = 1 | 2 | 3;
type CoThe = { enable: true } | { enable: false; lyDo: string };
function canNhan(keTuc: KeTuc, nhip: Nhip): string {
  return `${keTuc}-${nhip}`;
}
console.log("literal:", canNhan("center", 2));
// canNhan("middle", 2) -> LỖI: "middle" không thuộc KeTuc

// --- 3. Discriminated union: mô hình trạng thái UI ---
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; data: T }
  | { status: "error"; code: number; message: string };

function renderState(s: LoadState<string[]>): string {
  switch (s.status) {
    case "idle":
      return "chưa tải";
    case "loading":
      return `đang tải từ ${new Date(s.startedAt).toISOString()}`;
    case "success":
      return `${s.data.length} bản ghi`; // chỉ success mới có data
    case "error":
      return `lỗi ${s.code}: ${s.message}`;
  }
}
console.log(
  renderState({ status: "idle" }),
  "|",
  renderState({ status: "success", data: ["a", "b"] }),
  "|",
  renderState({ status: "error", code: 500, message: "server" }),
);

// --- 4. Exhaustiveness check với never ---
type Hinh =
  | { kind: "circle"; r: number }
  | { kind: "square"; a: number }
  | { kind: "rect"; w: number; h: number };

function area(h: Hinh): number {
  switch (h.kind) {
    case "circle":
      return Math.PI * h.r ** 2;
    case "square":
      return h.a ** 2;
    case "rect":
      return h.w * h.h;
    default: {
      // Nếu thêm kind mới mà quên xử lý, dòng này sẽ báo lỗi -> không lọt case.
      const exhaustive: never = h;
      throw new Error(`chưa xử lý kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}
console.log("area:", area({ kind: "circle", r: 2 }).toFixed(2), area({ kind: "rect", w: 3, h: 4 }));

// --- 5. Union của object ---
type KanhTrai = { loai: "left"; title: string };
type KanhPhai = { loai: "right"; title: string; onCall: () => void };
type Canh = KanhTrai | KanhPhai;
function showCanh(c: Canh): string {
  const title = c.title; // field chung -> dùng được
  if (c.loai === "right") {
    c.onCall(); // chỉ right có onCall
    return `right: ${title}`;
  }
  return `left: ${title}`;
}
showCanh({ loai: "right", title: "t", onCall: () => console.log("   onCall fired") });
console.log(showCanh({ loai: "left", title: "t" }));

// Trích toàn bộ literal từ một object `as const`
const MA_TRANG = { ok: 200, created: 201, notFound: 404 } as const;
type MaTrang = (typeof MA_TRANG)[keyof typeof MA_TRANG]; // 200 | 201 | 404
const checkStatus = (code: MaTrang): boolean => code === 200;
console.log("literal từ as const:", checkStatus(200), checkStatus(MA_TRANG.notFound));

// Bài tập tự làm
// 1) type Shape = circle | square như trên, thêm "triangle" và sửa area (xem lỗi never).
// 2) Viết format(value: string | number | boolean | null | undefined): string.
// 3) Result<T> = {ok:true,data:T} | {ok:false,error:string} + hàm unwrap(r, default).
