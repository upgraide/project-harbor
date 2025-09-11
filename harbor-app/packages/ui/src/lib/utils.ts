import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a function that calls all of its arguments.
 *
 * @param fns - The functions to call.
 * @returns A function that calls all of its arguments.
 */
export function callAll<Args extends unknown[]>(
  ...fns: (((...args: Args) => unknown) | undefined)[]
) {
  return (...args: Args) => {
    fns.forEach((fn) => {
      fn?.(...args);
    });
  };
}
