"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type { ClientUploadedFileData } from "uploadthing/types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { cn, UploadButton as UTUploadButton } from "@/lib/utils";

type StyledUploadButtonProps = {
  buttonText?: string;
  className?: string;
  endpoint: keyof OurFileRouter;
  onClientUploadComplete?: (
    res: ClientUploadedFileData<{ uploadedBy: string }>[]
  ) => void | Promise<void>;
  onUploadError?: (error: Error) => void;
};

export const StyledUploadButton = ({
  buttonText = "Upload",
  className,
  endpoint,
  onClientUploadComplete,
  onUploadError,
}: StyledUploadButtonProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const buttonClasses = cn(
    "cursor-pointer bg-primary disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "inline-flex items-center justify-center gap-2 font-medium hover:bg-primary/90",
    "shrink-0 rounded-md px-4 py-2 text-primary-foreground text-sm outline-none",
    "whitespace-nowrap transition-all",
    isDark ? "dark" : ""
  );

  const utButtonClasses = cn(
    "ut-allowed-content:text-muted-foreground ut-allowed-content:text-xs",
    "ut-button:cursor-pointer ut-button:bg-primary",
    "ut-button:disabled:pointer-events-none ut-button:disabled:opacity-50",
    "ut-button:focus-visible:border-ring ut-button:focus-visible:ring-[3px]",
    "ut-button:gap-2 ut-button:font-medium ut-button:focus-visible:ring-ring/50",
    "ut-button:inline-flex ut-button:items-center ut-button:hover:bg-primary/90",
    "ut-button:justify-center ut-button:px-4 ut-button:py-2 ut-button:outline-none",
    "ut-button:shrink-0 ut-button:rounded-md ut-button:text-primary-foreground",
    "ut-button:whitespace-nowrap ut-button:text-sm ut-button:transition-all",
    "ut-upload-icon:size-4",
    className
  );

  return (
    <UTUploadButton<typeof endpoint>
      appearance={{
        allowedContent: "text-muted-foreground text-xs",
        button: buttonClasses,
        container: "flex flex-col items-center justify-center gap-2",
      }}
      className={utButtonClasses}
      content={{
        allowedContent: "5MB max per file",
        button: buttonText,
      }}
      endpoint={endpoint}
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
    />
  );
};
