import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce(
  func: (...args: any[]) => void,
  delay: number
): (...args: any[]) => void {
  let debounceTimer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
}

export function safeJSONParse(item: string) {
  try {
    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}
