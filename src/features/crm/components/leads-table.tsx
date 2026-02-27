"use client";

import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import {
  CalendarIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  UserCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeadPriority, LeadStatus } from "@/generated/prisma";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { crmLeadDetailsPath } from "@/paths";
import type { LeadListItem } from "../types/lead-schemas";
import { AddNoteDialog } from "./add-note-dialog";
import { AssignLeadDialog } from "./assign-lead-dialog";
import { ScheduleFollowUpDialog } from "./schedule-follow-up-dialog";

type LeadsTableProps = {
  leads: LeadListItem[];
};

export const LeadsTable = ({ leads }: LeadsTableProps) => {
  const t = useScopedI18n("crm.leads");
  const locale = useCurrentLocale();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);

  const handleAssignClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setAssignDialogOpen(true);
  };

  const handleAddNoteClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setNoteDialogOpen(true);
  };

  const handleScheduleFollowUpClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setFollowUpDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case "NEW":
        return "default";
      case "CONTACTED":
        return "secondary";
      case "QUALIFIED":
        return "outline";
      case "MEETING_SCHEDULED":
        return "outline";
      case "PROPOSAL_SENT":
        return "outline";
      case "NEGOTIATION":
        return "outline";
      case "CONVERTED":
        return "default";
      case "LOST":
        return "destructive";
      case "ON_HOLD":
        return "secondary";
      case "NURTURE":
        return "secondary";
      default:
        return "default";
    }
  };

  const getPriorityBadgeVariant = (
    priority: LeadPriority | null
  ): "default" | "destructive" | "secondary" | "outline" => {
    if (!priority) return "outline";
    switch (priority) {
      case "URGENT":
        return "destructive"; // Red for urgent/critical
      case "HIGH":
        return "destructive"; // Red for high priority
      case "MEDIUM":
        return "default"; // Blue for medium priority
      case "LOW":
        return "secondary"; // Gray for low priority
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTicketSize = (min: number | null, max: number | null) => {
    if (!(min || max)) return "N/A";
    if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    if (min) return `${formatCurrency(min)}+`;
    if (max) return `Up to ${formatCurrency(max)}`;
    return "N/A";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: locale === "pt" ? pt : undefined,
    });
  };

  if (leads.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        {t("emptyMessage")}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.company")}</TableHead>
              <TableHead>{t("table.lastContactDate")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.priority")}</TableHead>
              <TableHead>{t("table.assignedTo")}</TableHead>
              <TableHead>{t("table.ticketSize")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <Link
                      className="hover:underline"
                      href={crmLeadDetailsPath(lead.id)}
                    >
                      {lead.name}
                    </Link>
                    <span className="text-muted-foreground text-xs">
                      {lead.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{lead.companyName || "N/A"}</TableCell>
                <TableCell>{formatDate(lead.lastContactDate)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(lead.status)}>
                    {t(`leadStatus.${lead.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {lead.priority && (
                    <Badge
                      className={
                        lead.priority === "MEDIUM"
                          ? "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400"
                          : lead.priority === "LOW"
                            ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                            : ""
                      }
                      variant={getPriorityBadgeVariant(lead.priority)}
                    >
                      {t(`leadPriority.${lead.priority}`)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{lead.leadResponsible?.name || "Unassigned"}</span>
                    {lead.department && (
                      <span className="text-muted-foreground text-xs">
                        {t(`department.${lead.department}`)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {formatTicketSize(lead.minTicketSize, lead.maxTicketSize)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="h-8 w-8 p-0" variant="ghost">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {t("quickActions.title")}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleAssignClick(lead.id)}
                      >
                        <UserCheckIcon className="mr-2 h-4 w-4" />
                        {t("quickActions.assign")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddNoteClick(lead.id)}
                      >
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        {t("quickActions.addNote")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleScheduleFollowUpClick(lead.id)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {t("quickActions.scheduleFollowUp")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={crmLeadDetailsPath(lead.id)}>
                          {t("quickActions.viewDetails")}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <AssignLeadDialog
        leadId={selectedLeadId}
        onOpenChange={setAssignDialogOpen}
        open={assignDialogOpen}
      />
      <AddNoteDialog
        leadId={selectedLeadId}
        onOpenChange={setNoteDialogOpen}
        open={noteDialogOpen}
      />
      <ScheduleFollowUpDialog
        leadId={selectedLeadId}
        onOpenChange={setFollowUpDialogOpen}
        open={followUpDialogOpen}
      />
    </>
  );
};
