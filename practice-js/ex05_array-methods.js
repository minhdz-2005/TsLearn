// =====================================================================
// BÀI 05 — map / filter / reduce / sort / một số API hiện đại
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. map: biến đổi mỗi phần tử, trả về mảng MỚI cùng độ dài.
//   2. filter: giữ lại phần tử thỏa điều kiện.
//   3. reduce: gộp mảng thành 1 giá trị (tổng, group by, đếm).
//   4. Nối pipeline: filter -> map -> sort.
//   5. some / every / flatMap / at.
//   6. Sắp xếp xếp tên theo bảng chữ cái tiếng Việt bằng localeCompare.
//
// CÁCH CHẠY:  node practice-js/ex05_array-methods.js
// =====================================================================

const hocSinh = [
  { ten: "Minh", diem: 9.2 },
  { ten: "An", diem: 4.5 },
  { ten: "Khoa", diem: 7.8 },
  { ten: "Ngoc", diem: 8.1 },
  { ten: "Tuan", diem: 3.0 },
];

// --- 1. map ---
const danhSachTen = hocSinh.map((hs) => hs.ten);
const themStt = hocSinh.map((hs, i) => `${i + 1}. ${hs.ten}`);
console.log("map:", themStt.join(", "));

// --- 2. filter ---
const dat = hocSinh.filter((hs) => hs.diem >= 5);
console.log("filter (diem >= 5):", dat.map((hs) => hs.ten));

// --- 3. reduce ---
const tongDiem = hocSinh.reduce((tong, hs) => tong + hs.diem, 0);
const diemTB = tongDiem / hocSinh.length;
console.log("reduce tổng:", tongDiem.toFixed(1), "| trung bình:", diemTB.toFixed(2));

// reduce để gom nhóm (group by)
const nhom = hocSinh.reduce(
  (kq, hs) => {
    const nhom = hs.diem >= 8 ? "gioi" : hs.diem >= 5 ? "kha" : "yeu";
    (kq[nhom] ??= []).push(hs.ten); // ??= chỉ gán khi chưa có mảng
    return kq;
  },
  {}, // giá trị khởi tạo
);
console.log("group by:", nhom);

// --- 4. Pipeline ---
const xepHang = hocSinh
  .filter((hs) => hs.diem >= 5)
  .map((hs) => ({ ...hs, hang: hs.diem >= 8 ? "A" : "B" }))
  .sort((a, b) => b.diem - a.diem);
console.table(xepHang);

// --- 5. some / every / flatMap / at ---
console.log("some (có ai yếu?):", hocSinh.some((hs) => hs.diem < 5));
console.log("every (tất cả đậu?):", hocSinh.every((hs) => hs.diem >= 5));
const lop = [
  ["Minh", "An"],
  ["Khoa"],
];
console.log("flatMap:", lop.flatMap((nhom1) => nhom1.map((t) => t.toUpperCase())));
console.log("at(-1):", danhSachTen.at(-1));

// --- 6. localeCompare với vi ---
const tuVung = ["đào", "an", "ào", "za", "Em"];
console.log("sort chuỗi thường:", [...tuVung].sort());
console.log("sort tiếng Việt:", [...tuVung].sort((a, b) => a.localeCompare(b, "vi")));

// --- Bài tập tự làm ---
// 1) Viết hàm chunk(arr, size) chia mảng thành các mảng con độ dài size.
//    Gợi ý: reduce hoặc for + slice.
// 2) Đếm số lần xuất hiện mỗi ký tự trong chuỗi bằng reduce -> object.
// 3) Bỏ trùng mảng bằng [...new Set(arr)].
