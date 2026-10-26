// =====================================================================
// BÀI 07 — Hàm: khai báo, tham số mặc định/rest, arrow, this
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. function declaration vs function expression vs arrow function.
//   2. Tham số mặc định, tham số còn thiếu -> undefined.
//   3. Rest parameter (...args) và spread khi gọi hàm.
//   4. Mảng tham số -> destructuring ngay trong chữ ký hàm.
//   5. this: arrow KHÔNG có this riêng, function thường thì phụ thuộc cách gọi.
//   6. Hàm bậc cao: truyền hàm làm tham số, trả về hàm.
//
// CÁCH CHẠY:  node practice-js/ex07_functions.js
// =====================================================================

// --- 1. Ba cách khai báo ---
function kongKhai(a, b) {
  return a + b;
} // được "hoisting", gọi trước khi khai báo vẫn chạy
const bieuThuc = function (a, b) {
  return a - b;
};
const muiTen = (a, b) => a * b; // one-expression => tự return
console.log(kongKhai(5, 3), bieuThuc(5, 3), muiTen(5, 3));

const binhPhuong = (x) => x * x; // 1 tham số có thể bỏ ngoặc
const traVeObject = (x) => ({ giaTri: x, loai: typeof x }); // () => ({...})
console.log(binhPhuong(7), traVeObject("a"));

// --- 2. Tham số mặc định ---
function chao(mot = "Khach", nam = 2026) {
  return `Xin chào ${mot}! Năm ${nam}.`;
}
console.log(chao());
console.log(chao("Minh"));
console.log(chao(undefined, 2030)); // undefined mới dùng mặc định, null thì không

// --- 3. Rest & spread ---
function tong(...cacSo) {
  return cacSo.reduce((t, s) => t + s, 0);
}
console.log("rest (tong 1..5):", tong(1, 2, 3, 4, 5));
const mangSo = [10, 20, 30];
console.log("spread khi gọi:", Math.max(...mangSo));
console.log("apply-like:", tong.call(null, ...mangSo));

// --- 4. Destructuring trong tham số ---
function moTaUser({ ten, tuoi = 0, diaChi: { thanhPho = "N/A" } = {} }) {
  return `${ten} - ${tuoi} - ${thanhPho}`;
}
console.log(moTaUser({ ten: "Minh", tuoi: 21, diaChi: { thanhPho: "Hanoi" } }));
console.log(moTaUser({ ten: "An" }));

// --- 5. this ---
const dem = {
  soLan: 0,
  tangBangFunction() {
    // this = object gọi hàm
    setTimeout(function () {
      console.log("this trong function thường:", this); // window/undefined
    }, 0);
  },
  tangBangArrow() {
    setTimeout(() => {
      this.soLan++; // arrow lấy this của bao quanh
      console.log("arrow this -> soLan =", this.soLan);
    }, 0);
  },
};
dem.tangBangArrow();
const hamToanCuc = (function () {
  return this;
})(); // non-strict => globalThis
console.log("this toàn cục là globalThis:", hamToanCuc === globalThis);

// --- 6. Hàm bậc cao ---
function taoBoDoi(step) {
  return (value) => value * step;
}
const nhan3 = taoBoDoi(3);
const nhan10 = taoBoDoi(10);
console.log("higher-order:", nhan3(5), nhan10(5));
console.log(
  "truyền hàm làm tham số:",
  [1, 2, 3].map(nhan3),
);

// --- Bài tập tự làm ---
// 1) Viết ham(u, v) nhận hàm f và trả về f(f(x)).
// 2) Viết ham trungThuc(a, b, c) với hệ số mặc định để giải phương trình bậc 1.
// 3) Dùng rest viết trungBinh(...so) trả về NaN an toàn (mảng rỗng -> 0).
