"use client";

import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Button } from "@harbor-app/ui/components/button";
import { ImageOffIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { UploadDialog } from "./upload-dialog";

interface ImageGridProps {
  images: string[];
  imagesStorageIds: Id<"_storage">[];
  opportunityName: string;
  opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
  onDeleteImage?: (storageId: Id<"_storage">) => void;
  onAddImage?: () => void;
  showAddButton?: boolean;
}

export const ImageGrid = ({
  images,
  imagesStorageIds,
  opportunityName,
  opportunityId,
  onDeleteImage,
  onAddImage,
  showAddButton = true,
}: ImageGridProps) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  if (!images || images.length === 0) {
    return (
      <>
        <UploadDialog
          onFileUploaded={onAddImage}
          onOpenChange={setUploadDialogOpen}
          open={uploadDialogOpen}
          opportunityId={opportunityId}
        />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <ImageOffIcon className="size-4" />
          </div>
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No images uploaded
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add images to showcase this opportunity
          </p>
          {showAddButton && (
            <Button onClick={() => setUploadDialogOpen(true)} size="sm">
              Add Image
            </Button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <UploadDialog
        onFileUploaded={onAddImage}
        onOpenChange={setUploadDialogOpen}
        open={uploadDialogOpen}
        opportunityId={opportunityId}
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-all duration-200 hover:shadow-md hover:scale-105"
            key={imagesStorageIds[index]}
          >
            <Image
              alt={`${opportunityName} - Image ${index + 1}`}
              className="object-cover transition-transform duration-200 group-hover:scale-110"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={image}
            />
            {onDeleteImage && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  className="size-8 p-0"
                  onClick={() =>
                    onDeleteImage(imagesStorageIds[index] as Id<"_storage">)
                  }
                  size="sm"
                  variant="destructive"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
        {showAddButton && (
          <div className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50 transition-all duration-200 hover:shadow-md hover:scale-105">
            <Button
              className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-muted/80"
              onClick={() => setUploadDialogOpen(true)}
              variant="ghost"
            >
              <div className="text-center">
                <ImageOffIcon className="size-8 mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Add Image
                </span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
