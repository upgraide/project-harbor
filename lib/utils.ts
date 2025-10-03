/** biome-ignore-all lint/style/noMagicNumbers: magic numbers */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const username = z
  .string()
  .min(3)
  .max(32)
  .trim()
  .regex(
    /^[a-zA-Z0-9 ]+$/,
    "Username may only contain alphanumeric characters and spaces."
  );
