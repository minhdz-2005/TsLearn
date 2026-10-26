// =====================================================================
// BÀI 14 — Promise: tạo, chain, xử lý lỗi, Promise.all family
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. new Promise + resolve/reject; trạng thái pending/fulfilled/rejected.
//   2. then / catch / finally, và chain trả về Promise.
//   3. Promise.all (lỗi là fail-fast), allSettled, race, any.
//   4. Promise.resolve/Reject và return giá trị thường trong then.
//   5. Timeout pattern: race với promise hẹn giờ.
//   6. Anti-pattern: promise chain trong vòng lặp -> dùng map + Promise.all.
//
// CÁCH CHẠY:  node practice-js/ex14_promises.js
// =====================================================================

const delay = (ms, value) => new Promise((res) => setTimeout(() => res(value), ms));
const delayFail = (ms, msg) => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));

(async () => {
  // --- 1. Khởi tạo ---
  const promise = new Promise((resolve, reject) => {
    const thanhCong = true;
    if (thanhCong) resolve({ id: 1 });
    else reject(new Error("that bai"));
  });
  console.log("1) pending ->", promise instanceof Promise);

  // --- 2. then / catch / finally ---
  await promise
    .then((r) => {
      console.log("2) then#1:", r);
      return r.id * 10; // giá trị thường được bọc tự động
    })
    .then((id) => delay(20, `chain#${id}`)) // trả về Promise -> chain tiếp
    .then((s) => console.log("   then#2:", s))
    .catch((e) => console.log("   catch:", e.message))
    .finally(() => console.log("   finally luôn chạy"));

  await delayFail(10, "network").catch((e) => console.log("2b) reject ->", e.message));

  // --- 3. Chạy song song ---
  console.time("3) Promise.all");
  const [a, b, c] = await Promise.all([delay(30, "A"), delay(10, "B"), delay(20, "C")]);
  console.timeEnd("3) Promise.all");
  console.log("   kết quả theo thứ tự mảng:", a, b, c);

  const results = await Promise.allSettled([delay(10, "OK"), delayFail(15, "BOOM")]);
  console.log(
    "   allSettled:",
    results.map((r) => (r.status === "fulfilled" ? r.value : `rejected(${r.reason.message})`)),
  );

  try {
    await Promise.all([delay(5, "fine"), delayFail(50, "fail-fast")]);
  } catch (e) {
    console.log("   all fail-fast:", e.message);
  }

  console.log("   race (ai nhanh nhất thắng):", await Promise.race([delay(40, "cham"), delay(5, "nhanh")]));
  console.log("   any (bỏ qua lỗi):", await Promise.any([Promise.reject(new Error("x")), delay(5, "y")]));

  // --- 4. Giá trị thường & await chuỗi ---
  const kq = await 42; // await cũng nhận giá trị thường
  console.log("4) await 42 =", kq);

  // --- 5. Timeout pattern ---
  const delayFailTimeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms`)), ms));
  const voiTimeout = (p, ms) => Promise.race([p, delayFailTimeout(ms)]);
  await voiTimeout(delay(200, "khong kip"), 50).catch((e) => console.log("5)", e.message));

  // --- 6. Anti-pattern vs đúng ---
  const ids = [1, 2, 3];
  console.time("6) for-await (tuần tự)");
  for (const id of ids) await delay(10, id);
  console.timeEnd("6) for-await (tuần tự)");
  console.time("   Promise.all (song song)");
  await Promise.all(ids.map((id) => delay(10, id)));
  console.timeEnd("   Promise.all (song song)");

  // Bài tập tự làm (dùng delay ở đầu file)
  // 1) Viết retry(fn, {lan}) chạy lại khi reject.
  // 2) Viết ham songSongCoHan(n, goc) chạy tối đa 2 promise một lúc.
  // 3) Tạo Promise không bao giờ resolve và dùng Promise.race với timeout.
})();
