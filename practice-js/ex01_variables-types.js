// =====================================================================
// BÀI 01 — Biến, kiểu dữ liệu primitive, toán tử cơ bản (JavaScript)
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Khai báo biến bằng let và const (không dùng var nữa).
//   2. In ra đủ các kiểu: string, number, boolean, null, undefined,
//      bigint, symbol.
//   3. Dùng typeof để kiểm tra kiểu của một giá trị.
//   4. Viết phép tính "bmi = canNang / chieuCao^2" và làm tròn 1 số thập phân.
//   5. Dùng template literal (` `) để ghép chuỗi, KHÔNG dùng dấu +.
//
// CÁCH CHẠY:  node practice-js/ex01_variables-types.js
// =====================================================================

// --- 1. let (thay đổi được) và const (không gán lại được) ---
let ten = "Minh";
const NAM_SINH = 2005; // const đặt tên INHOA khi là hằng số
ten = "Minh_hp"; // hợp lệ
// NAM_SINH = 2000; // sẽ lỗi TypeError nếu bỏ comment

// --- 2. Các kiểu primitive ---
const hoVaTen = "Nguyen Van A"; // string
const soDuong = 42; // number (JS chỉ có 1 kiểu số, double 64-bit)
const soThapPhan = 3.14159;
const ok = true; // boolean
const khongCoGi = null; // null (cố ý để trống)
let chuaKhoiTao; // undefined
const soLon = 9007199254740993n; // bigint (thêm hậu tố n)
const kyHieu = Symbol("id"); // symbol (độc nhất vô nhị)

// --- 3. typeof ---
console.log("--- typeof ---");
console.log(typeof hoVaTen, typeof soDuong, typeof ok, typeof khongCoGi);
console.log(typeof chuaKhoiTao, typeof soLon, typeof kyHieu);
// Chú ý: typeof null === "object" (bug lịch sử của JS)
//        typeof NaN === "number"

// --- 4. Phép tính BMI ---
const canNang = 60; // kg
const chieuCao = 1.7; // m
const bmi = canNang / chieuCao ** 2; // ** là toán tử lũy thừa
console.log("--- BMI ---");
console.log("BMI chưa làm tròn:", bmi);
console.log("BMI đã làm tròn:", bmi.toFixed(1)); // toFixed trả về string!
console.log("BMI dạng number:", Number(bmi.toFixed(1)));

// --- 5. Template literal ---
console.log("--- Template literal ---");
console.log(`${ten} sinh năm ${NAM_SINH}, BMI = ${bmi.toFixed(1)}`);
console.log("Biểu thức trong ${}: 2 + 2 =", `${2 + 2}`);

// --- Số có gì bất thường? ---
console.log("--- Cạm bẫy số học ---");
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
console.log(Number.isSafeInteger(soDuong)); // true
console.log("abc" * 2); // NaN (Not a Number, nhưng vẫn là kiểu number)
console.log(Number.isNaN(NaN)); // true, nên dùng Number.isNaN thay cho isNaN
