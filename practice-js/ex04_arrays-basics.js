// =====================================================================
// BÀI 04 — Mảng: tạo, thêm/xóa, tìm, biến đổi (không dùng map/filter)
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Khai báo mảng, truy cập phần tử, chú ý out-of-range trả về undefined.
//   2. push/pop (cuối mảng) và shift/unshift (đầu mảng).
//   3. slice (không làm hỏng mảng gốc) và splice (làm hỏng mảng gốc).
//   4. indexOf / includes / find / findIndex.
//   5. sort với comparator cho số (mặc định sort là theo chuỗi!).
//   6. reverse, join, và sao chép mảng bằng spread.
//
// CÁCH CHẠY:  node practice-js/ex04_arrays-basics.js
// =====================================================================

// --- 1. Truy cập ---
const diem = [8, 6.5, 9, 10, 7];
console.log("phần tử đầu:", diem[0], "| cuối:", diem.at(-1));
console.log("out of range:", diem[99]); // undefined, không ném lỗi
console.log("độ dài:", diem.length);

// --- 2. Thêm / xóa ở 2 đầu ---
const queue = ["B", "C"];
queue.push("D"); // thêm cuối -> ["B","C","D"]
queue.unshift("A"); // thêm đầu -> ["A","B","C","D"]
const cuoi = queue.pop(); // xóa cuối -> "D"
const dau = queue.shift(); // xóa đầu -> "A"
console.log("còn lại:", queue, "| đã lấy:", dau, cuoi);

// --- 3. slice vs splice ---
const mangGoc = [1, 2, 3, 4, 5];
const cat = mangGoc.slice(1, 3); // [2,3] (không gồm index 3)
console.log("slice:", cat, "| gốc vẫn còn:", mangGoc);
mangGoc.splice(1, 2, "x", "y"); // xóa 2 phần tử từ index 1, chèn x,y
console.log("sau splice:", mangGoc);

// --- 4. Tìm kiếm ---
const users = [
  { id: 1, name: "Minh" },
  { id: 2, name: "An" },
  { id: 3, name: "Khoa" },
];
console.log("includes:", [1, 2, 3].includes(2));
console.log("indexOf:", diem.indexOf(9), "| không có -> ", diem.indexOf(100));
console.log("find:", users.find((u) => u.id === 2)); // undefined nếu không thấy
console.log("findIndex:", users.findIndex((u) => u.name === "Khoa"));

// --- 5. Sort ---
const so = [10, 1, 5, 2];
console.log("sort mặc định (chuỗi):", [...so].sort()); // [1,10,2,5]
console.log("sort tăng dần (số):", [...so].sort((a, b) => a - b));
console.log("sort giảm dần:", [...so].sort((a, b) => b - a));
const theoTren = [...users].sort((a, b) => a.name.localeCompare(b.name));
console.log("sort theo tên:", theoTren.map((u) => u.name));

// --- 6. Reverse / join / copy ---
const banSao = [...diem]; // spread tạo mảng mới, không ảnh hưởng gốc
banSao.push(99);
console.log("gốc:", diem, "| bản sao đã push:", banSao);
console.log("reverse:", [...diem].reverse());
console.log("join:", diem.join(" | "));

// --- Bài tập tự làm ---
// 1) Viết hàm removeAt(arr, i) trả về mảng mới không còn phần tử ở vị trí i.
// 2) Tìm phần tử lớn thứ hai của mảng số (không dùng sort).
// 3) Kiểm tra mảng có phần tử trùng nhau không bằng new Set(arr).size.
