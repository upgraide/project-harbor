"use client";

import React, { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "./render-state";
import { toast } from "sonner";

export const Uploader = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
  }, []);

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
