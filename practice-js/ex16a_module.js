// =====================================================================
// BÀI 16a — Module: file nguồn dùng để import (named + default export)
// ---------------------------------------------------------------------
// ĐỀ BÀI của file này:
//   1. Dùng `export` trực tiếp trước khai báo (named export).
//   2. Dùng một lệnh `export { a, b as alias }` tổng hợp.
//   3. Dùng `export default` (mỗi module tối đa 1 default).
//   4. Module có state riêng: import nhiều nơi chỉ chạy 1 lần (singleton).
//
// CÁCH CHẠY:  node practice-js/ex16b_modules.js   (file này là thư viện)
// =====================================================================

export const PI_ROUNDED = 3.14;

export function area(r) {
  return PI_ROUNDED * r * r;
}

function privateHelper(x) {
  return x * 2; // không export => không thể import từ file khác
}

export const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

export class Diem {
  #soLanGoi = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  dist() {
    this.#soLanGoi++;
    return Math.hypot(this.x, this.y);
  }
  get soLanGoi() {
    return this.#soLanGoi;
  }
}

// gộp nhiều export trong 1 câu, có alias
export { privateHelper as double, PI_ROUNDED as PI };

// default export: một "mặt hàng chính" của module
export default function taoId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}
