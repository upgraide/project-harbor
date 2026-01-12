"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  FileText,
  TrendingUp,
  Users,
  Star
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTRPC } from "@/trpc/client";
import { useScopedI18n } from "@/locales/client";
import { backofficeInvestorsPath } from "@/paths";
import {
  departmentLabels,
  investorClientTypeLabels,
  investorSegmentLabels,
  investorStrategyLabels,
  teamMemberLabels,
  leadStatusLabels,
  leadPriorityLabels,
  leadSourceLabels,
} from "../utils/enum-mappings";
import { InvestorDetailEditForm } from "./investor-detail-edit-form";
import { InvestorInterests } from "./investor-interests";
import { InvestorNotes } from "./investor-notes";
import { InvestorActivities } from "./investor-activities";
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

  const formatTicketSize = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    return `€${value}k`;
  };

  const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "-";
    return `${value}%`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={backofficeInvestorsPath()}>← Back to Investors</Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold">
            {investor.companyName || investor.name}
          </h1>
          {investor.companyName && (
            <p className="text-sm text-muted-foreground">{investor.name}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {investor.leadStatus && (
            <Badge variant={
              investor.leadStatus === "CONVERTED" ? "default" :
              investor.leadStatus === "LOST" ? "destructive" :
              "secondary"
            }>
              {leadStatusLabels[investor.leadStatus] || investor.leadStatus}
            </Badge>
          )}
          {investor.leadPriority && (
            <Badge variant={
              investor.leadPriority === "URGENT" ? "destructive" :
              investor.leadPriority === "HIGH" ? "default" :
              "outline"
            }>
              {leadPriorityLabels[investor.leadPriority] || investor.leadPriority}
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
                      <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Company</p>
                        <p className="text-sm text-muted-foreground">{investor.companyName}</p>
                      </div>
                    </div>
                  )}
                  {investor.representativeName && (
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Representative</p>
                        <p className="text-sm text-muted-foreground">{investor.representativeName}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href={`mailto:${investor.email}`} className="text-sm text-blue-600 hover:underline">
                        {investor.email}
                      </a>
                    </div>
                  </div>
                  {investor.phoneNumber && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{investor.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                  {investor.physicalAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{investor.physicalAddress}</p>
                      </div>
                    </div>
                  )}
                  {investor.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a href={investor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {investor.website}
                        </a>
                      </div>
                    </div>
                  )}
                  {investor.lastContactDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Contact</p>
                        <p className="text-sm text-muted-foreground">
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
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground">
                        {investorClientTypeLabels[investor.type] || investor.type}
                      </p>
                    </div>
                  )}
                  {investor.investorType && (
                    <div>
                      <p className="text-sm font-medium">Investor Size</p>
                      <p className="text-sm text-muted-foreground">
                        {investor.investorType === "LESS_THAN_10M" && "<€10M"}
                        {investor.investorType === "BETWEEN_10M_100M" && "€10M-€100M"}
                        {investor.investorType === "GREATER_THAN_100M" && ">€100M"}
                      </p>
                    </div>
                  )}
                  {investor.department && (
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">
                        {departmentLabels[investor.department] || investor.department}
                      </p>
                    </div>
                  )}
                  {(investor.minTicketSize || investor.maxTicketSize) && (
                    <div>
                      <p className="text-sm font-medium">Ticket Size</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTicketSize(investor.minTicketSize)} - {formatTicketSize(investor.maxTicketSize)}
                      </p>
                    </div>
                  )}
                  {investor.targetReturnIRR && (
                    <div>
                      <p className="text-sm font-medium">Target IRR</p>
                      <p className="text-sm text-muted-foreground">
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
                      <p className="text-sm font-medium">Primary Strategy</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {investor.strategy1 && (
                          <Badge variant="outline">
                            {investorStrategyLabels[investor.strategy1] || investor.strategy1}
                          </Badge>
                        )}
                        {investor.segment1 && (
                          <Badge variant="secondary">
                            {investorSegmentLabels[investor.segment1] || investor.segment1}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {(investor.strategy2 || investor.segment2) && (
                    <div>
                      <p className="text-sm font-medium">Secondary Strategy</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {investor.strategy2 && (
                          <Badge variant="outline">
                            {investorStrategyLabels[investor.strategy2] || investor.strategy2}
                          </Badge>
                        )}
                        {investor.segment2 && (
                          <Badge variant="secondary">
                            {investorSegmentLabels[investor.segment2] || investor.segment2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {(investor.strategy3 || investor.segment3) && (
                    <div>
                      <p className="text-sm font-medium">Tertiary Strategy</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {investor.strategy3 && (
                          <Badge variant="outline">
                            {investorStrategyLabels[investor.strategy3] || investor.strategy3}
                          </Badge>
                        )}
                        {investor.segment3 && (
                          <Badge variant="secondary">
                            {investorSegmentLabels[investor.segment3] || investor.segment3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {(investor.location1 || investor.location2 || investor.location3 || investor.preferredLocation) && (
                    <div>
                      <p className="text-sm font-medium">Preferred Locations</p>
                      <div className="flex flex-wrap gap-1 mt-1">
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
              {(investor.leadSource || investor.leadResponsible || investor.leadMainContact) && (
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
                        <p className="text-sm font-medium">Source</p>
                        <p className="text-sm text-muted-foreground">
                          {leadSourceLabels[investor.leadSource] || investor.leadSource}
                        </p>
                      </div>
                    )}
                    {investor.leadScore !== null && investor.leadScore !== undefined && (
                      <div>
                        <p className="text-sm font-medium">Lead Score</p>
                        <p className="text-sm text-muted-foreground">{investor.leadScore}</p>
                      </div>
                    )}
                    {investor.nextFollowUpDate && (
                      <div>
                        <p className="text-sm font-medium">Next Follow-up</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(investor.nextFollowUpDate), "PPP")}
                        </p>
                      </div>
                    )}
                    {investor.leadResponsible && (
                      <div>
                        <p className="text-sm font-medium">Lead Responsible</p>
                        <p className="text-sm text-muted-foreground">{investor.leadResponsible.name}</p>
                      </div>
                    )}
                    {investor.leadResponsibleTeam && (
                      <div>
                        <p className="text-sm font-medium">Responsible Team</p>
                        <p className="text-sm text-muted-foreground">
                          {teamMemberLabels[investor.leadResponsibleTeam] || investor.leadResponsibleTeam}
                        </p>
                      </div>
                    )}
                    {investor.leadMainContact && (
                      <div>
                        <p className="text-sm font-medium">Main Contact</p>
                        <p className="text-sm text-muted-foreground">{investor.leadMainContact.name}</p>
                      </div>
                    )}
                    {investor.leadMainContactTeam && (
                      <div>
                        <p className="text-sm font-medium">Contact Team</p>
                        <p className="text-sm text-muted-foreground">
                          {teamMemberLabels[investor.leadMainContactTeam] || investor.leadMainContactTeam}
                        </p>
                      </div>
                    )}
                    {investor.tags && investor.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {investor.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Additional Notes */}
              {(investor.otherFacts || investor.lastNotes) && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {investor.otherFacts && (
                      <div>
                        <p className="text-sm font-medium">Other Facts</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{investor.otherFacts}</p>
                      </div>
                    )}
                    {investor.lastNotes && (
                      <div>
                        <p className="text-sm font-medium">Last Notes</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{investor.lastNotes}</p>
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
            <InvestorDetailEditForm investor={investor} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
