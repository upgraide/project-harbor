"use client";

import { format } from "date-fns";
import { EditIcon, TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useScopedI18n } from "@/locales/client";
import {
  departmentLabels,
  investorClientTypeLabels,
  investorSegmentLabels,
  investorStrategyLabels,
  teamMemberLabels,
} from "../utils/enum-mappings";

type InvestorItem = {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  representativeName: string | null;
  phoneNumber: string | null;
  type: string | null;
  investorType: string;
  department: string | null;
  strategy1: string | null;
  segment1: string | null;
  strategy2: string | null;
  segment2: string | null;
  strategy3: string | null;
  segment3: string | null;
  location1: string | null;
  location2: string | null;
  location3: string | null;
  preferredLocation: string | null;
  minTicketSize: number | null;
  maxTicketSize: number | null;
  targetReturnIRR: number | null;
  leadResponsible: { name: string; email: string } | null;
  leadResponsibleTeam: string | null;
  leadMainContact: { name: string; email: string } | null;
  leadMainContactTeam: string | null;
  physicalAddress: string | null;
  website: string | null;
  lastContactDate: Date | null;
  acceptMarketingList: boolean | null;
  otherFacts: string | null;
  lastNotes: string | null;
  interestSegments: string[];
  interestSubcategories: string[];
};

type InvestorTableRowProps = {
  investor: InvestorItem;
  isAdmin: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

const getMarketingListDisplay = (
  value: boolean | null,
  t: (key: string) => string
) => {
  if (value === true) {
    return t("table.yes");
  }
  if (value === false) {
    return t("table.no");
  }
  return "-";
};

const getEnumLabel = (
  value: string | null,
  labels: Record<string, string>
): string => {
  if (!value) {
    return "-";
  }
  return labels[value] ?? "-";
};

const formatTicketSize = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return "-";
  }
  return `€${value}k`;
};

const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return "-";
  }
  return `${value}%`;
};

const formatLeadContact = (
  lead: { name: string; email: string } | null
): string => {
  if (!lead) {
    return "-";
  }
  return `${lead.name} (${lead.email})`;
};

export const InvestorTableRow = ({
  investor,
  isAdmin,
  onEdit,
  onDelete,
  isDeleting,
}: InvestorTableRowProps) => {
  const t = useScopedI18n("backoffice.investors");

  return (
    <TableRow key={investor.id}>
      <TableCell className="sticky left-0 bg-background font-medium">
        {investor.name}
      </TableCell>
      <TableCell>{investor.email}</TableCell>
      <TableCell>{investor.companyName || "-"}</TableCell>
      <TableCell>{investor.representativeName || "-"}</TableCell>
      <TableCell>{investor.phoneNumber || "-"}</TableCell>
      <TableCell>
        {getEnumLabel(investor.type, investorClientTypeLabels)}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
          {investor.investorType}
        </span>
      </TableCell>
      <TableCell>
        {getEnumLabel(investor.department, departmentLabels)}
      </TableCell>
      <TableCell>
        {getEnumLabel(investor.strategy1, investorStrategyLabels)}
      </TableCell>
      <TableCell>
        {getEnumLabel(investor.segment1, investorSegmentLabels)}
      </TableCell>
      <TableCell>
        {getEnumLabel(investor.strategy2, investorStrategyLabels)}
      </TableCell>
      <TableCell>
        {getEnumLabel(investor.segment2, investorSegmentLabels)}
      </TableCell>
      <TableCell>
        {getEnumLabel(investor.strategy3, investorStrategyLabels)}
      </TableCell>
      <TableCell>
        {getEnumLabel(investor.segment3, investorSegmentLabels)}
      </TableCell>
      <TableCell>{investor.location1 || "-"}</TableCell>
      <TableCell>{investor.location2 || "-"}</TableCell>
      <TableCell>{investor.location3 || "-"}</TableCell>
      <TableCell>{investor.preferredLocation || "-"}</TableCell>
      <TableCell>{formatTicketSize(investor.minTicketSize)}</TableCell>
      <TableCell>{formatTicketSize(investor.maxTicketSize)}</TableCell>
      <TableCell>{formatPercentage(investor.targetReturnIRR)}</TableCell>
      <TableCell>{formatLeadContact(investor.leadResponsible)}</TableCell>
      <TableCell>
        {getEnumLabel(investor.leadResponsibleTeam, teamMemberLabels)}
      </TableCell>
      <TableCell>{formatLeadContact(investor.leadMainContact)}</TableCell>
      <TableCell>
        {getEnumLabel(investor.leadMainContactTeam, teamMemberLabels)}
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {investor.physicalAddress || "-"}
      </TableCell>
      <TableCell>
        {investor.website ? (
          <a
            className="text-primary hover:underline"
            href={investor.website}
            rel="noopener noreferrer"
            target="_blank"
          >
            {investor.website}
          </a>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        {investor.lastContactDate
          ? format(new Date(investor.lastContactDate), "PP")
          : "-"}
      </TableCell>
      <TableCell>
        {getMarketingListDisplay(investor.acceptMarketingList, t)}
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {investor.otherFacts || "-"}
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {investor.lastNotes || "-"}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {investor.interestSegments.length > 0
            ? investor.interestSegments.map((segment) => (
                <span
                  className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs"
                  key={segment}
                >
                  {segment}
                </span>
              ))
            : "-"}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {investor.interestSubcategories.length > 0
            ? investor.interestSubcategories.map((subcategory) => (
                <span
                  className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs"
                  key={subcategory}
                >
                  {subcategory}
                </span>
              ))
            : "-"}
        </div>
      </TableCell>
      {isAdmin && (
        <TableCell className="sticky right-0 z-10 bg-background">
          <div className="flex gap-2">
            <Button
              disabled={isDeleting}
              onClick={() => onEdit(investor.id)}
              size="sm"
              variant="ghost"
            >
              <EditIcon className="size-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isDeleting} size="sm" variant="ghost">
                  <TrashIcon className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteDialog.description").replace(
                    "{name}",
                    investor.name
                  )}
                </AlertDialogDescription>
                <div className="flex justify-end gap-2">
                  <AlertDialogCancel>
                    {t("deleteDialog.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete(investor.id)}
                  >
                    {t("deleteDialog.confirm")}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};
