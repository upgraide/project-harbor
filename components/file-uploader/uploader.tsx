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
import { Id } from "@/convex/_generated/dataModel";

interface UploaderState {
  id: string | null;
  files: File[] | null;
  uploading: boolean;
  progress: number;
  isDeleting: boolean;
  error: boolean;
  storageIds?: Id<"_storage">[] | null;
  fileType: "image";
}

interface UploaderProps {
  value?: Id<"_storage">[];
  onChange?: (value: Id<"_storage">[]) => void;
}

export const Uploader = ({ value, onChange }: UploaderProps) => {
  const [filesState, setFilesState] = useState<UploaderState>({
    id: null,
    files: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
    storageIds: value,
  });

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFiles = useMutation(api.files.deleteFiles);

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

      setFilesState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      const storageIds: Id<"_storage">[] = [];

      await Promise.all(
        files.map(async (file: File) => {
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });

          const { storageId } = await result.json();

          storageIds.push(storageId);
        }),
      );

      setFilesState((prev) => ({
        ...prev,
        storageIds: storageIds,
        progress: 100,
        uploading: false,
      }));

      onChange?.(storageIds);

      toast.success("Files uploaded with sucess");
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
      setFilesState({
        files: acceptedFiles,
        uploading: false,
        progress: 0,
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });

      uploadFiles(acceptedFiles);
    }
  }, []);

  async function handleRemoveFile() {
    if (filesState.isDeleting) return;

    try {
      setFilesState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      await deleteFiles({
        ids: filesState.storageIds ?? [],
      });

      setFilesState(() => ({
        id: null,
        files: null,
        uploading: false,
        progress: 0,
        error: false,
        isDeleting: false,
        fileType: "image",
      }));

      onChange?.([]);

      toast.success("File deleted with sucess");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting file");

      setFilesState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

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
      return <RenderUploadingState />;
    }

    if (filesState.error) {
      return <RenderErrorState />;
    }

    if (filesState.storageIds) {
      return (
        <RenderUploadedState
          isDeleting={filesState.isDeleting}
          handleRemoveFile={handleRemoveFile}
        />
      );
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
    disabled:
      filesState.uploading || filesState.isDeleting || !!filesState.storageIds,
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
