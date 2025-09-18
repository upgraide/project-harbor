"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Button } from "@harbor-app/ui/components/button";
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

interface DeleteYearAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onYearDeleted?: () => void;
  opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
  yearToDelete?: number;
}

export const DeleteYearAlertDialog = ({
  open,
  onOpenChange,
  onYearDeleted,
  opportunityId,
  yearToDelete,
}: DeleteYearAlertDialogProps) => {
  const deleteGraphRow = useMutation(
    api.private.mergersAndAcquisitionsOpportunities.deleteGraphRow,
  );

  // Transitions
  const [isDeleting, startTransition] = useTransition();

  const handleDeleteYear = async () => {
    if (!yearToDelete) {
      toast.error("No year selected for deletion");
      return;
    }

    startTransition(async () => {
      try {
        await deleteGraphRow({
          opportunityId,
          year: yearToDelete,
        });

        onYearDeleted?.();
        onOpenChange(false);
        toast.success("Year deleted successfully");
      } catch (error) {
        console.error("Failed to delete year:", error);
        toast.error("Failed to delete year");
      }
    });
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Year Data</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the data for year {yearToDelete}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDeleteYear}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
