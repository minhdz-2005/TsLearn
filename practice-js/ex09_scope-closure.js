// =====================================================================
// BÀI 09 — Scope, closure, this/binding
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Scope: block (let/const) vs function vs global; TDZ với let.
//   2. Closure: hàm "nhớ" biến bên ngoài.
//   3. Ứng dụng closure: private state, counter, memoize.
//   4. Vòng lặp + closure: var vs let trong for.
//   5. bind / call / apply và hàm Curry.
//
// CÁCH CHẠY:  node practice-js/ex09_scope-closure.js
// =====================================================================

// --- 1. Block scope & TDZ ---
function scopeDemo() {
  const oNgan = "chỉ sống trong if";
  if (true) {
    const trongBlock = 1;
    var ngoaiBlock = 2; // var bỏ qua block scope (tránh dùng)
  }
  // console.log(trongBlock); // ReferenceError
  console.log("var thoát khỏi block:", typeof ngoaiBlock);
  // console.log(oNgan2); // ReferenceError: TDZ
  // let oNgan2; // biến trong TDZ cho tới khi khai báo
}
scopeDemo();

// --- 2 & 3. Closure ---
function taoBoDem(khoiTinh = 0) {
  let dem = khoiTinh; // biến "private", không truy cập được từ ngoài
  return {
    tang: () => ++dem,
    lay: () => dem,
    datLai: (x) => (dem = x),
  };
}
const dem1 = taoBoDem();
const dem2 = taoBoDem(100); // mỗi lần gọi có môi trường riêng
dem1.tang();
dem1.tang();
console.log("closure counter:", dem1.lay(), dem2.lay());

// Memoize bằng closure
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}
let soLanTinh = 0;
const tinhTong = memoize((n) => {
  soLanTinh++;
  return (n * (n + 1)) / 2;
});
console.log("memo:", tinhTong(100), tinhTong(100), "| số lần tính thật:", soLanTinh);

// --- 4. for + var vs let ---
const cacHamLet = [];
for (let i = 0; i < 3; i++) cacHamLet.push(() => i); // mỗi vòng có binding riêng
const cacHamVar = [];
for (var j = 0; j < 3; j++) cacHamVar.push(() => j); // chia sẻ 1 biến j
console.log("let:", cacHamLet.map((f) => f())); // [0,1,2]
console.log("var:", cacHamVar.map((f) => f())); // [3,3,3]

// --- 5. call / apply / bind ---
const nuocUong = {
  ten: "tra dao",
  moTa(kichCo = "M") {
    return `${this.ten} size ${kichCo}`;
  },
};
const cuaHang = { ten: "cafe" };
console.log("call:", nuocUong.moTa.call(cuaHang, "L"));
console.log("apply:", nuocUong.moTa.apply(cuaHang, ["S"]));
const goiCuaHang = nuocUong.moTa.bind(cuaHang, "XL"); // bind cố định this + preset arg
console.log("bind:", goiCuaHang());

// --- Curry với closure ---
function cong(a) {
  return (b) => a + b;
}
const cong5 = cong(5);
console.log("curry:", cong5(3), cong(2)(2));

// Bài tập tự làm
// 1) Viết counter chỉ cho phép tang/giam, không đọc trực tiếp biến đếm.
// 2) Viết ham on(goiSauMs, fn) in "hoàn thành" sau khoảng trễ (closure + setTimeout).
// 3) Viết once(fn): gọi bao nhiêu lần cũng chỉ chạy 1 lần.
