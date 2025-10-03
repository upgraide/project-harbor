"use client";

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
    "backofficeMergersAndAcquisitionsOpportunityPage.deleteOpportunityIndustryDialog"
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
      }
    );

    setOpportunity(null);
  };

  return (
    <AlertDialog
      onOpenChange={() => {
        setOpportunity(null);
      }}
      open={!!opportunity}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancelButton")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleDelete}
          >
            {t("deleteButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteOpportunityIndustryDialog };
