// =====================================================================
// BÀI 17 — Event loop: thứ tự thực thi, microtask vs macrotask
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Dự đoán thứ tự in ra trước khi chạy, rồi chạy để kiểm chứng.
//   2. Hiểu: call stack -> microtask queue (Promise, queueMicrotask) ->
//      macrotask (setTimeout, setImmediate, I/O).
//   3. Microtask được xử lý HẾT trước khi chuyển sang macrotask tiếp theo.
//   4. console.time / performance.now để đo thời gian.
//
// CÁCH CHẠY:  node practice-js/ex17_event-loop.js
// =====================================================================

console.log("1) script start (đồng bộ)");

setTimeout(() => console.log("6) setTimeout 0ms (macrotask)"), 0);

queueMicrotask(() => console.log("4) queueMicrotask"));

Promise.resolve()
  .then(() => console.log("3) promise.then #1 (microtask)"))
  .then(() => console.log("5a) promise.then chuỗi #2"))
  .then(() => {
    // microtask sinh ra trong microtask vẫn chạy trước macrotask
    Promise.resolve().then(() => console.log("5b) microtask lồng nhau"));
    console.log("5c) đồng bộ bên trong microtask");
  });

async function asyncDemo() {
  console.log("2a) async chạy đồng bộ tới await đầu tiên");
  await null;
  console.log("2b) sau await là microtask");
}
asyncDemo();

console.log("1b) script end (đồng bộ)");

// Thứ tự thực tế trên Node 22 (các nhãn đánh số):
//   1, 2a, 1b, 4, 3, 2b, 5a, 5c, 5b, 6
// Giải thích:
//   - Toàn bộ code đồng bộ chạy trước, gồm cả 2a (async chạy đồng bộ tới await) và 1b.
//   - Microtask chạy theo thứ tự enqueue: queueMicrotask (#4) được đăng TRƯỚC
//     Promise.resolve().then (#3), nên #4 in trước #3.
//   - Lệnh resume của async function sau `await` là một microtask (#2b).
//   - Microtask sinh thêm microtask (5b) vẫn chạy trước macrotask setTimeout (#6).
//   - Kết luận: đừng tin rằng "Promise luôn trước queueMicrotask" — cùng hàng đợi, FIFO.

console.log("--- đo thời gian ---");
const t0 = performance.now();
for (let i = 0; i < 2_000_000; i++) {
  // vòng lặp nóng
}
console.log("2 triệu vòng lặp:", (performance.now() - t0).toFixed(2), "ms");
console.log("globalThis.performance có sẵn ở Node 18+:", typeof performance);

console.log("--- setImmediate vs setTimeout(0) trong I/O ---");
setTimeout(() => console.log("  timeout"), 0);
setImmediate(() => console.log("  immediate"));
// Trong callback I/O, setImmediate luôn chạy trước setTimeout(0).

// Bài tập tự làm
// 1) Viết lại ví dụ trên và đoán thứ tự trước khi chạy (che phần comment đáp án).
// 2) Giải thích vì sao Promise.all([p1, p2]) không đảo thứ tự kết quả.
// 3) Dùng setTimeout lồng nhau tạo bộ đếm 5 tick cách nhau 50ms (không setInterval).
