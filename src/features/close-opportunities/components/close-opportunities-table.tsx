"use client";

import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { BriefcaseBusinessIcon, HomeIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useUpdateMergerAndAcquisitionFinalValues,
  useUpdateMergerAndAcquisitionStatus,
} from "@/features/opportunities/hooks/use-m&a-opportunities";
import {
  useUpdateRealEstateFinalValues,
  useUpdateRealEstateStatus,
} from "@/features/opportunities/hooks/use-real-estate-opportunities";
import { InvestorSelect } from "@/features/users/components/investor-select";
import { UserSelect } from "@/features/users/components/user-select";
import type { OpportunityStatus } from "@/generated/prisma";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";

type OpportunityItem = {
  id: string;
  name: string;
  status: OpportunityStatus;
  updatedAt: Date;
  opportunityType: "mna" | "realEstate";
};

type UpdateDialogProps = {
  opportunity: OpportunityItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const UpdateStatusDialog = ({
  opportunity,
  open,
  onOpenChange,
}: UpdateDialogProps) => {
  const t = useScopedI18n("backoffice.closeOpportunities.updateDialog");
  const [status, setStatus] = useState<OpportunityStatus | "">("");

  // Simplified fields for CONCLUDED status
  const [finalAmount, setFinalAmount] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [clientOriginatorId, setClientOriginatorId] = useState("");
  const [investedPersonId, setInvestedPersonId] = useState("");
  const [followupPersonId, setFollowupPersonId] = useState("");
  const [commissionableAmount, setCommissionableAmount] = useState("");

  const updateMnaStatus = useUpdateMergerAndAcquisitionStatus();
  const updateMnaValues = useUpdateMergerAndAcquisitionFinalValues();
  const updateReStatus = useUpdateRealEstateStatus();
  const updateReValues = useUpdateRealEstateFinalValues();

  const handleUpdate = async () => {
    if (!(opportunity && status)) return;

    try {
      // Update status
      if (opportunity.opportunityType === "mna") {
        await updateMnaStatus.mutateAsync({
          id: opportunity.id,
          status: status as OpportunityStatus,
        });

        // Update final values if provided and status is CONCLUDED
        if (status === "CONCLUDED") {
          await updateMnaValues.mutateAsync({
            id: opportunity.id,
            final_amount: finalAmount
              ? Number.parseFloat(finalAmount)
              : undefined,
            closed_at: closingDate ? new Date(closingDate) : undefined,
            client_originator_id: clientOriginatorId || null,
            invested_person_id: investedPersonId || null,
            followup_person_id: followupPersonId || null,
            commissionable_amount: commissionableAmount
              ? Number.parseFloat(commissionableAmount)
              : undefined,
          });
        }
      } else {
        await updateReStatus.mutateAsync({
          id: opportunity.id,
          status: status as OpportunityStatus,
        });

        // Update final values if provided and status is CONCLUDED
        if (status === "CONCLUDED") {
          await updateReValues.mutateAsync({
            id: opportunity.id,
            final_amount: finalAmount
              ? Number.parseFloat(finalAmount)
              : undefined,
            closed_at: closingDate ? new Date(closingDate) : undefined,
            client_originator_id: clientOriginatorId || null,
            invested_person_id: investedPersonId || null,
            followup_person_id: followupPersonId || null,
            commissionable_amount: commissionableAmount
              ? Number.parseFloat(commissionableAmount)
              : undefined,
          });
        }
      }

      // Reset form and close dialog
      setStatus("");
      setFinalAmount("");
      setClientOriginatorId("");
      setClosingDate("");
      setInvestedPersonId("");
      setFollowupPersonId("");
      setCommissionableAmount("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating opportunity:", error);
    }
  };

  const isUpdating =
    updateMnaStatus.isPending ||
    updateMnaValues.isPending ||
    updateReStatus.isPending ||
    updateReValues.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Status Selection */}
          <div className="grid gap-2">
            <Label htmlFor="status">{t("labels.status")}</Label>
            <Select
              onValueChange={(value) => setStatus(value as OpportunityStatus)}
              value={status}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("placeholders.selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="CONCLUDED">Concluded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Final Values - Only when CONCLUDED */}
          {status === "CONCLUDED" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="finalAmount">{t("labels.finalAmount")}</Label>
                <Input
                  id="finalAmount"
                  onChange={(e) => setFinalAmount(e.target.value)}
                  placeholder={t("placeholders.finalAmount")}
                  type="number"
                  value={finalAmount}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="closingDate">{t("labels.closingDate")}</Label>
                <Input
                  id="closingDate"
                  onChange={(e) => setClosingDate(e.target.value)}
                  type="date"
                  value={closingDate}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clientOriginator">
                  {t("labels.clientOriginator")}
                </Label>
                <UserSelect
                  onValueChange={setClientOriginatorId}
                  placeholder={t("placeholders.clientOriginator")}
                  value={clientOriginatorId}
                />
                <p className="text-muted-foreground text-xs">
                  {t("helper.clientOriginator")}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="investedPerson">
                  {t("labels.investedPerson")}
                </Label>
                {/* InvestorSelect shows USER role users (actual investors/clients).
                    This is NOT a commission role - just for record/display purposes. */}
                <InvestorSelect
                  onValueChange={setInvestedPersonId}
                  placeholder={t("placeholders.investedPerson")}
                  value={investedPersonId}
                />
                <p className="text-muted-foreground text-xs">
                  {t("helper.investedPerson")}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="followupPerson">
                  {t("labels.followupPerson")}
                </Label>
                {/* UserSelect for TEAM/ADMIN users - this person gets the
                    "Acompanhamento do Investidor" (DEAL_SUPPORT) commission role */}
                <UserSelect
                  onValueChange={setFollowupPersonId}
                  placeholder={t("placeholders.followupPerson")}
                  value={followupPersonId}
                />
                <p className="text-muted-foreground text-xs">
                  {t("helper.followupPerson")}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="commissionableAmount">
                  {t("labels.commissionableAmount")}
                </Label>
                <Input
                  id="commissionableAmount"
                  onChange={(e) => setCommissionableAmount(e.target.value)}
                  placeholder={t("placeholders.commissionableAmount")}
                  type="number"
                  value={commissionableAmount}
                />
              </div>
            </>
          )}

          <p className="text-muted-foreground text-sm">{t("helper.values")}</p>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            {t("cancel")}
          </Button>
          <Button disabled={!status || isUpdating} onClick={handleUpdate}>
            {isUpdating ? t("updating") : t("update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type CloseOpportunitiesTableProps = {
  opportunities: OpportunityItem[];
};

export const CloseOpportunitiesTable = ({
  opportunities,
}: CloseOpportunitiesTableProps) => {
  const t = useScopedI18n("backoffice.closeOpportunities");
  const locale = useCurrentLocale();
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (opportunity: OpportunityItem) => {
    setSelectedOpportunity(opportunity);
    setDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: OpportunityStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "CONCLUDED":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.type")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.updatedAt")}</TableHead>
              <TableHead className="w-12">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {opportunity.opportunityType === "mna" ? (
                      <BriefcaseBusinessIcon className="size-4 text-muted-foreground" />
                    ) : (
                      <HomeIcon className="size-4 text-muted-foreground" />
                    )}
                    {opportunity.name}
                  </div>
                </TableCell>
                <TableCell>
                  {opportunity.opportunityType === "mna"
                    ? t("filters.mna")
                    : t("filters.realEstate")}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(opportunity.status)}>
                    {t(`status.${opportunity.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(opportunity.updatedAt, {
                    addSuffix: true,
                    locale: locale === "pt" ? pt : undefined,
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(opportunity)}
                    size="sm"
                    variant="ghost"
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UpdateStatusDialog
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        opportunity={selectedOpportunity}
      />
    </>
  );
};
