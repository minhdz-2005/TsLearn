// =====================================================================
// BÀI 03 — Vòng lặp: for, for...of, while, do...while, label
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. In bảng cửu chương bằng for cổ điển (dùng let trong init).
//   2. Duyệt mảng bằng for...of (đọc giá trị) và bằng entries() (đọc cả chỉ số).
//   3. Duyệt object bằng for...in và giải thích vì sao ít dùng với mảng.
//   4. while đếm ngược, do...while đảm bảo chạy ít nhất 1 lần.
//   5. break, continue và label để thoát vòng lặp lồng nhau.
//
// CÁCH CHẠY:  node practice-js/ex03_loops.js
// =====================================================================

// --- 1. for cổ điển ---
console.log("--- Bảng cửu chương 3 ---");
for (let i = 1; i <= 3; i++) {
  let line = "";
  for (let j = 1; j <= 3; j++) {
    line += `${j} x ${i} = ${i * j}\t`;
  }
  console.log(line);
}

// --- 2. for...of ---
const monAn = ["pho", "bun cha", "banh mi"];
console.log("--- for...of ---");
for (const mon of monAn) console.log(mon);
for (const [chiSo, mon] of monAn.entries()) {
  console.log(`${chiSo}: ${mon}`);
}

// --- 3. for...in trên object ---
const user = { name: "Minh", age: 21, city: "Ha Noi" };
console.log("--- for...in ---");
for (const key in user) {
  console.log(key, "=", user[key]);
}
// for...in duyệt cả key kế thừa => không dùng cho mảng, dùng for...of.

// --- 4. while / do...while ---
console.log("--- while / do...while ---");
let dem = 3;
while (dem > 0) {
  console.log("countdown", dem);
  dem--;
}
let batDau = 100;
do {
  console.log("do...while chạy dù điều kiện sai:", batDau < 50);
  batDau++;
} while (batDau < 50);

// --- 5. break / continue / label ---
console.log("--- break / continue ---");
for (const n of [1, 2, 3, 4, 5, 6]) {
  if (n % 2 === 0) continue; // bỏ qua số chẵn
  if (n > 4) break; // dừng hẳn
  console.log("le:", n);
}

console.log("--- label ---");
timKiem: for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    if (i * j === 6) {
      console.log("thấy cặp", i, j, "-> thoát cả 2 vòng");
      break timKiem;
    }
  }
}

// --- Bài tập tự làm (bỏ comment và viết tiếp) ---
// 1) Viết hàm tongDenN(n) trả về tổng 1..n bằng vòng lặp.
// 2) In kim tự tháp sao (*) cao 5 dòng.
// 3) Tìm số đầu tiên trong mảng [4, 7, 2, 9] lớn hơn 5 bằng break.
