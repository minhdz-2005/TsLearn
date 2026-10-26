// =====================================================================
// BÀI 13 — Callback, error-first, hàm bậc cao, bất đồng bộ căn bản
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Callback là gì: truyền hàm để gọi sau.
//   2. Quy ước error-first callback: (err, result).
//   3. Viết hàm nhận callback + tùy chọn (options object).
//   4. Callback với timer: setTimeout/setInterval, clear.
//   5. "Callback hell" và cách giảm bằng function có tên.
//   6. Tự viết promisify để chuyển callback -> Promise (cầu nối sang bài 14).
//
// CÁCH CHẠY:  node practice-js/ex13_callbacks.js
// =====================================================================

// --- 1. Callback cơ bản ---
function lamViec(ruLenh, hoanTat) {
  console.log("đang làm việc...");
  const ketQua = ruLenh(21);
  hoanTat(ketQua);
}
lamViec(
  (x) => x * 2,
  (kq) => console.log("1) callback result:", kq),
);

// --- 2. error-first ---
function docFileMock(path, cb) {
  if (typeof path !== "string") {
    cb(new TypeError("path phai la string"), null); // lỗi đi trước
    return;
  }
  const noiDung = { "a.txt": "noi dung A", "b.txt": "noi dung B" }[path] ?? null;
  if (!noiDung) {
    cb(new Error(`Khong tim thay ${path}`), null);
    return;
  }
  cb(null, noiDung);
}
docFileMock("a.txt", (err, data) => {
  if (err) {
    console.error("LỖI:", err.message);
    return;
  }
  console.log("2) đọc được:", data);
});
docFileMock("zzz.txt", (err, data) => console.log("2b) bắt lỗi:", err?.message, "| data:", data));

// --- 3. Options object (dễ mở rộng hơn nhiều tham số) ---
function tai({ url = "default", retries = 2, onRetry = () => {}, done }) {
  for (let lan = 1; lan <= retries; lan++) {
    if (lan === retries) break;
    onRetry(lan);
  }
  done({ url, status: 200 });
}
tai({
  url: "https://x.vn",
  retries: 2,
  onRetry: (lan) => console.log(`3) retry lần ${lan}`),
  done: (res) => console.log("   hoàn tất:", res.status, res.url),
});

// --- 4. Timer ---
console.log("4) trước setTimeout (chạy ngay)");
const handle = setTimeout(() => console.log("   setTimeout 30ms sau"), 30);
const interval = setInterval(() => console.log("   interval_tick"), 10);
setTimeout(() => {
  clearInterval(interval); // nhớ clear để tránh chạy mãi
  console.log("   đã clearInterval sau 35ms");
}, 35);
setTimeout(() => clearTimeout(handle), 100); // handle chưa chạy thì bị hủy

// --- 5. Callback hell, và cách đặt tên hàm để thoát ---
function boc(step, cb) {
  setTimeout(() => cb(step), 15);
}
// callback hell:
boc(1, (a) => boc(a + 1, (b) => boc(b + 1, (c) => console.log("5) hell:", a, b, c))));
// cải tiến: tách thành các hàm có tên
const buoc2 = (b) => buoc3(b + 1);
const buoc1 = (a) => buoc2(a + 1);
const buoc3 = (c) => console.log("   tách hàm vẫn cùng kết quả ->", c);
boc(10, buoc1);

// --- 6. promisify ---
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, value) => (err ? reject(err) : resolve(value)));
    });
}
const docFile = promisify(docFileMock);
docFile("b.txt").then((d) => console.log("6) promisify ->", d));
docFile("nope.txt").catch((e) => console.log("6b) promisify catch ->", e.message));

// Bài tập tự làm
// 1) Viết ham lap(max, onTick) gọi onTick(1..max) cách nhau 20ms rồi onDone.
// 2) Viết retry(fn, times) dùng error-first callback.
// 3) Dùng promisify với setTimeout để viết sleep(ms) trả về Promise.
