"use client";

import type { UploadFileResponse } from "@xixixao/uploadstuff/react";
// @ts-expect-error - Module resolution issue with uploadstuff package
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { type InputHTMLAttributes, useRef } from "react";

export function UploadInput({
  generateUploadUrl,
  onUploadComplete,
  onUploadStart,
  ...props
}: {
  generateUploadUrl: () => Promise<string>;
  onUploadComplete?: (uploaded: UploadFileResponse[]) => Promise<void> | void;
  onUploadStart?: (uploadPromise: Promise<UploadFileResponse[]>) => void;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "accept" | "id" | "type" | "className" | "required" | "tabIndex" | "multiple"
>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadFiles(generateUploadUrl, {
    onUploadComplete: async (uploaded: UploadFileResponse[]) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (onUploadComplete) {
        await onUploadComplete(uploaded);
      }
    },
  });
  return (
    <input
      disabled={isUploading}
      onChange={async (event) => {
        if (!event.target.files) {
          return;
        }
        const files = Array.from(event.target.files);
        if (files.length === 0) {
          return;
        }

        const uploadPromise = startUpload(files);
        onUploadStart?.(uploadPromise);
      }}
      ref={fileInputRef}
      type="file"
      {...props}
    />
  );
}
