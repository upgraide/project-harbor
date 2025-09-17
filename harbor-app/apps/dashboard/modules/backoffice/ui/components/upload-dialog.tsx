"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Button } from "@harbor-app/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@harbor-app/ui/components/dialog";
import { Input } from "@harbor-app/ui/components/input";
import { Label } from "@harbor-app/ui/components/label";
import { UploadInput } from "@harbor-app/ui/components/upload-input";
import type { UploadFileResponse } from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";
import { Upload } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded?: () => void;
  opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
}

export const UploadDialog = ({
  open,
  onOpenChange,
  onFileUploaded,
  opportunityId,
}: UploadDialogProps) => {
  const [uploadFrom, setUploadFrom] = useState({
    category: "",
    filename: "",
  });
  const generateUploadUrl = useMutation(api.private.files.generateUploadUrl);
  const addImage = useMutation(
    api.private.mergersAndAcquisitionsOpportunities.addImage,
  );

  // Transitions
  const [isUploading] = useTransition();

  const handleUpdateImage = async (uploaded: UploadFileResponse[]) => {
    try {
      await addImage({
        opportunityId,
        imageId: (uploaded[0]?.response as { storageId: Id<"_storage"> })
          .storageId,
      });

      onFileUploaded?.();
      handleCancel();
    } catch (error) {
      console.error("Failed to add image:", error);
      throw new Error("Failed to add image");
    }
  };

  const handleUploadStart = (uploadPromise: Promise<UploadFileResponse[]>) => {
    const fullUploadPromise = uploadPromise.then(async (uploaded) => {
      try {
        await handleUpdateImage(uploaded);
      } catch (error) {
        console.error("Failed to add image:", error);
        throw error;
      }
    });

    toast.promise(fullUploadPromise, {
      loading: "Uploading image...",
      success: "Image uploaded successfully",
      error: "Failed to upload image",
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUploadFrom({
      category: "",
      filename: "",
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload an Image to atach to this opportunity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">
              Filename
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              className="w-full truncate text-wrap sm:max-w-md"
              id="filename"
              onChange={(e) =>
                setUploadFrom((prev) => ({ ...prev, filename: e.target.value }))
              }
              placeholder="Override default filename"
              type="text"
              value={uploadFrom.filename}
            />
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-2">
                Upload an image
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Drag and drop or click to select
              </p>
              <UploadInput
                accept="image/*"
                className="sr-only"
                generateUploadUrl={generateUploadUrl}
                id="image-upload"
                multiple={false}
                onUploadComplete={handleUpdateImage}
                onUploadStart={handleUploadStart}
                required
                type="file"
              />
              <label
                className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isUploading
                    ? "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                htmlFor="image-upload"
              >
                {isUploading ? "Uploading..." : "Choose File"}
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isUploading}
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
