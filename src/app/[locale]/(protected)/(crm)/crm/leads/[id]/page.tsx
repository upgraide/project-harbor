"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { pt, enUS } from "date-fns/locale";
import {
  ArrowLeftIcon,
  CalendarIcon,
  FileTextIcon,
  UserCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { crmLeadsPath } from "@/paths";
import { useTRPC } from "@/trpc/client";
import { AddNoteDialog } from "@/features/crm/components/add-note-dialog";
import { AssignLeadDialog } from "@/features/crm/components/assign-lead-dialog";
import { ScheduleFollowUpDialog } from "@/features/crm/components/schedule-follow-up-dialog";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = ({ params }: PageProps) => {
  const { id: leadId } = use(params);
  const t = useScopedI18n("crm.leadDetails");
  const tLeads = useScopedI18n("crm.leads");
  const locale = useCurrentLocale();
  const dateLocale = locale === "pt" ? pt : enUS;
  const trpc = useTRPC();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);

  const { data: lead, isLoading } = useQuery(
    trpc.crm.leads.getOne.queryOptions({ id: leadId })
  );

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">{t("notFound")}</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href={crmLeadsPath()}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                {t("backToList")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return t("sections.timeline.noDate");
    return format(new Date(date), "PPp", { locale: dateLocale });
  };

  const formatDateShort = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "PP", { locale: dateLocale });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "NEW":
        return "default";
      case "CONVERTED":
        return "default";
      case "LOST":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPriorityBadgeVariant = (priority: string | null): "default" | "destructive" | "secondary" | "outline" => {
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

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link href={crmLeadsPath()}>
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{lead.name}</h1>
          </div>
          <p className="text-muted-foreground">{lead.email}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAssignDialogOpen(true)} variant="outline">
            <UserCheckIcon className="mr-2 h-4 w-4" />
            {t("actions.assign")}
          </Button>
          <Button onClick={() => setNoteDialogOpen(true)} variant="outline">
            <FileTextIcon className="mr-2 h-4 w-4" />
            {t("actions.addNote")}
          </Button>
          <Button onClick={() => setFollowUpDialogOpen(true)}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {t("actions.scheduleFollowUp")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sections.basicInfo.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.basicInfo.status")}
                </p>
                <Badge variant={getStatusBadgeVariant(lead.leadStatus || "NEW")}>
                  {tLeads(`leadStatus.${lead.leadStatus || "NEW"}`)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.basicInfo.priority")}
                </p>
                <Badge
                  variant={getPriorityBadgeVariant(lead.leadPriority)}
                  className={
                    lead.leadPriority === "MEDIUM"
                      ? "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400"
                      : lead.leadPriority === "LOW"
                      ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                      : ""
                  }
                >
                  {lead.leadPriority
                    ? tLeads(`leadPriority.${lead.leadPriority}`)
                    : "N/A"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.basicInfo.company")}
                </p>
                <p className="font-medium">{lead.companyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.basicInfo.phone")}
                </p>
                <p className="font-medium">{lead.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.basicInfo.website")}
                </p>
                <p className="font-medium">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {lead.website}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              {lead.leadSource && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.basicInfo.source")}
                  </p>
                  <p className="font-medium">
                    {tLeads(`source.${lead.leadSource}`)}
                  </p>
                </div>
              )}
              {lead.department && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.basicInfo.department")}
                  </p>
                  <p className="font-medium">
                    {tLeads(`department.${lead.department}`)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.basicInfo.leadScore")}
                </p>
                <p className="font-medium">{lead.leadScore || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.basicInfo.createdAt")}
                </p>
                <p className="font-medium">{formatDateShort(lead.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sections.assignment.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("sections.assignment.responsible")}
              </p>
              <p className="font-medium">
                {lead.leadResponsible ? (
                  <>
                    {lead.leadResponsible.name}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({lead.leadResponsible.email})
                    </span>
                  </>
                ) : (
                  t("sections.assignment.unassigned")
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("sections.assignment.mainContact")}
              </p>
              <p className="font-medium">
                {lead.leadMainContact ? (
                  <>
                    {lead.leadMainContact.name}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({lead.leadMainContact.email})
                    </span>
                  </>
                ) : (
                  t("sections.assignment.unassigned")
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sections.financial.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("sections.financial.ticketSize")}
              </p>
              <p className="font-medium">
                {lead.minTicketSize && lead.maxTicketSize
                  ? `${formatCurrency(lead.minTicketSize)} - ${formatCurrency(lead.maxTicketSize)}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("sections.financial.targetReturn")}
              </p>
              <p className="font-medium">
                {lead.targetReturnIRR
                  ? `${lead.targetReturnIRR.toFixed(2)}%`
                  : "N/A"}
              </p>
            </div>
            {(lead.commissionRate || lead.commissionNotes) && (
              <>
                <Separator />
                {lead.commissionRate && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.financial.commissionRate")}
                    </p>
                    <p className="font-medium">
                      {lead.commissionRate.toFixed(2)}%
                    </p>
                  </div>
                )}
                {lead.commissionNotes && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.financial.commissionNotes")}
                    </p>
                    <p className="font-medium">{lead.commissionNotes}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sections.timeline.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("sections.timeline.lastContact")}
              </p>
              <p className="font-medium">
                {formatDateShort(lead.lastContactDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("sections.timeline.nextFollowUp")}
              </p>
              <p className="font-medium">
                {lead.nextFollowUpDate ? (
                  <span className="text-primary">
                    {formatDate(lead.nextFollowUpDate)}
                  </span>
                ) : (
                  t("sections.timeline.noDate")
                )}
              </p>
            </div>
            {lead.convertedAt && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.timeline.converted")}
                </p>
                <p className="font-medium">
                  {formatDateShort(lead.convertedAt)}
                </p>
              </div>
            )}
            {lead.lostAt && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.timeline.lost")}
                  </p>
                  <p className="font-medium">{formatDateShort(lead.lostAt)}</p>
                </div>
                {lead.lostReason && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.timeline.lostReason")}
                    </p>
                    <p className="font-medium">{lead.lostReason}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Investment Strategy */}
        {(lead.type ||
          lead.strategy1 ||
          lead.strategy2 ||
          lead.strategy3 ||
          lead.location1 ||
          lead.location2 ||
          lead.location3) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t("sections.strategy.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.type && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.strategy.type")}
                  </p>
                  <p className="font-medium">{lead.type}</p>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-3">
                {lead.strategy1 && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.strategy.strategy")} 1
                    </p>
                    <p className="font-medium">{lead.strategy1}</p>
                    {lead.segment1 && (
                      <p className="text-sm text-muted-foreground">
                        {lead.segment1}
                      </p>
                    )}
                  </div>
                )}
                {lead.strategy2 && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.strategy.strategy")} 2
                    </p>
                    <p className="font-medium">{lead.strategy2}</p>
                    {lead.segment2 && (
                      <p className="text-sm text-muted-foreground">
                        {lead.segment2}
                      </p>
                    )}
                  </div>
                )}
                {lead.strategy3 && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.strategy.strategy")} 3
                    </p>
                    <p className="font-medium">{lead.strategy3}</p>
                    {lead.segment3 && (
                      <p className="text-sm text-muted-foreground">
                        {lead.segment3}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {(lead.location1 || lead.location2 || lead.location3) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.strategy.locations")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lead.location1 && (
                      <Badge variant="outline">{lead.location1}</Badge>
                    )}
                    {lead.location2 && (
                      <Badge variant="outline">{lead.location2}</Badge>
                    )}
                    {lead.location3 && (
                      <Badge variant="outline">{lead.location3}</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("sections.contact.title")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {lead.representativeName && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.contact.representative")}
                </p>
                <p className="font-medium">{lead.representativeName}</p>
              </div>
            )}
            {lead.physicalAddress && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.contact.physicalAddress")}
                </p>
                <p className="font-medium">{lead.physicalAddress}</p>
              </div>
            )}
            {lead.acceptMarketingList !== null && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("sections.contact.acceptMarketing")}
                </p>
                <p className="font-medium">
                  {lead.acceptMarketingList
                    ? t("sections.contact.yes")
                    : t("sections.contact.no")}
                </p>
              </div>
            )}
            {lead.otherFacts && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">
                  {t("sections.contact.otherFacts")}
                </p>
                <p className="font-medium">{lead.otherFacts}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("sections.notes.title")}</CardTitle>
            <CardDescription>
              {lead.notes.length}{" "}
              {lead.notes.length === 1 ? "note" : "notes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lead.notes.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {t("sections.notes.noNotes")}
              </p>
            ) : (
              <div className="space-y-4">
                {lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border bg-muted/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {t("sections.notes.by")}{" "}
                        <span className="font-medium">
                          {note.createdByUser?.name || "Unknown"}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <p className="whitespace-pre-wrap">{note.note}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activities */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("sections.activities.title")}</CardTitle>
            <CardDescription>
              {lead.activities.length}{" "}
              {lead.activities.length === 1 ? "activity" : "activities"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lead.activities.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {t("sections.activities.noActivities")}
              </p>
            ) : (
              <div className="space-y-4">
                {lead.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {t(
                            `sections.activities.types.${activity.activityType}`
                          )}
                        </Badge>
                        <p className="font-medium">{activity.title}</p>
                      </div>
                      {activity.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AssignLeadDialog
        leadId={leadId}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
      <AddNoteDialog
        leadId={leadId}
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
      />
      <ScheduleFollowUpDialog
        leadId={leadId}
        open={followUpDialogOpen}
        onOpenChange={setFollowUpDialogOpen}
      />
    </div>
  );
};

export default Page;
