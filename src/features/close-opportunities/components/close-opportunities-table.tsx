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
import { OpportunityStatus } from "@/generated/prisma";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import {
  useUpdateMergerAndAcquisitionFinalValues,
  useUpdateMergerAndAcquisitionStatus,
} from "@/features/opportunities/hooks/use-m&a-opportunities";
import {
  useUpdateRealEstateFinalValues,
  useUpdateRealEstateStatus,
} from "@/features/opportunities/hooks/use-real-estate-opportunities";
import { UserSelect } from "@/features/users/components/user-select";

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
  const [investedPersonId, setInvestedPersonId] = useState("");
  const [followupPersonId, setFollowupPersonId] = useState("");
  const [profitAmount, setProfitAmount] = useState("");
  const [commissionableAmount, setCommissionableAmount] = useState("");

  const updateMnaStatus = useUpdateMergerAndAcquisitionStatus();
  const updateMnaValues = useUpdateMergerAndAcquisitionFinalValues();
  const updateReStatus = useUpdateRealEstateStatus();
  const updateReValues = useUpdateRealEstateFinalValues();

  const handleUpdate = async () => {
    if (!opportunity || !status) return;

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
            final_amount: finalAmount ? Number.parseFloat(finalAmount) : undefined,
            closed_at: closingDate ? new Date(closingDate) : undefined,
            invested_person_id: investedPersonId || null,
            followup_person_id: followupPersonId || null,
            profit_amount: profitAmount ? Number.parseFloat(profitAmount) : undefined,
            commissionable_amount: commissionableAmount ? Number.parseFloat(commissionableAmount) : undefined,
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
            final_amount: finalAmount ? Number.parseFloat(finalAmount) : undefined,
            closed_at: closingDate ? new Date(closingDate) : undefined,
            invested_person_id: investedPersonId || null,
            followup_person_id: followupPersonId || null,
            profit_amount: profitAmount ? Number.parseFloat(profitAmount) : undefined,
            commissionable_amount: commissionableAmount ? Number.parseFloat(commissionableAmount) : undefined,
          });
        }
      }

      // Reset form and close dialog
      setStatus("");
      setFinalAmount("");
      setClosingDate("");
      setInvestedPersonId("");
      setFollowupPersonId("");
      setProfitAmount("");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Status Selection */}
          <div className="grid gap-2">
            <Label htmlFor="status">{t("labels.status")}</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as OpportunityStatus)}>
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
                  type="number"
                  placeholder={t("placeholders.finalAmount")}
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="closingDate">{t("labels.closingDate")}</Label>
                <Input
                  id="closingDate"
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="investedPerson">{t("labels.investedPerson")}</Label>
                <UserSelect
                  value={investedPersonId}
                  onValueChange={setInvestedPersonId}
                  placeholder={t("placeholders.investedPerson")}
                />
                <p className="text-xs text-muted-foreground">{t("helper.investedPerson")}</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="followupPerson">{t("labels.followupPerson")}</Label>
                <UserSelect
                  value={followupPersonId}
                  onValueChange={setFollowupPersonId}
                  placeholder={t("placeholders.followupPerson")}
                />
                <p className="text-xs text-muted-foreground">{t("helper.followupPerson")}</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profitAmount">{t("labels.profitAmount")}</Label>
                <Input
                  id="profitAmount"
                  type="number"
                  placeholder={t("placeholders.profitAmount")}
                  value={profitAmount}
                  onChange={(e) => setProfitAmount(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="commissionableAmount">{t("labels.commissionableAmount")}</Label>
                <Input
                  id="commissionableAmount"
                  type="number"
                  placeholder={t("placeholders.commissionableAmount")}
                  value={commissionableAmount}
                  onChange={(e) => setCommissionableAmount(e.target.value)}
                />
              </div>
            </>
          )}

          <p className="text-sm text-muted-foreground">{t("helper.values")}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleUpdate} disabled={!status || isUpdating}>
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
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(opportunity)}
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
        opportunity={selectedOpportunity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
