"use client";

import { useMutation } from "convex/react";
import React, {
  type InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type UploadInputState = {
  uploading: boolean;
  progress: number;
  error: boolean;
  storageIds?: Id<"_storage">[] | null;
};

interface UploadInputProps
  extends Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "accept" | "id" | "type" | "className" | "required" | "tabIndex"
  > {
  generateUploadUrl?: () => Promise<string>;
  onUploadComplete: (uploaded: Id<"_storage">[]) => void;
}

export function UploadInput({
  onUploadComplete,
  generateUploadUrl: propGenerateUploadUrl,
  ...props
}: UploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadInputState>({
    uploading: false,
    progress: 0,
    error: false,
    storageIds: null,
  });

  const convexGenerateUploadUrl = useMutation(api.files.generateUploadUrl);

  const uploadFiles = useCallback(
    (files: File[]) => {
      setUploadState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
        error: false,
      }));

      const uploadPromise = async () => {
        const uploadUrl = await (
          propGenerateUploadUrl || convexGenerateUploadUrl
        )();

        if (!uploadUrl) {
          throw new Error("Failed to generate upload URL");
        }

        const storageIds: Id<"_storage">[] = [];

        await Promise.all(
          files.map(async (file: File) => {
            const result = await fetch(uploadUrl, {
              method: "POST",
              headers: { "Content-Type": file.type },
              body: file,
            });

            const data = await result.json();
            if (!data?.storageId) {
              throw new Error("Invalid response from upload endpoint");
            }
            const { storageId } = data;
            storageIds.push(storageId);
          })
        );

        setUploadState((prev) => ({
          ...prev,
          storageIds,
          progress: 100,
          uploading: false,
        }));

        onUploadComplete(storageIds);

        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };

      toast.promise(uploadPromise(), {
        loading: "Uploading files...",
        success: "Files uploaded successfully",
        error: "Error uploading file",
      });
    },
    [propGenerateUploadUrl, convexGenerateUploadUrl, onUploadComplete]
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }
      const files = Array.from(event.target.files);
      if (files.length === 0) {
        return;
      }
      await uploadFiles(files);
    },
    [uploadFiles]
  );

  return (
    <input
      disabled={uploadState.uploading}
      onChange={handleFileChange}
      ref={fileInputRef}
      type="file"
      {...props}
    />
  );
}
