// =====================================================================
// BÀI 15a (TS) — Module & type-only import: file nguồn dùng chung
// ---------------------------------------------------------------------
// Quy ước: dưới nodenext, import file TS phải ghi phần mở rộng .js
// (TS sẽ resolve sang .ts). Dùng `export type` cho type, `export` cho giá trị.
// =====================================================================

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  stock?: number;
}

export type Category = "food" | "tech" | "fashion";

export type OrderItem = {
  product: Product;
  qty: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  createdAt: Date;
};

export type Discount = "none" | "percent" | "fixed";

export function money(v: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(v);
}

export const CATEGORIES: readonly Category[] = ["food", "tech", "fashion"];

export default function total(items: readonly OrderItem[]): number {
  return items.reduce((t, it) => t + it.product.price * it.qty, 0);
}
