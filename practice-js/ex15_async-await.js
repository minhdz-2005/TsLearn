// =====================================================================
// BÀI 15 — async / await: viết code bất đồng bộ như code đồng bộ
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. async function luôn trả về Promise; await làm dừng (không chặn thread).
//   2. try/catch/finally với await; throw để báo lỗi.
//   3. Tuần tự (await trong for) vs song song (Promise.all).
//   4. await trong for...of, map + Promise.all, và for await...of.
//   5. Bắt lỗi theo từng lệnh thay vì cả khối.
//   6. Top-level await và pattern "try-return tuple".
//
// CÁCH CHẠY:  node practice-js/ex15_async-await.js
// =====================================================================

const delay = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const timKiem = async (id) => {
  await delay(20);
  if (id < 0) throw new RangeError(`id không hợp lệ: ${id}`);
  return { id, ten: `user-${id}` };
};

// --- 1. async trả về Promise ---
const batDongBo = async () => "xin chao";
console.log("1) kiểu trả về:", batDongBo() instanceof Promise);
batDongBo().then((v) => console.log("   value:", v));

// --- 2. try / catch / finally ---
async function viDu2() {
  try {
    const u = await timKiem(-1);
    console.log("   không tới đây:", u);
  } catch (e) {
    console.log("2) caught:", e.constructor.name, "-", e.message);
  } finally {
    console.log("   finally: đóng kết nối / release lock");
  }
}
await viDu2();

// --- 3. Tuần tự vs song song ---
console.time("3) tuần tự");
const lanLuot = [];
for (const id of [1, 2, 3]) lanLuot.push(await timKiem(id));
console.timeEnd("3) tuần tự");

console.time("   song song");
const songSong = await Promise.all([1, 2, 3].map((id) => timKiem(id)));
console.timeEnd("   song song");
console.log("   cùng kết quả:", songSong.map((u) => u.ten));

// --- 4. for await...of trên async iterable ---
async function* taoDongLuong() {
  for (const x of ["a", "b", "c"]) {
    await delay(10);
    yield x;
  }
}
const dong = [];
for await (const x of taoDongLuong()) dong.push(x);
console.log("4) for await...of:", dong);

// --- 5. Bắt lỗi hẹp: helper "tuple" ---
const safely = async (p) => {
  try {
    return [null, await p];
  } catch (e) {
    return [e, null];
  }
};
const [err, user] = await safely(timKiem(5));
if (err) console.log("5) lỗi:", err.message);
else console.log("5) ok:", user.ten);
const [err2] = await safely(timKiem(-5));
console.log("5b) lỗi bắt được:", err2?.message);

// --- 6. await trong hàm không-async? -> không được, phải bọc async ---
async function tongHop(ids) {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        return { id, ok: true, data: await timKiem(id) };
      } catch {
        return { id, ok: false, data: null };
      }
    }),
  );
  return results.filter((r) => r.ok).length;
}
console.log("6) số lệnh thành công:", await tongHop([1, -1, 2, 3]));

// Top-level await hoạt động vì file này là ES module (.js trong ESM).

// Bài tập tự làm
// 1) Viết ham taiNhieu(urls, concurren) chỉ chạy 2 request một lúc.
// 2) Viết lại viDu2 dùng `.catch()` thay cho try/catch.
// 3) Viết sleep(ms) và dùng nó để in đếm ngược 3-2-1 bằng async/await.
