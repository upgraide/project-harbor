import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function DeleteOpportunityGraphRowDialog({
  opportunity,
  graphRow,
  setOpportunity,
  setGraphRow,
}: {
  opportunity: Doc<"mergersAndAcquisitions"> | null;
  graphRow: { year: string; revenue: number; ebitda: number } | null;
  setOpportunity: (opportunity: Doc<"mergersAndAcquisitions"> | null) => void;
  setGraphRow: (
    graphRow: { year: string; revenue: number; ebitda: number } | null,
  ) => void;
}) {
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const handleDelete = () => {
    if (!opportunity || !graphRow) {
      return;
    }

    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        graphRows: (opportunity.graphRows ?? []).filter(
          (row) => row.year !== graphRow.year,
        ),
      }),
      {
        loading: "Deleting graph row",
        success: "Graph row deleted successfully",
        error: "Failed to delete graph row",
      },
    );
    setOpportunity(null);
    setGraphRow(null);
  };

  return (
    <AlertDialog
      open={!!opportunity}
      onOpenChange={() => {
        setOpportunity(null);
        setGraphRow(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Graph Row</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the graph row for year{" "}
            {graphRow?.year}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteOpportunityGraphRowDialog };
