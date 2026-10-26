// =====================================================================
// BÀI 02 — Toán tử so sánh, equality, điều kiện, switch, truthy/falsy
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. So sánh == và === , giải thích vì sao nên dùng ===.
//   2. Liệt kê 8 giá trị falsy trong JS.
//   3. Viết hàm xepLoai(diem) trả về "Gioi"/"Kha"/"TrungBinh"/"Yeu"
//      dùng if / else if / else.
//   4. Dùng toán tử ba ngôi (conditional) viết lại câu xếp loại ngắn gọn.
//   5. Dùng switch với chuỗi.
//   6. Dùng && , || và ?? (nullish coalescing) để cấp giá trị mặc định.
//
// CÁCH CHẠY:  node practice-js/ex02_operators-conditions.js
// =====================================================================

// --- 1. == so loosely, === so chăt ---
console.log("--- == vs === ---");
console.log("5 == '5'  :", 5 == "5"); // true  (ép kiểu về number)
console.log("5 === '5' :", 5 === "5"); // false (khác kiểu thì false luôn)
console.log("null == undefined  :", null == undefined); // true
console.log("null === undefined :", null === undefined); // false
console.log("NaN === NaN :", NaN === NaN); // false, dùng Number.isNaN()

// --- 2. Falsy ---
console.log("--- Falsy ---");
const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
for (const giatri of falsy) {
  console.log(JSON.stringify(giatri === 0n ? "0n" : giatri), "->", Boolean(giatri));
}
console.log('Chuỗi rỗng "" là falsy, nhưng "0" là truthy:', Boolean("0"));

// --- 3. if / else if ---
function xepLoai(diem) {
  if (diem >= 9) return "Gioi";
  if (diem >= 7) return "Kha";
  if (diem >= 5) return "TrungBinh";
  return "Yeu";
}
console.log("--- xepLoai ---");
for (const d of [10, 8.5, 6.2, 3]) console.log(d, "->", xepLoai(d));

// --- 4. Toán tử ba ngôi ---
const tinhTrang = (tuoi) => (tuoi >= 18 ? "truong thanh" : "tre em");
console.log(tinhTrang(20), "/", tinhTrang(12));

// --- 5. switch ---
function moTaPing(PING) {
  switch (PING) {
    case "PONG":
      return "ping!";
    case "PUNG":
      return "pong!";
    default:
      return "không rõ";
  }
  // thiếu break sẽ "rơi" (fallthrough) xuống case dưới
}
console.log(moTaPing("PONG"), "|", moTaPing("abc"));

// --- 6. Mặc định với || và ?? ---
console.log("--- || vs ?? ---");
const chuThich1 = "" || "Không có chú thích"; // || mồi falsy
const chuThich2 = "" ?? "Không có chú thích"; // ?? chỉ mồi null/undefined
const soLuong = 0 || 10; // 10 (0 là falsy nên bị ghi đè!)
const soLuongNullish = 0 ?? 10; // 0
console.log(chuThich1, "|", chuThich2, "|", soLuong, "|", soLuongNullish);

const user = { name: "Minh", age: undefined };
console.log(user.name ?? "Anonymous", "|", user.age ?? 0);
