import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// 📦 /lib/utils/formatPrice.ts
export function formatPrice(price: number | string): string {
  if (!price) return "0 đ";

  // Đảm bảo là kiểu số
  const value = Number(price);

  // Format kiểu Việt Nam: 85.000
  return value.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " đ";
}
