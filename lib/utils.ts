import { useLocale } from "next-intl";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeDiacritics(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
