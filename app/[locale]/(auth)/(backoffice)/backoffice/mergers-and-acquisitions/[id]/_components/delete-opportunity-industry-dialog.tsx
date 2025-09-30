"use client";

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
import { useScopedI18n } from "@/locales/client";

type MergersAndAcquisitions = Doc<"mergersAndAcquisitions"> | null;

function DeleteOpportunityIndustryDialog({
  opportunity,
  setOpportunity,
}: {
  opportunity: MergersAndAcquisitions;
  setOpportunity: (opportunity: MergersAndAcquisitions) => void;
}) {
  const t = useScopedI18n(
    "backofficeMergersAndAcquisitionsOpportunityPage.deleteOpportunityIndustryDialog",
  );
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const handleDelete = () => {
    if (!opportunity) {
      return;
    }

    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        industry: null,
        industrySubsector: null,
      }),
      {
        loading: t("toastLoading"),
        success: t("toastSuccess"),
        error: t("toastError"),
      },
    );

    setOpportunity(null);
  };

  return (
    <AlertDialog
      open={!!opportunity}
      onOpenChange={() => {
        setOpportunity(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancelButton")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("deleteButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteOpportunityIndustryDialog };
