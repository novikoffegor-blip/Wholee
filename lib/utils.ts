import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

export function getProductUnit(product: Pick<Product, "unit">) {
  return product.unit;
}
