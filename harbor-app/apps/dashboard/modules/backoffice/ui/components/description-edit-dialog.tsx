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
import { Label } from "@harbor-app/ui/components/label";
import { Textarea } from "@harbor-app/ui/components/textarea";
import { useMutation } from "convex/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface DescriptionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDescriptionUpdated?: () => void;
  opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
  currentDescription?: string;
}

export const DescriptionEditDialog = ({
  open,
  onOpenChange,
  onDescriptionUpdated,
  opportunityId,
  currentDescription = "",
}: DescriptionEditDialogProps) => {
  const [description, setDescription] = useState(currentDescription);
  const updateDescription = useMutation(
    api.private.mergersAndAcquisitionsOpportunities.updateDescription,
  );

  // Transitions
  const [isUpdating, startTransition] = useTransition();

  const handleUpdateDescription = async () => {
    if (!description.trim()) {
      toast.error("Description cannot be empty");
      return;
    }

    startTransition(async () => {
      try {
        await updateDescription({
          opportunityId,
          description: description.trim(),
        });

        onDescriptionUpdated?.();
        handleCancel();
        toast.success("Description updated successfully");
      } catch (error) {
        console.error("Failed to update description:", error);
        toast.error("Failed to update description");
      }
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    setDescription(currentDescription);
  };

  // Reset description when dialog opens with new current description
  useState(() => {
    if (open) {
      setDescription(currentDescription);
    }
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Description</DialogTitle>
          <DialogDescription>
            Update the description for this opportunity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="min-h-[120px] resize-none"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for this opportunity..."
              value={description}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={isUpdating}
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isUpdating || !description.trim()}
            onClick={handleUpdateDescription}
          >
            {isUpdating ? "Updating..." : "Update Description"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
