import { type ClassValue, clsx } from "clsx";
import crypto from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePassword(length: number = 12): string {
  //Allowed characters
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  // Generate random bytes
  const randomBytes = crypto.randomBytes(length);

  // Map each byte to a character in the charset
  let password = "";
  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % charset.length;
    password += charset[index];
  }

  return password;
}
