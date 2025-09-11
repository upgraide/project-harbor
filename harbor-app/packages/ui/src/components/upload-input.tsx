"use client";

import type { UploadFileResponse } from "@xixixao/uploadstuff/react";
// @ts-expect-error - Module resolution issue with uploadstuff package
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { type InputHTMLAttributes, useRef } from "react";

export function UploadInput({
  generateUploadUrl,
  onUploadComplete,
  ...props
}: {
  generateUploadUrl: () => Promise<string>;
  onUploadComplete: (uploaded: UploadFileResponse[]) => void;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "accept" | "id" | "type" | "className" | "required" | "tabIndex"
>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadFiles(generateUploadUrl, {
    onUploadComplete: async (uploaded: UploadFileResponse[]) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadComplete(uploaded);
    },
  });
  return (
    <input
      onChange={async (event) => {
        if (!event.target.files) {
          return;
        }
        const files = Array.from(event.target.files);
        if (files.length === 0) {
          return;
        }
        startUpload(files);
      }}
      ref={fileInputRef}
      type="file"
      {...props}
    />
  );
}
