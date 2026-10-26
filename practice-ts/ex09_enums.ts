// =====================================================================
// BÀI 09 (TS) — Enum và const object
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Numeric enum (có reverse mapping) và string enum.
//   2. `const enum` bị cấm khi isolatedModules bật -> dùng as const.
//   3. Iteration: Object.keys/values/entries trên enum.
//   4. Union từ enum: typeof E[keyof typeof E].
//   5. Pattern "namespace-like module": const object + type dẫn xuất.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex09_enums.ts
// =====================================================================

// --- 1. Numeric enum ---
enum Priority {
  Low, // 0
  Mid, // 1
  High = 5, // chỉ định
  Critical = 10,
}
console.log("--- numeric enum ---");
console.log("High =", Priority.High, "| reverse:", Priority[5], "| typeof:", typeof Priority.Low);

// --- 2. String enum (khuyến nghị khi cần debug/log) ---
enum Role {
  Admin = "ADMIN",
  Staff = "STAFF",
  Guest = "GUEST",
}
const user = { name: "Minh", role: Role.Admin };
console.log("string enum:", user.role, "| so sánh:", user.role === Role.Admin);
// const saiRole: Role = "USER"; // LỖI: không phải thành viên của Role

// --- 3. Duyệt enum ---
console.log("keys:", Object.keys(Role));
console.log("values:", Object.values(Role));
console.log("entries:", Object.entries(Priority).filter(([, v]) => typeof v === "number"));

// --- 4. Union từ enum & hàm map ---
type RoleName = `${Role}`; // "ADMIN" | "STAFF" | "GUEST"
function moTaRole(r: RoleName): string {
  const map: Record<RoleName, string> = {
    [Role.Admin]: "toàn quyền",
    [Role.Staff]: "nhân viên",
    [Role.Guest]: "khách",
  };
  return map[r];
}
console.log("union từ enum:", Object.values(Role).map((r) => `${r}->${moTaRole(r)}`).join(", "));

// Enum kiểu số dùng làm bit flag
enum Quyen {
  Read = 1 << 0,
  Write = 1 << 1,
  Delete = 1 << 2,
}
function hasQuyen(mask: number, q: Quyen): boolean {
  return (mask & q) === q;
}
const mask = Quyen.Read | Quyen.Write;
console.log("bit flag:", mask, "read?", hasQuyen(mask, Quyen.Read), "delete?", hasQuyen(mask, Quyen.Delete));

// --- 5. Alternative hiện đại: as const object (an toàn hơn khi bundle) ---
const Status = {
  Pending: "PENDING",
  Done: "DONE",
  Failed: "FAILED",
} as const;
type StatusValue = (typeof Status)[keyof typeof Status]; // "PENDING" | "DONE" | "FAILED"
const allStatus: readonly StatusValue[] = Object.values(Status);
function isValid(s: string): s is StatusValue {
  return (allStatus as readonly string[]).includes(s);
}
console.log("--- as const object ---");
console.log("values:", allStatus, "| 'DONE' hợp lệ?", isValid("DONE"), "| 'X'?", isValid("X"));

const tinhHuong = (s: StatusValue): string =>
  s === Status.Pending ? "chờ" : s === Status.Done ? "xong" : "lỗi";
console.log("map:", allStatus.map((s) => `${s}:${tinhHuong(s)}`));

// isolatedModules đang bật trong repo -> `const enum` sẽ lỗi khi chạy từng file riêng lẻ.
// Hãy dùng `as const` ở trên cho code hiện đại (tree-shaking tốt, không sinh code runtime).

// Bài tập tự làm
// 1) enum Month (JAN=1..DEC=12) + hàm tenThang(m: Month): string.
// 2) Chuyển enum Role sang as const object và giữ nguyên type dẫn xuất.
// 3) Viết hàm parseStatus(input: string): StatusValue | null dùng isValid.
