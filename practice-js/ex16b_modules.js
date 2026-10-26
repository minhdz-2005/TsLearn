// =====================================================================
// BÀI 16b — Module: import / re-export / dynamic import
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. Named import: import { a, b } from "./file.js" (bắt buộc có phần mở rộng).
//   2. Import default với tên tùy ý.
//   3. Import all: import * as ten from ...
//   4. Re-export: export { x } from ... và export * from ...
//   5. Dynamic import(): import awaited, dùng để nạp lười (lazy load).
//   6. Module chỉ được thực thi MỘT lần dù import ở nhiều nơi.
//
// CÁCH CHẠY:  node practice-js/ex16b_modules.js
// =====================================================================

import taoId, { area, normalize, double, Diem, PI_ROUNDED } from "./ex16a_module.js";
import * as MathLib from "./ex16a_module.js";

console.log("--- named import ---");
console.log("area(2):", area(2), "| PI_ROUNDED:", PI_ROUNDED);
console.log("normalize:", normalize("  Hello   World  "));
console.log("alias double:", double(21));

console.log("--- default import ---");
console.log("taoId():", taoId("usr"), "| có prefix:", taoId().startsWith("id_"));

console.log("--- namespace import ---");
console.log("Toàn bộ export:", Object.keys(MathLib).sort());

console.log("--- class từ module ---");
const d = new Diem(3, 4);
console.log("dist:", d.dist());

console.log("--- dynamic import ---");
const moduleNay = await import("./ex16a_module.js");
console.log("same instance?", moduleNay.area === area); // module được cache
const ketQua = await import("./ex16a_module.js").then((m) => m.default("dyn"));
console.log("kết quả dynamic:", ketQua.startsWith("dyn_"));
// Gợi ý dùng: const { taiNang } = await import("./only-when-needed.js")

// Re-export (bạn tự thử): thêm dòng này vào 1 file khác
//   export { area as calcArea } from "./ex16a_module.js";
//   export * from "./ex16a_module.js";

console.log("--- so sánh CommonJS ---");
// CommonJS: const { area } = require("./module.cjs") - đồng bộ, runtime.
// ESM: import - tĩnh, được phân tích trước khi chạy, hỗ trợ tree-shaking.

// Bài tập tự làm
// 1) Tạo file validators.js export isEmail, isPhone và dùng trong file khác.
// 2) Dùng dynamic import để chỉ nạp module khi người dùng bấm "nút" (mock).
// 3) Tạo file index.js re-export tất cả từ validators.js và ex16a_module.js.
