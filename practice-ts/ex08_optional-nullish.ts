// =====================================================================
// BÀI 08 (TS) — optional, exactOptionalPropertyTypes, null/undefined
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. `?` có nghĩa "có thể thiếu", KHÔNG tự động nhận undefined nếu
//      exactOptionalPropertyTypes=true (repo này đang bật).
//   2. Muốn gán được undefined thì phải viết `key?: T | undefined`.
//   3. ?? / ?. / in / Object.hasOwn để xử lý giá trị thiếu.
//   4. Default parameter và "chỉ gán khi thật sự cần".
//   5. Build options pattern: { a: number } | { a?: undefined }.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex08_optional-nullish.ts
// =====================================================================

interface Tao {
  id: number;
  ten: string;
  mau?: string; // CHO PHÉP thiếu, nhưng không cho gán undefined
}

const qua: Tao = { id: 1, ten: "apple" }; // thiếu mau -> ok
const quaMau: Tao = { id: 2, ten: "orange", mau: "cam" };
// const quaHong: Tao = { id: 3, ten: "x", mau: undefined }; // LỖI do exactOptionalPropertyTypes

interface HoSo {
  id: number;
  note?: string | undefined; // cho phép thiếu HOẶC gán undefined (xóa giá trị)
}
const hs: HoSo = { id: 1, note: undefined }; // hợp lệ
console.log("--- optional vs undefined ---");
console.log("Tao thiếu field:", qua, "| HoSo gán undefined:", hs);
console.log("'mau' in qua?", "mau" in qua, "| 'note' in hs?", "note" in hs);

// Xóa field optional: với exactOptionalPropertyTypes phải dùng delete
function xoaMau(t: Tao): Tao {
  const banSao: Tao & { mau?: string } = { ...t };
  delete banSao.mau;
  return banSao;
}
console.log("sau delete:", xoaMau(quaMau));

// --- ?? / ?. / default ---
function inThe(t: Tao): string {
  const ma = t.mau ?? "chưa rõ";
  return `${t.ten.toUpperCase()} (${ma})`;
}
console.log(inThe(qua), "|", inThe(quaMau));

interface Api {
  user?: { name?: string; tags?: string[] };
}
const api: Api = { user: { tags: ["a"] } };
const ten = api.user?.name ?? "(không tên)";
const soTag = api.user?.tags?.length ?? 0;
console.log("--- optional chaining ---");
console.log(ten, "| tags:", soTag, "| deeper:", api.user?.["name"] ?? "-");

// --- Default parameter chỉ chạy khi nhận undefined ---
function noi(tienTo = "Mr", ten?: string): string {
  return `${tienTo} ${ten ?? "Unknown"}`;
}
console.log("default:", noi(), "|", noi("Ms", "Lan"), "|", noi(undefined, "Hoa"));

// --- Build options: giữ literal type theo branch ---
type BuildOptions =
  | { debug: true; optimize?: boolean }
  | { debug: false; optimize: boolean };

const dev: BuildOptions = { debug: true };
const prod: BuildOptions = { debug: false, optimize: true };
// const sai: BuildOptions = { debug: false }; // LỖI: thiếu optimize
function moTaBuild(o: BuildOptions): string {
  return o.debug ? `dev (optimize=${o.optimize ?? "n/a"})` : `prod optimize=${o.optimize}`;
}
console.log("--- build options ---");
console.log(moTaBuild(dev), "|", moTaBuild(prod));

// --- Required<T> / Partial<T> nhắc trước (chi tiết ở bài utility) ---
type DayDu = Required<Tao>; // mọi field bắt buộc, kể cả mau: string
const dayDu: DayDu = { id: 1, ten: "a", mau: "red" };
console.log("Required:", dayDu.mau.toUpperCase());

// Bài tập tự làm
// 1) Viết kiểu CapNhat = { ten?: string; maus?: string[] } và hàm apCapDong.
// 2) Vì sao "field?: T" khác "field: T | undefined"? Minh họa bằng in operator.
// 3) Dùng delete để xóa optional property trên bản sao object và kiểm tra 'in'.
