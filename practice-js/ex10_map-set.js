// =====================================================================
// BÀI 10 — Map, Set, WeakMap: bộ sưu tập hiện đại
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Map: key là mọi kiểu (object cũng được), giữ thứ tự chèn.
//   2. Set: tập hợp không trùng, dùng để loại bỏ trùng & kiểm tra thành viên.
//   3. Duyệt Map/Set bằng for...of và entries().
//   4. So sánh hiệu năng "in" trên Array vs Set.has.
//   5. WeakMap/WeakSet: key là object, cho phép GC (dùng cache theo object).
//
// CÁCH CHẠY:  node practice-js/ex10_map-set.js
// =====================================================================

// --- 1. Map ---
const thangLuong = new Map([
  ["Minh", 10_000_000],
  ["An", 8_500_000],
]);
const keyObject = { id: 1 };
thangLuong.set(keyObject, 12_000_000); // Map cho phép key là object
console.log("--- Map ---");
console.log("size:", thangLuong.size);
console.log("get('Minh'):", thangLuong.get("Minh"));
console.log("get(theo object):", thangLuong.get(keyObject));
console.log("has('Khoa'):", thangLuong.has("Khoa"), "| get -> undefined:", thangLuong.get("Khoa"));
thangLuong.set("Minh", 11_000_000); // ghi đè key cũ, không thêm phần tử
console.log("sau set đè:", thangLuong.get("Minh"), "| size:", thangLuong.size);
thangLuong.delete(keyObject);
for (const [nhan, giaTri] of thangLuong) {
  console.log(" ", nhan instanceof Object ? "[object]" : nhan, "=>", giaTri);
}
console.log("mảng key/value:", [...thangLuong.keys()], [...thangLuong.values()]);

// Map -> object và ngược lại
const tuMap = Object.fromEntries(thangLuong.entries());
console.log("Object.fromEntries:", Object.keys(tuMap));

// --- 2. Set ---
console.log("--- Set ---");
const chuSo = new Set([1, 2, 2, 3, 3, 3]);
console.log("tự loại trùng:", [...chuSo]);
chuSo.add(4);
chuSo.add(4); // không thêm
console.log("has(3):", chuSo.has(3), "| size:", chuSo.size);
chuSo.delete(1);
console.log("còn:", [...chuSo]);

const bangA = ["a", "b", "c", "a"];
const bangB = ["c", "d"];
const hop = new Set([...bangA, ...bangB]);
const chung = [...new Set(bangA)].filter((x) => new Set(bangB).has(x));
console.log("hợp:", [...hop], "| giao:", chung, "| hiệu:", [...new Set(bangA)].filter((x) => !new Set(bangB).has(x)));

// --- 4. Array.includes vs Set.has ---
const lon = Array.from({ length: 100_000 }, (_, i) => i);
const tapLon = new Set(lon);
console.time("array.includes");
lon.includes(99_999);
console.timeEnd("array.includes");
console.time("set.has");
tapLon.has(99_999);
console.timeEnd("set.has");

// --- 5. WeakMap ---
console.log("--- WeakMap ---");
const cacheTheoObject = new WeakMap();
const nguoi = { ten: "Minh" };
cacheTheoObject.set(nguoi, { luuTru: Date.now() });
console.log("có cache:", cacheTheoObject.has(nguoi));
// WeakMap không lặp được, key tự bị GC khi object không còn tham chiếu.

// Bài tập tự làm
// 1) Đếm tần suất mỗi từ trong câu bằng Map.
// 2) Viết ham gopKhongTrung(...mang) hợp nhiều mảng không trùng phần tử.
// 3) Dùng Map đếm ký tự để kiểm tra 2 chuỗi có phải hoán vị của nhau không.
