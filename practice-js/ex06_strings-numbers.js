// =====================================================================
// BÀI 06 — String, Number, Math: các hàm hay dùng
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Chiều dài, index, slice/at, includes/startsWith/endsWith.
//   2. trim, padStart/padEnd, repeat, toUpperCase/toLowerCase.
//   3. split/join, replace/replaceAll, match (regex đơn giản).
//   4. number -> string (toString, toFixed, toLocaleString) và
//      string -> number (Number, parseInt, parseFloat, +).
//   5. Math: round/ceil/floor/max/min/random, tạo số ngẫu nhiên trong đoạn.
//   6. Bài nhỏ: chuẩn hóa họ tên (mất dấu nhiều khoảng trắng, viết hoa đầu từ).
//
// CÁCH CHẠY:  node practice-js/ex06_strings-numbers.js
// =====================================================================

// --- 1. Truy cập & tìm ---
const s = "JavaScript";
console.log("length:", s.length, "| [0]:", s[0], "| at(-1):", s.at(-1));
console.log("slice(4,10):", s.slice(4), "| slice(-4):", s.slice(-4));
console.log("includes('Script'):", s.includes("Script"));
console.log("startsWith('Java'):", s.startsWith("Java"), "| endsWith('pt'):", s.endsWith("pt"));
console.log("indexOf('a'):", s.indexOf("a"), "| lastIndexOf('a'):", s.lastIndexOf("a"));

// --- 2. Chỉnh sửa ---
const tho = "  xin chao  ";
console.log("trim:", JSON.stringify(tho.trim()));
console.log("padStart:", "42".padStart(5, "0"), "| padEnd:", "ab".padEnd(5, "."));
console.log("repeat:", "ha".repeat(3), "| case:", s.toUpperCase(), "/", s.toLowerCase());

// --- 3. Tách / ghép / thay thế ---
const csv = "Minh,An, Khoa , Tuan";
console.log("split + trim + filter:", csv.split(",").map((x) => x.trim()).filter(Boolean));
console.log("replace all 'a' -> '*', s:", "banana".replaceAll("a", "*"));
console.log("replace regex:", "abc123def45".replace(/\d+/g, "#"));
console.log("match all numbers:", "1 cup, 2 spoons, 30 plates".match(/\d+/g));

// --- 4. Chuyển đổi kiểu số ---
console.log("Number('42'):", Number("42"));
console.log("+('3.5'):", +"3.5");
console.log("parseInt('10px'):", parseInt("10px", 10), "| parseFloat('1.5em'):", parseFloat("1.5em"));
console.log("Number('abc'):", Number("abc"), "(NaN, parseInt cũng ra NaN)");
const tien = 1234567.891;
console.log("toFixed(2):", tien.toFixed(2), "(string!)");
console.log("toLocaleString('vi'):", tien.toLocaleString("vi-VN"));
console.log("toString(2):", (255).toString(2), "| parseInt('11111111', 2):", parseInt("11111111", 2));

// --- 5. Math ---
console.log("round:", Math.round(2.5), "| floor:", Math.floor(2.9), "| ceil:", Math.ceil(2.1));
console.log("trunc:", Math.trunc(-2.9), "| abs:", Math.abs(-7), "| sqrt:", Math.sqrt(144));
console.log("max/min:", Math.max(3, 9, 1), Math.min(...[3, 9, 1]));
console.log("ngẫu nhiên 0..1:", Math.random().toFixed(3));
// Số nguyên ngẫu nhiên trong đoạn [min, max]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
console.log("randomInt 1..6 (xúc sắc):", randomInt(1, 6));
console.log("PI:", Math.PI.toFixed(4), "| luy thua 2^10:", Math.pow(2, 10));

// --- 6. Chuẩn hóa họ tên ---
function chuanHoaHoTen(input) {
  return input
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((tu) => tu[0].toUpperCase() + tu.slice(1))
    .join(" ");
}
console.log("chuẩn hóa:", chuanHoaHoTen("   nGUYEN   van   MINH  "));

// --- Bài tập tự làm ---
// 1) Viết hàm reverseString(s).
// 2) Viết kiemTraDoiXung(s) (palindrome, bỏ qua khoảng trắng & hoa/thường).
// 3) Viết ham cheEmail("minh@gmail.com") -> "mi***@gmail.com".
