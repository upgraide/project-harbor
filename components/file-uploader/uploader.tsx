"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./render-state";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { fetchWithProgress } from "./fetch-with-progress";

interface UploaderState {
  id: string | null;
  files: File[] | null;
  uploading: boolean;
  progress: number;
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
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  async function uploadFiles(files: File[]) {
    setFilesState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const uploadUrl = await generateUploadUrl();

      if (!uploadUrl) {
        toast.error("Failed to generate upload URL");

        setFilesState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));

        return;
      }

      await new Promise<void>((resolve, reject) => {
        files.map(async (file: File) => {
          await fetchWithProgress(
            uploadUrl,
            {
              method: "POST",
              body: file,
              headers: new Headers({
                "Content-Type": "application/octet-stream",
              }),
            },
            (event) => {
              if (event.lengthComputable) {
                const percentageComplete = (event.loaded / event.total) * 100;

                setFilesState((prev) => ({
                  ...prev,
                  progress: Math.round(percentageComplete),
                }));
              }
            },
            () => {
              reject(new Error("Failed to upload file"));
            },
            () => {
              setFilesState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
              }));

              toast.success("File Uploaded with sucess");

              resolve();
            },
          );
        });
      });
    } catch (error) {
      console.error(error);
      toast.error("Error uploading file");

      setFilesState((prev) => ({
        ...prev,
        error: true,
        progress: 0,
        uploading: false,
      }));
    }
  }

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

      uploadFiles(acceptedFiles);
    }
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

  function renderContent() {
    if (filesState.uploading) {
      return <RenderUploadingState progress={filesState.progress} />;
    }

    if (filesState.error) {
      return <RenderErrorState />;
    }

    if (filesState.objectUrls) {
      return <RenderUploadedState />;
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
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
        {renderContent()}
      </CardContent>
    </Card>
  );
};
