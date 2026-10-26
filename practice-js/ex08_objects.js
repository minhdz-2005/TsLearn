// =====================================================================
// BÀI 08 — Object: property, destructuring, spread, phương thức ngắn
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Tạo object, truy cập bằng . và [] (dynamic key).
//   2. Object.keys / values / entries.
//   3. Destructuring có đổi tên + giá trị mặc định + nested.
//   4. Spread để copy / merge / gán đè có kiểm soát.
//   5. Shorthand property & shorthand method.
//   6. Computable key, delete, Object.freeze, hasOwnProperty.
//   7. JSON.stringify để xem object đẹp.
//
// CÁCH CHẠY:  node practice-js/ex08_objects.js
// =====================================================================

const ten = "Minh";
const user = {
  ten, // shorthand: key "ten" lấy biến ten
  tuoi: 21,
  "so thich": ["code", "cafe"], // key có khoảng trắng phải để trong ""
  [ten]: "computed key", // dynamic key -> Minh: "computed key"
  noi({ thanhPho }) {
    // shorthand method + destructuring tham số
    return `${this.ten} ở ${thanhPho}`;
  },
};
console.log("--- truy cập ---");
console.log(user.ten, "|", user["so thich"], "|", user["Minh"]);
console.log("phương thức:", user.noi({ thanhPho: "Hanoi" }));

console.log("--- Object.* ---");
console.log("keys:", Object.keys(user));
console.log("values:", Object.values(user).length, "phần tử");
console.log("entries:", Object.entries(user).slice(0, 2));

console.log("--- destructuring ---");
const { ten: tenMoi, email = "chua cap", "so thich": [monThich] } = user;
console.log(tenMoi, "|", email, "|", monThich);

console.log("--- spread/merge ---");
const sao = { ...user }; // copy nông (shallow)
sao.diaChi = { thanhPho: "Hanoi" }; // thêm key trên bản sao, bản gốc không đổi
console.log("gốc có diaChi?", "diaChi" in user);
const ghiDe = { ...user, ten: "AN", tuoi: user.tuoi + 1 };
console.log("sau ghi đè:", ghiDe.ten, ghiDe.tuoi);
const chan = { ...sao, "so thich": [...sao["so thich"], "doc"] };
console.log("nối mảng trong object:", chan["so thich"]);

console.log("--- delete / in / freeze ---");
const tam = { a: 1, b: 2 };
delete tam.b;
console.log("sau delete:", tam, "| 'b' in tam:", "b" in tam);
console.log("hasOwn:", Object.hasOwn(tam, "a"), Object.hasOwn(tam, "toString"));
Object.freeze(tam);
try {
  tam.a = 99; // ESM luôn chạy ở strict mode => ném TypeError
} catch (e) {
  console.log("freeze rồi gán bị chặn:", e.constructor.name, "-", e.message);
}
console.log("giá trị không đổi:", tam.a);

console.log("--- JSON ---");
console.log(JSON.stringify(user, null, 2).slice(0, 200));
// Mất hàm, Symbol, undefined; Date thành string.

// --- Bài tập tự làm ---
// 1) Viết ham xoaKey(obj, key) trả về object MỚI không còn key đó.
// 2) Viết ham daoNguyen(obj) -> { value: key }.
// 3) Merge 3 object cấu hình: default < file < env (sau ghi đè trước).
