// =====================================================================
// BÀI 12 — Optional chaining, nullish, JSON, Date
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. ?. (optional chaining) trên property, phần tử mảng, và gọi hàm.
//   2. ?? , ??= , ?.= và sự khác biệt với ||.
//   3. JSON.parse / JSON.stringify: tùy chọn replacer, xử lý Date,
//      deep clone bằng JSON (kèm hạn chế).
//   4. Date: tạo, lấy thành phần, định dạng với toLocaleString.
//   5. Bài nhỏ: parse JSON API giả lập và xuất bảng rút gọn.
//
// CÁCH CHẠY:  node practice-js/ex12_optional-json-date.js
// =====================================================================

// --- 1 & 2. Optional chaining / nullish ---
const duLieu = {
  nguoi: { ho: "Nguyen", dem: null },
  danhSach: [{ ten: "A" }, null, { ten: "C", ghiChu: undefined }],
  say: () => "xin chao",
  danhBa: new Map([["work", "ba@work.vn"]]),
};
console.log("--- ?. & ?? ---");
console.log("nested:", duLieu?.nguoi?.ten ?? "(khong co ten)");
console.log("mảng:", duLieu.danhSach[2]?.ten, "| ngoài range:", duLieu.danhSach[9]?.ten);
console.log("gọi hàm:", duLieu.say?.(), "| hàm không tồn tại:", duLieu.hat?.());
console.log("Map.get:", duLieu.danhBa.get("work") ?? "khong co email");
console.log("?.=", (() => {
  const o = {};
  o.dem ??= 1;
  o.dem ??= 99;
  return o.dem;
})());
console.log("mảng rỗng an toàn:", [].at(-1) ?? "mac dinh");

// --- 3. JSON ---
console.log("--- JSON ---");
const person = {
  name: "Minh",
  ngaySinh: new Date("2005-03-14"),
  matKhau: "bí mật",
  noi: { a: 1, ham: () => {} }, // hàm bị bỏ qua khi stringify
};
const json = JSON.stringify(person, (key, value) => (key === "matKhau" ? "***" : value), 2);
console.log(json);
const parseLai = JSON.parse(json);
parseLai.ngaySinh = new Date(parseLai.ngaySinh); // Date phải tái tạo thủ công
console.log("sau parse, ngaySinh là:", typeof parseLai.ngaySinh, "->", parseLai.ngaySinh instanceof Date);

const deep = JSON.parse(JSON.stringify({ a: [1, { b: 2 }], c: undefined }));
console.log("deep clone mất undefined:", deep);
// Hạn chế: mất Date (thành string), Function, undefined, Symbol, Map/Set, vòng tham chiếu.

// --- 4. Date ---
console.log("--- Date ---");
const homNay = new Date();
const moc = new Date("2026-01-01T00:00:00+07:00"); // nên dùng ISO có múi giờ
console.log("ISO:", homNay.toISOString());
console.log("components:", homNay.getFullYear(), homNay.getMonth() + 1, homNay.getDate(), homNay.getHours());
console.log("getDay (0=CN):", homNay.getDay());
console.log("ms:", homNay.getTime());
const soLe = homNay - moc;
console.log("chênh lệch ngày:", Math.floor(soLe / 86_400_000));
console.log(
  "toLocale vi:",
  homNay.toLocaleString("vi-VN", { dateStyle: "full", timeStyle: "short" }),
);
const fmt = new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "long" });
console.log("Intl:", fmt.format(homNay));

// --- 5. Bài nhỏ: parse "API response" ---
const response = `{"data":[{"id":1,"user":{"name":"Minh"},"tags":["a","b"],"score":8.5},
                    {"id":2,"user":null,"tags":[],"score":3}]}`;
const danhSach = JSON.parse(response.replace(/\n\s+/g, " ")).data;
const bang = danhSach.map((it) => ({
  ten: it.user?.name ?? "Khach",
  soTag: it.tags?.length ?? 0,
  xep: it.score >= 5 ? "dat" : "khong dat",
}));
console.table(bang);

// Bài tập tự làm
// 1) Viết ham layDuongDan(obj, "a.b.c") tách đường dẫn và dùng ?. động (reduce).
// 2) Tính số tuổi từ chuỗi "2005-03-14" (chính xác theo ngày).
// 3) Serialize/deserialize Map qua JSON (gợi ý: [...map] rồi Object.fromEntries).
