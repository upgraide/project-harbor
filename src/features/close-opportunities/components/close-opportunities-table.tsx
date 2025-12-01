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
  const [entrepriseValue, setEntrepriseValue] = useState("");
  const [equityValue, setEquityValue] = useState("");
  const [price, setPrice] = useState("");
  const [totalInvestment, setTotalInvestment] = useState("");

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

        // Update final values if provided
        if (entrepriseValue || equityValue) {
          await updateMnaValues.mutateAsync({
            id: opportunity.id,
            entrepriseValue: entrepriseValue ? Number.parseFloat(entrepriseValue) : undefined,
            equityValue: equityValue ? Number.parseFloat(equityValue) : undefined,
          });
        }
      } else {
        await updateReStatus.mutateAsync({
          id: opportunity.id,
          status: status as OpportunityStatus,
        });

        // Update final values if provided
        if (price || totalInvestment) {
          await updateReValues.mutateAsync({
            id: opportunity.id,
            price: price ? Number.parseFloat(price) : undefined,
            totalInvestment: totalInvestment ? Number.parseFloat(totalInvestment) : undefined,
          });
        }
      }

      // Reset form and close dialog
      setStatus("");
      setEntrepriseValue("");
      setEquityValue("");
      setPrice("");
      setTotalInvestment("");
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

          {/* Final Values - M&A */}
          {opportunity?.opportunityType === "mna" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="entrepriseValue">
                  {t("labels.entrepriseValue")}
                </Label>
                <Input
                  id="entrepriseValue"
                  type="number"
                  placeholder={t("placeholders.entrepriseValue")}
                  value={entrepriseValue}
                  onChange={(e) => setEntrepriseValue(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="equityValue">{t("labels.equityValue")}</Label>
                <Input
                  id="equityValue"
                  type="number"
                  placeholder={t("placeholders.equityValue")}
                  value={equityValue}
                  onChange={(e) => setEquityValue(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Final Values - Real Estate */}
          {opportunity?.opportunityType === "realEstate" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="price">{t("labels.price")}</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={t("placeholders.price")}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="totalInvestment">
                  {t("labels.totalInvestment")}
                </Label>
                <Input
                  id="totalInvestment"
                  type="number"
                  placeholder={t("placeholders.totalInvestment")}
                  value={totalInvestment}
                  onChange={(e) => setTotalInvestment(e.target.value)}
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
