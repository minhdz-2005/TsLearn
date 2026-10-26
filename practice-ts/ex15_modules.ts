// =====================================================================
// BÀI 15b (TS) — Module: import/export type, re-export, namespace, global
// ---------------------------------------------------------------------
// ĐỀ BÀI:
//   1. `import type` vs `import` — verbatimModuleSyntax buộc tách riêng type.
//   2. Re-export có chọn lọc: export type { X } from ..., export * as ns.
//   3. Import mặc định + named cùng lúc.
//   4. declare module / declare global để bổ sung kiểu cho thư viện.
//   5. Import module built-in Node (node:fs, node:path) có types nhờ @types/node.
//
// CÁCH CHẠY:  npm run practice:ts -- practice-ts/ex15_modules.ts
// =====================================================================

import type { Product, Category, Order } from "./shared-types/index.js"; // chỉ type, bị xóa khi biên dịch
import { money, CATEGORIES, default as total } from "./shared-types/index.js"; // giá trị thật
import * as Shop from "./shared-types/index.js"; // namespace object
import { join, basename } from "node:path";
import { tmpdir } from "node:os";

const p: Product = { id: 1, name: "bún chả", price: 60_000, category: "food" };
console.log("--- import type / value ---");
console.log(money(p.price), "| category hợp lệ:", p.category, "| danh mục:", CATEGORIES.join(", "));

const items = [{ product: p, qty: 2 }];
console.log("default export (total):", money(total(items)));
console.log("namespace:", typeof Shop.money, "| re-export CATEGORIES:", Shop.CATEGORIES.length);

// Kiểm tra runtime: `import type` không sinh ra require/imp
// Nếu bỏ `type`, code vẫn chạy nhưng compiler sẽ giữ lại import (verbatimModuleSyntax).

// --- Generic với type nhập từ module khác ---
function byCategory<T extends { category: Category }>(ds: readonly T[]): Record<Category, T[]> {
  const out = { food: [], tech: [], fashion: [] } as Record<Category, T[]>;
  for (const it of ds) out[it.category].push(it);
  return out;
}
const dsProduct: Product[] = [
  p,
  { id: 2, name: "laptop", price: 25_000_000, category: "tech" },
  { id: 3, name: "áo", price: 200_000, category: "fashion" },
];
const nhom = byCategory(dsProduct);
console.log("nhóm theo category:", Object.entries(nhom).map(([k, v]) => `${k}:${v.length}`));

// --- Order dùng Date & helper ---
const order: Order = { id: "o1", items, createdAt: new Date() };
console.log("order:", order.id, "| mặt hàng:", order.items.length, "| total:", money(total(order.items)));

// --- Module built-in Node ---
const duongDan = join(tmpdir(), "demo.json");
console.log("--- node builtin ---", duongDan, "| basename:", basename(duongDan));

// --- Re-export (tự thử trong project của bạn) ---
// export type { Product as Item } from "./shared-types/index.js";
// export * as shopTypes from "./shared-types/index.js";
// export { money } from "./shared-types/index.js";

// --- declare global / module augmentation ---
interface GlobalWithFlag {
  __DEMO_MODE__: boolean;
}
declare global {
  // thêm property vào toàn cục: phải là var, không phải let/const
  // eslint-disable-next-line no-var
  var __demo__: string | undefined;
}
globalThis.__demo__ = "on"; // giờ là property có kiểu của globalThis
const ctx: GlobalWithFlag = { __DEMO_MODE__: true };
console.log("declare global:", ctx.__DEMO_MODE__, "|", globalThis.__demo__, typeof __demo__);

// augmentation kiểu này thường dùng khi thư viện thiếu type:
// declare module "some-lib" { interface Options { retry?: number } }

// Bài tập tự làm
// 1) Tạo practice-ts/shared-types/cart.ts export type Cart + hàm calc, import vào file khác.
// 2) Đổi 1 import type thành import thường rồi chạy npm run practice:ts:check để xem khác gì.
// 3) Dùng `import { readFileSync } from "node:fs"` đọc chính file package.json và parse JSON.
