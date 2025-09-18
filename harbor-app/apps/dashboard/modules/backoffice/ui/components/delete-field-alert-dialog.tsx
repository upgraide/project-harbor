"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@harbor-app/ui/components/alert-dialog";
import { useMutation } from "convex/react";
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteFieldAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFieldDeleted?: () => void;
  opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
  fieldName?: string;
  fieldLabel?: string;
}

export const DeleteFieldAlertDialog = ({
  open,
  onOpenChange,
  onFieldDeleted,
  opportunityId,
  fieldName,
  fieldLabel,
}: DeleteFieldAlertDialogProps) => {
  const updateField = useMutation(api.private.mergersAndAcquisitionsOpportunities.updateOpportunityField);

  // Transitions
  const [isDeleting, startTransition] = useTransition();

  const handleDeleteField = async () => {
    if (!fieldName) {
      toast.error("No field selected for deletion");
      return;
    }

    startTransition(async () => {
      try {
        await updateField({
          opportunityId,
          field: fieldName,
          value: null,
        });

        onFieldDeleted?.();
        onOpenChange(false);
        toast.success("Field cleared successfully");
      } catch (error) {
        console.error("Failed to clear field:", error);
        toast.error("Failed to clear field");
      }
    });
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Field Value</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to clear the value for {fieldLabel || fieldName}? This will remove the current value and set it to empty. This action can be undone by editing the field again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDeleteField}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Clearing..." : "Clear Field"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
