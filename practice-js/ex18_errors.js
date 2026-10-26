// =====================================================================
// BÀI 18 — Lỗi: throw, try/catch, custom Error class
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. throw có thể ném mọi giá trị (nhưng chỉ nên ném Error).
//   2. catch không tham số, lỗi không bắt được -> process crash.
//   3. Custom error class kế thừa Error, có `name` và `code` đúng cách.
//   4. instanceof để phân loại lỗi; re-throw sau khi log.
//   5. Bắt lỗi toàn cục: process.on("uncaughtException") (chỉ để log).
//   6. Validation pattern: ném lỗi sớm (fail fast) với message rõ ràng.
//
// CÁCH CHẠY:  node practice-js/ex18_errors.js
// =====================================================================

// --- 3. Custom error ---
class AppError extends Error {
  constructor(message, code = "APP_ERROR", cause) {
    super(message, { cause }); // cause giữ lỗi gốc (ES2022)
    this.name = "AppError";
    this.code = code;
    Error.captureStackTrace?.(this, AppError); // ẩn khung stack của constructor
  }
}
class ValidationError extends AppError {
  constructor(field, reason) {
    super(`Field "${field}": ${reason}`, "VALIDATION");
    this.name = "ValidationError";
    this.field = field;
  }
}

// --- 6. Fail fast ---
function dangKy({ name, age }) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new ValidationError("name", "không được rỗng");
  }
  if (!Number.isInteger(age) || age < 0 || age > 150) {
    throw new ValidationError("age", `phải là số nguyên 0..150, nhận ${age}`);
  }
  return { id: Symbol("u"), name: name.trim(), age };
}

console.log("--- 1/2/4: bắt và phân loại lỗi ---");
const cacTruongHop = [
  () => dangKy({ name: "  ", age: 20 }),
  () => dangKy({ name: "Minh", age: 300 }),
  () => dangKy({ name: "Minh", age: 21 }),
  () => {
    throw "chuỗi thô"; // ném giá trị không phải Error
  },
  () => {
    JSON.parse("{khong phai json}");
  },
];

for (const fn of cacTruongHop) {
  try {
    const kq = fn();
    console.log("OK:", kq.name ?? kq);
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(`VALIDATION [${e.code}] field=${e.field} :: ${e.message}`);
    } else if (e instanceof AppError) {
      console.log("APP:", e.message);
    } else if (e instanceof SyntaxError) {
      console.log("JSON lỗi cú pháp:", e.message.slice(0, 40));
    } else {
      console.log("Lỗi không phải Error:", typeof e, e);
    }
  }
}

// --- cause: chuỗi lỗi ---
try {
  try {
    JSON.parse("nope");
  } catch ( goc ) {
    throw new AppError("Không đọc được cấu hình", "CONFIG", goc);
  }
} catch (e) {
  console.log("cause chain:", e.message, "<-", e.cause?.name);
}

// --- finally: return trong finally sẽ "nuốt" exception (anti-pattern) ---
function hamNghichLy() {
  try {
    throw new Error("A");
  } finally {
    return "B"; // giá trị trả về thắng, lỗi bị nuốt
  }
}
console.log("finally + return:", hamNghichLy(), "(lỗi đã biến mất!)");

// --- 5. Lỗi không bắt ---
process.on("uncaughtException", (e) => console.log("uncaught (chỉ để log):", e.message));
setTimeout(() => {
  throw new Error("ném trong macrotask, không có try/catch");
}, 0);

// Bài tập tự làm
// 1) Viết class HttpError(status, url) với message "404 at url".
// 2) Viết ham docConfig(path) đọc JSON từ string, ném AppError có cause khi hỏng.
// 3) Vì sao "catch (e) {}" rỗng là ý tưởng tệ? Viết 1 ví dụ chứng minh.
