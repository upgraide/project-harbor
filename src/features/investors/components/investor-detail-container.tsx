"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUserRole } from "@/features/users/hooks/use-current-user-role";
import { Role } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { backofficeInvestorsPath } from "@/paths";
import { useTRPC } from "@/trpc/client";
import {
  departmentLabels,
  investorClientTypeLabels,
  investorSegmentLabels,
  investorStrategyLabels,
  leadPriorityLabels,
  leadSourceLabels,
  leadStatusLabels,
  teamMemberLabels,
} from "../utils/enum-mappings";
import { InvestorActivities } from "./investor-activities";
import { InvestorDetailEditForm } from "./investor-detail-edit-form";
import { InvestorInterests } from "./investor-interests";
import { InvestorLastFollowUps } from "./investor-last-followups";
import { InvestorNotes } from "./investor-notes";
import { InvestorTimeline } from "./investor-timeline";

type InvestorDetailContainerProps = {
  investorId: string;
};

export const InvestorDetailContainer = ({
  investorId,
}: InvestorDetailContainerProps) => {
  const trpc = useTRPC();
  const t = useScopedI18n("backoffice.investors.detail");

  const { data: investor } = useSuspenseQuery(
    trpc.investors.getOne.queryOptions({ id: investorId })
  );

  const { data: currentUserRole } = useCurrentUserRole();
  const isTeamOrAdmin =
    currentUserRole === Role.TEAM || currentUserRole === Role.ADMIN;

  const formatTicketSize = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    return `€${value}k`;
  };

  const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    return `${value}%`;
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Button asChild className="-ml-2 mb-2" size="sm" variant="ghost">
            <Link href={backofficeInvestorsPath()}>← Back to Investors</Link>
          </Button>
          <h1 className="font-bold text-3xl tracking-tight">
            {investor.companyName || investor.name}
          </h1>
          {investor.companyName && (
            <p className="mt-1 text-muted-foreground">{investor.name}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {investor.leadStatus && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Status:</span>
              <Badge
                variant={
                  investor.leadStatus === "CONVERTED"
                    ? "default"
                    : investor.leadStatus === "LOST"
                      ? "destructive"
                      : "secondary"
                }
              >
                {leadStatusLabels[investor.leadStatus] || investor.leadStatus}
              </Badge>
            </div>
          )}
          {investor.leadPriority && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Priority:</span>
              <Badge
                variant={
                  investor.leadPriority === "URGENT"
                    ? "destructive"
                    : investor.leadPriority === "HIGH"
                      ? "default"
                      : "outline"
                }
              >
                {leadPriorityLabels[investor.leadPriority] ||
                  investor.leadPriority}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div>
        <Tabs className="space-y-6" defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent className="space-y-6" value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {investor.companyName && (
                    <div className="flex items-start gap-2">
                      <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Company</p>
                        <p className="text-muted-foreground text-sm">
                          {investor.companyName}
                        </p>
                      </div>
                    </div>
                  )}
                  {investor.representativeName && (
                    <div className="flex items-start gap-2">
                      <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Representative</p>
                        <p className="text-muted-foreground text-sm">
                          {investor.representativeName}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <a
                        className="text-blue-600 text-sm hover:underline"
                        href={`mailto:${investor.email}`}
                      >
                        {investor.email}
                      </a>
                    </div>
                  </div>
                  {investor.phoneNumber && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Phone</p>
                        <p className="text-muted-foreground text-sm">
                          {investor.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  {investor.physicalAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Address</p>
                        <p className="text-muted-foreground text-sm">
                          {investor.physicalAddress}
                        </p>
                      </div>
                    </div>
                  )}
                  {investor.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Website</p>
                        <a
                          className="text-blue-600 text-sm hover:underline"
                          href={investor.website}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {investor.website}
                        </a>
                      </div>
                    </div>
                  )}
                  {investor.lastContactDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Last Contact</p>
                        <p className="text-muted-foreground text-sm">
                          {format(new Date(investor.lastContactDate), "PPP")}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Investment Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Investment Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {investor.type && (
                    <div>
                      <p className="font-medium text-sm">Type</p>
                      <p className="text-muted-foreground text-sm">
                        {investorClientTypeLabels[investor.type] ||
                          investor.type}
                      </p>
                    </div>
                  )}
                  {investor.investorType && (
                    <div>
                      <p className="font-medium text-sm">Investor Size</p>
                      <p className="text-muted-foreground text-sm">
                        {investor.investorType === "LESS_THAN_10M" && "<€10M"}
                        {investor.investorType === "BETWEEN_10M_100M" &&
                          "€10M-€100M"}
                        {investor.investorType === "GREATER_THAN_100M" &&
                          ">€100M"}
                      </p>
                    </div>
                  )}
                  {investor.department && (
                    <div>
                      <p className="font-medium text-sm">Department</p>
                      <p className="text-muted-foreground text-sm">
                        {departmentLabels[investor.department] ||
                          investor.department}
                      </p>
                    </div>
                  )}
                  {(investor.minTicketSize || investor.maxTicketSize) && (
                    <div>
                      <p className="font-medium text-sm">Ticket Size</p>
                      <p className="text-muted-foreground text-sm">
                        {formatTicketSize(investor.minTicketSize)} -{" "}
                        {formatTicketSize(investor.maxTicketSize)}
                      </p>
                    </div>
                  )}
                  {investor.targetReturnIRR && (
                    <div>
                      <p className="font-medium text-sm">Target IRR</p>
                      <p className="text-muted-foreground text-sm">
                        {formatPercentage(investor.targetReturnIRR)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Investment Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Investment Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(investor.strategy1 || investor.segment1) && (
                    <div>
                      <p className="font-medium text-sm">Primary Strategy</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {investor.strategy1 && (
                          <Badge variant="outline">
                            {investorStrategyLabels[investor.strategy1] ||
                              investor.strategy1}
                          </Badge>
                        )}
                        {investor.segment1 && (
                          <Badge variant="secondary">
                            {investorSegmentLabels[investor.segment1] ||
                              investor.segment1}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {(investor.strategy2 || investor.segment2) && (
                    <div>
                      <p className="font-medium text-sm">Secondary Strategy</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {investor.strategy2 && (
                          <Badge variant="outline">
                            {investorStrategyLabels[investor.strategy2] ||
                              investor.strategy2}
                          </Badge>
                        )}
                        {investor.segment2 && (
                          <Badge variant="secondary">
                            {investorSegmentLabels[investor.segment2] ||
                              investor.segment2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {(investor.strategy3 || investor.segment3) && (
                    <div>
                      <p className="font-medium text-sm">Tertiary Strategy</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {investor.strategy3 && (
                          <Badge variant="outline">
                            {investorStrategyLabels[investor.strategy3] ||
                              investor.strategy3}
                          </Badge>
                        )}
                        {investor.segment3 && (
                          <Badge variant="secondary">
                            {investorSegmentLabels[investor.segment3] ||
                              investor.segment3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {(investor.location1 ||
                    investor.location2 ||
                    investor.location3 ||
                    investor.preferredLocation) && (
                    <div>
                      <p className="font-medium text-sm">Preferred Locations</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {investor.preferredLocation && (
                          <Badge>{investor.preferredLocation}</Badge>
                        )}
                        {investor.location1 && (
                          <Badge variant="outline">{investor.location1}</Badge>
                        )}
                        {investor.location2 && (
                          <Badge variant="outline">{investor.location2}</Badge>
                        )}
                        {investor.location3 && (
                          <Badge variant="outline">{investor.location3}</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lead Information */}
              {(investor.leadSource ||
                investor.leadResponsible ||
                investor.leadMainContact) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Lead Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {investor.leadSource && (
                      <div>
                        <p className="font-medium text-sm">Source</p>
                        <p className="text-muted-foreground text-sm">
                          {leadSourceLabels[investor.leadSource] ||
                            investor.leadSource}
                        </p>
                      </div>
                    )}
                    {investor.leadScore !== null &&
                      investor.leadScore !== undefined && (
                        <div>
                          <p className="font-medium text-sm">Lead Score</p>
                          <p className="text-muted-foreground text-sm">
                            {investor.leadScore}
                          </p>
                        </div>
                      )}
                    {investor.nextFollowUpDate && (
                      <div>
                        <p className="font-medium text-sm">Next Follow-up</p>
                        <p className="text-muted-foreground text-sm">
                          {format(new Date(investor.nextFollowUpDate), "PPP")}
                        </p>
                      </div>
                    )}
                    {investor.leadResponsible && (
                      <div>
                        <p className="font-medium text-sm">Lead Responsible</p>
                        <p className="text-muted-foreground text-sm">
                          {investor.leadResponsible.name}
                        </p>
                      </div>
                    )}
                    {investor.leadResponsibleTeam && (
                      <div>
                        <p className="font-medium text-sm">Responsible Team</p>
                        <p className="text-muted-foreground text-sm">
                          {teamMemberLabels[investor.leadResponsibleTeam] ||
                            investor.leadResponsibleTeam}
                        </p>
                      </div>
                    )}
                    {investor.leadMainContact && (
                      <div>
                        <p className="font-medium text-sm">Main Contact</p>
                        <p className="text-muted-foreground text-sm">
                          {investor.leadMainContact.name}
                        </p>
                      </div>
                    )}
                    {investor.leadMainContactTeam && (
                      <div>
                        <p className="font-medium text-sm">Contact Team</p>
                        <p className="text-muted-foreground text-sm">
                          {teamMemberLabels[investor.leadMainContactTeam] ||
                            investor.leadMainContactTeam}
                        </p>
                      </div>
                    )}
                    {investor.tags && investor.tags.length > 0 && (
                      <div>
                        <p className="mb-1 font-medium text-sm">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {investor.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Additional Notes */}
              {(investor.otherFacts ||
                investor.lastNotes ||
                (isTeamOrAdmin && investor.personalNotes)) && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isTeamOrAdmin && investor.personalNotes && (
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {t("personalNotes.title")}
                          </p>
                        </div>
                        <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                          {investor.personalNotes}
                        </p>
                      </div>
                    )}
                    {investor.otherFacts && (
                      <div
                        className={
                          isTeamOrAdmin && investor.personalNotes
                            ? "border-t pt-3"
                            : ""
                        }
                      >
                        <p className="font-medium text-sm">Other Facts</p>
                        <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                          {investor.otherFacts}
                        </p>
                      </div>
                    )}
                    {investor.lastNotes && (
                      <div
                        className={
                          (isTeamOrAdmin && investor.personalNotes) ||
                          investor.otherFacts
                            ? "border-t pt-3"
                            : ""
                        }
                      >
                        <p className="font-medium text-sm">Last Notes</p>
                        <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                          {investor.lastNotes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Interests Tab */}
          <TabsContent value="interests">
            <InvestorInterests investorId={investorId} />
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <InvestorTimeline investorId={investorId} />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <InvestorNotes investorId={investorId} />
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <InvestorActivities investorId={investorId} />
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit">
            <div className="space-y-6">
              <InvestorDetailEditForm investor={investor} />
              <InvestorLastFollowUps investorId={investorId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
