import { useMutation } from "convex/react";
import { toast } from "sonner";
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
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

function DeleteOpportunityGraphRowDialog({
  opportunity,
  graphRow,
  setOpportunity,
  setGraphRow,
}: {
  opportunity: Doc<"mergersAndAcquisitions"> | null;
  graphRow: {
    year: string;
    revenue: number;
    ebitda: number;
    ebitdaMargin: number;
  } | null;
  setOpportunity: (opportunity: Doc<"mergersAndAcquisitions"> | null) => void;
  setGraphRow: (
    graphRow: {
      year: string;
      revenue: number;
      ebitda: number;
      ebitdaMargin: number;
    } | null
  ) => void;
}) {
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const handleDelete = () => {
    if (!(opportunity && graphRow)) {
      return;
    }

    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        graphRows: (opportunity.graphRows ?? []).filter(
          (row) => row.year !== graphRow.year
        ),
      }),
      {
        loading: "Deleting graph row",
        success: "Graph row deleted successfully",
        error: "Failed to delete graph row",
      }
    );
    setOpportunity(null);
    setGraphRow(null);
  };

  return (
    <AlertDialog
      onOpenChange={() => {
        setOpportunity(null);
        setGraphRow(null);
      }}
      open={!!opportunity}
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
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteOpportunityGraphRowDialog };
