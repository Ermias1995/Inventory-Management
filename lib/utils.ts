import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("en-US", {
    style:    "currency",
    currency: "USD",
  }).format(Number(price));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  }).format(new Date(date));
}

export function getStockStatus(quantity: number): {
  label: string;
  color: string;
} {
  if (quantity === 0) return { label: "Out of Stock", color: "red"    };
  if (quantity <= 5)  return { label: "Low Stock",    color: "yellow" };
  return                     { label: "In Stock",     color: "green"  };
}