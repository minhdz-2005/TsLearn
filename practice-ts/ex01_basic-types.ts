// =====================================================================
// BÀI 01 (TS) — Kiểu primitive, suy luận kiểu, annotation
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Khai báo biến có kiểu: string/number/boolean/bigint/symbol/void/null/undefined.
//   2. Để TS tự suy luận (inference) và hiểu vì sao ít khi phải viết kiểu.
//   3. Mảng có kiểu: number[], Array<string>, readonly (Tuple bất biến).
//   4. Tuple, enum, any vs unknown vs never.
//   5. Thấy lỗi biên dịch mẫu (bỏ comment từng dòng để test).
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex01_basic-types.ts
// KIỂM TRA TYPE:  npx tsc -p practice-ts --noEmit
// =====================================================================

// --- 1. Annotation tường minh ---
const hoTen: string = "Nguyen van Minh";
let soDu: number = 15_000_000;
let isVip: boolean = false;
let id: bigint = 42n;
const tag: symbol = Symbol("tag");
let khongCoGi: null = null;
let chuaKhoi: undefined = undefined;

function inRa(msg: string): void {
  console.log(msg);
}
inRa(`${hoTen} | số dư ${soDu.toLocaleString("vi-VN")} | vip ${isVip}`);
console.log("bigint:", id, "| symbol:", tag.toString());

// --- 2. Suy luận ---
const ten = "Minh"; // string
const danhSach = [1, 2, 3]; // number[]
const ketHop = [1, "a", true]; // (string | number | boolean)[]
const tinhToan = 10 * 2.5; // number
// ten = 5; // LỖI: Type 'number' is not assignable to type 'string'
console.log("suy luận:", typeof ten, danhSach, ketHop, tinhToan);

// --- 3. Mảng có kiểu ---
const diemSo: number[] = [8, 9, 10];
const ho: Array<string> = ["Minh", "An"];
diemSo.push(7);
// diemSo.push("bảy"); // LỖI
const chiCanDoc: readonly number[] = [1, 2, 3];
// chiCanDoc.push(4); // LỖI: readonly
const daySoTinh: number[] = [...chiCanDoc]; // sao chép ra mảng mutable để thêm

// --- 4. Tuple / enum / any-unknown-never ---
const toDoNode: [string, number, boolean] = ["học TS", 30, true];
const [tenViec, soPhut, xong] = toDoNode;
console.log("tuple:", tenViec, soPhut, xong);
toDoNode[0] = "làm bài"; // vẫn ghi được vì không readonly

enum Phong {
  IT = "it",
  NhanSu = "ns",
  KinhDoanh = "kd",
}
const nhanVien = { ten: "Minh", phong: Phong.IT };
console.log("enum:", nhanVien.phong, "| reverse:", Phong.KinhDoanh);

// any: tắt hoàn toàn kiểm tra kiểu -> tránh dùng
const tuDoAny: any = "5";
const congAny = tuDoAny + 1; // "51" (không lỗi, nhưng sai ngầm)
console.log("any nguy hiểm:", congAny);

// unknown: an toàn, buộc phải thu hẹp kiểu trước khi dùng
const batKy: unknown = JSON.parse('{"a":1}');
if (typeof batKy === "object" && batKy !== null && "a" in batKy) {
  console.log("unknown sau khi narrow:", (batKy as { a: number }).a);
}

// never: không có giá trị nào (hàm không bao giờ return bình thường)
function loiNghiemTrong(msg: string): never {
  throw new Error(msg);
}
// const k = loiNghiemTrong("boom"); // không tới đây
try {
  loiNghiemTrong("exception");
} catch (e) {
  console.log("never hàm ném lỗi, bắt được:", (e as Error).message);
}

// --- 5. Kiểm tra kiểu bằng typeof / Array.isArray ---
const giaTri: string | number = 12;
if (typeof giaTri === "number") {
  console.log("number + 1 =", giaTri + 1);
}
console.log("Array.isArray:", Array.isArray(diemSo), Array.isArray(toDoNode));

// Bài tập tự làm
// 1) Khai báo biến kiểu tuple readonly [lat, long] và thử ghi -> sửa bằng as const.
// 2) Viết enum Direction (Number enum) và in ra giá trị.
// 3) Dùng unknown nhận JSON rồi kiểm tra "nếu là number thì cộng 2, nếu là string thì in hoa".
