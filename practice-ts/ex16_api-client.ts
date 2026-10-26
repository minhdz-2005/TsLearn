// =====================================================================
// BÀI 16 (TS) — Mini API có kiểu: mock fetch, Result, discriminated union
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Định nghĩa ApiResult<T> = success | failure (discriminated union).
//   2. Generic endpoint map: keyof của một "bảng route" -> kiểu response tự đúng.
//   3. Validation bằng type guard khi nhận JSON (unknown -> T).
//   4. async/await + timeout + thử lại, tất cả có kiểu.
//   5. Không dùng `any`, không dùng `!` ở đường đi chính.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex16_api-client.ts
// =====================================================================

type ApiResult<T> =
  | { ok: true; data: T; meta: { ms: number } }
  | { ok: false; error: { code: number; message: string } };

interface UserDto {
  id: number;
  name: string;
  email: string | null;
}
interface PostDto {
  id: number;
  title: string;
  userId: number;
}

// "Bảng route": mỗi endpoint khai báo kiểu response một lần duy nhất
interface Routes {
  "/users": UserDto[];
  "/users/:id": UserDto;
  "/posts": PostDto[];
}
type RoutePath = keyof Routes;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isUserDto(v: unknown): v is UserDto {
  if (!isRecord(v)) return false;
  return (
    typeof v["id"] === "number" &&
    typeof v["name"] === "string" &&
    (v["email"] === null || typeof v["email"] === "string")
  );
}
function parseList<T>(v: unknown, guard: (x: unknown) => x is T): T[] {
  if (!Array.isArray(v)) return [];
  return v.filter(guard); // bộ lọc narrowing -> T[]
}

// Mock "server" trả JSON không an toàn
const DB: Record<string, unknown> = {
  "/users": [
    { id: 1, name: "Minh", email: "m@x.vn" },
    { id: 2, name: "An", email: null },
    { id: 3, name: "Rác", email: 123 }, // sẽ bị loại bởi guard
  ],
  "/users/:id": { id: 1, name: "Minh", email: "m@x.vn" },
  "/posts": [{ id: 10, title: "Học TS", userId: 1 }],
};

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// fetch có kiểu: tham số route quyết định kiểu trả về
async function request<P extends RoutePath>(
  path: P,
  opts: { timeoutMs?: number } = {},
): Promise<ApiResult<Routes[P]>> {
  const started = performance.now();
  const { timeoutMs = 100 } = opts;
  const realPath: RoutePath = path;
  try {
    const raw = await Promise.race([
      (async () => {
        await delay(15);
        return DB[realPath];
      })(),
      delay(timeoutMs).then(() => {
        throw new Error("timeout");
      }),
    ]);

    if (realPath === "/users") {
      const data = parseList(raw, isUserDto) as Routes[P];
      return { ok: true, data, meta: { ms: Math.round(performance.now() - started) } };
    }
    if (realPath === "/users/:id") {
      if (!isUserDto(raw)) {
        return { ok: false, error: { code: 404, message: "user không hợp lệ" } };
      }
      return { ok: true, data: raw as Routes[P], meta: { ms: Math.round(performance.now() - started) } };
    }
    return { ok: true, data: raw as Routes[P], meta: { ms: Math.round(performance.now() - started) } };
  } catch (e) {
    return { ok: false, error: { code: 408, message: e instanceof Error ? e.message : String(e) } };
  }
}

// Helper "bóc" kết quả, ép người gọi xử lý lỗi
function unwrap<T>(r: ApiResult<T>): T {
  if (r.ok === true) return r.data;
  throw new Error(`${r.error.code}: ${r.error.message}`);
}

async function retry<P extends RoutePath>(path: P, lan = 3): Promise<ApiResult<Routes[P]>> {
  let last: ApiResult<Routes[P]> | undefined;
  for (let i = 0; i < lan; i++) {
    last = await request(path, { timeoutMs: 30 });
    if (last.ok) return last;
    await delay(10 * (i + 1));
  }
  return last ?? { ok: false, error: { code: 500, message: "không chạy lần nào" } };
}

// --- chạy thử ---
const usersRes = await request("/users");
if (usersRes.ok) {
  // usersRes.data là UserDto[]
  console.log("--- typed API ---");
  console.table(usersRes.data.map((u) => ({ ...u, email: u.email ?? "-" })));
  console.log("ms:", usersRes.meta.ms);
} else {
  console.log("lỗi:", usersRes.error.message);
}

const one = await request("/users/:id");
console.log("detail:", one.ok ? unwrap(one).name : one.error.code);

const posts = await retry("/posts");
console.log("retry posts ok?", posts.ok, "| số bài:", posts.ok ? unwrap(posts).length : 0);

const slowRes = await request("/users", { timeoutMs: 1 });
console.log("timeout:", slowRes.ok ? "dữ liệu" : slowRes.error);

// Generic trả về đúng kiểu theo route -> không cần as ở nơi gọi
async function layUsers(): Promise<UserDto[]> {
  const r = await request("/users");
  return r.ok ? r.data : [];
}
console.log("helper:", (await layUsers()).length, "user hợp lệ");

// Bài tập tự làm
// 1) Thêm route "/posts/:userId" trả PostDto[] và xử lý trong request (note: nên switch).
// 2) Bỏ guard isUserDto và xem điều gì xảy ra với dữ liệu rác (email: 123).
// 3) Đổi ApiResult thành Result<T, E> dùng chung và viết map(r, f) cho Result.
