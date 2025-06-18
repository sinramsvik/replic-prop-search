import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeString(str: string): string {
  const norwegianChars: Record<string, string> = {
    æ: "__AE_LOWER__",
    ø: "__O_LOWER__",
    å: "__AA_LOWER__",
    Æ: "__AE_UPPER__",
    Ø: "__O_UPPER__",
    Å: "__AA_UPPER__",
  };

  const withPlaceholders = Object.entries(norwegianChars).reduce(
    (s, [char, placeholder]) => s.replace(new RegExp(char, "g"), placeholder),
    str
  );

  const normalized = withPlaceholders
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return Object.entries(norwegianChars).reduce(
    (s, [char, placeholder]) => s.replace(new RegExp(placeholder, "g"), char),
    normalized
  );
}
