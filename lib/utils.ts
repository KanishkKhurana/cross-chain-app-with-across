import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildQueryKey<T extends object | undefined>(
  queryName: string,
  params: T,
) {
  if (!params) return [queryName];
  return [queryName, ...Object.entries(params).map((entry) => entry.join("="))];
}
