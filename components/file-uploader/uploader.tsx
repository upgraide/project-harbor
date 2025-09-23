"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "./render-state";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  files: File[] | null;
  uploading: boolean;
  progress: number;
  key?: string[];
  isDeleting: boolean;
  error: boolean;
  objectUrls?: string[] | null;
  fileType: "image";
}

export const Uploader = () => {
  const [filesState, setFilesState] = useState<UploaderState>({
    id: null,
    files: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const objectUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setFilesState({
        files: acceptedFiles,
        uploading: false,
        progress: 0,
        objectUrls: objectUrls,
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });
    }
  }, []);

  function uploadFiles(files: File[]) {}

  function rejectedFiles(fileRejections: FileRejection[]) {
    if (fileRejections.length) {
      const tooManyFiles = fileRejections.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );

      const fileTooLarge = fileRejections.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );

      if (fileTooLarge) {
        toast.error("File Size exceeded the limit of 5MB");
      }

      if (tooManyFiles) {
        toast.error("You can only upload 20 files");
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 20,
    multiple: true,
    maxSize: 1024 * 1024 * 5 * 20, // 5MB * 20 files
    onDropRejected: rejectedFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        <RenderEmptyState isDragActive={isDragActive} />
      </CardContent>
    </Card>
  );
};
