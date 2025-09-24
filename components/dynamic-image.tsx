"use client";

import { cn } from "@/lib/utils";
import type { ImageProps } from "next/image";
import Image from "next/image";

interface DynamicImageProps extends Omit<ImageProps, "src" | "className"> {
  lightSrc: ImageProps["src"];
  darkSrc: ImageProps["src"];
  className?: string;
}

export function DynamicImage({
  lightSrc,
  darkSrc,
  alt,
  className,
  ...props
}: DynamicImageProps) {
  return (
    <>
      <Image
        alt={alt}
        className={cn("dark:hidden", className)}
        src={lightSrc}
        {...props}
      />
      <Image
        alt={alt}
        className={cn("hidden dark:block", className)}
        src={darkSrc}
        {...props}
      />
    </>
  );
}
