"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Heart, 
  XCircle, 
  Building2, 
  Home,
  FileSignature,
  Calendar,
  StickyNote,
  Activity
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";

type InvestorTimelineProps = {
  investorId: string;
};

type TimelineItem = {
  id: string;
  type: "interest" | "followUp" | "note" | "activity";
  date: Date;
  data: any;
};

export const InvestorTimeline = ({ investorId }: InvestorTimelineProps) => {
  const trpc = useTRPC();

  const { data: interests, isLoading: interestsLoading } = useQuery(
    trpc.investors.getInterests.queryOptions({ userId: investorId })
  );

  const { data: followUps, isLoading: followUpsLoading } = useQuery(
    trpc.investors.getFollowUps.queryOptions({ userId: investorId })
  );

  const { data: notes, isLoading: notesLoading } = useQuery(
    trpc.investors.getNotes.queryOptions({ userId: investorId })
  );

  const { data: activities, isLoading: activitiesLoading } = useQuery(
    trpc.investors.getActivities.queryOptions({ userId: investorId })
  );

  const isLoading = interestsLoading || followUpsLoading || notesLoading || activitiesLoading;

  if (isLoading || !interests || !followUps || !notes || !activities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complete Timeline</CardTitle>
          <CardDescription>
            Loading timeline...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Combine all timeline items
  const timelineItems: TimelineItem[] = [
    ...interests.map((i) => ({
      id: i.id,
      type: "interest" as const,
      date: new Date(i.updatedAt),
      data: i,
    })),
    ...followUps.map((f) => ({
      id: f.id,
      type: "followUp" as const,
      date: new Date(f.followUpDate),
      data: f,
    })),
    ...notes.map((n) => ({
      id: n.id,
      type: "note" as const,
      date: new Date(n.createdAt),
      data: n,
    })),
    ...activities.map((a) => ({
      id: a.id,
      type: "activity" as const,
      date: new Date(a.createdAt),
      data: a,
    })),
  ];

  // Sort by most recent first
  const sortedItems = timelineItems.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const interestedCount = interests.filter((i) => i.interested).length;
  const notInterestedCount = interests.filter((i) => !i.interested).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Timeline</CardTitle>
        <CardDescription>
          All interactions, interests, notes and activities ({timelineItems.length} total)
        </CardDescription>
        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="font-semibold">{interests.length}</span> Interests
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="font-semibold">{followUps.length}</span> Follow-ups
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="font-semibold">{notes.length}</span> Notes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="font-semibold">{activities.length}</span> Activities
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {timelineItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No timeline items recorded</p>
        ) : (
          <div className="space-y-3">
            {sortedItems.map((item) => {
              if (item.type === "interest") {
                const interest = item.data;
                const Icon = interest.opportunityType === "mna" ? Building2 : Home;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-l-2 border-muted pl-4 pb-4 last:pb-0 relative"
                  >
                    <div className="absolute -left-2.5 top-1 h-5 w-5 rounded-full flex items-center justify-center border-2 border-muted bg-background">
                      {interest.interested ? (
                        <Heart className="h-2.5 w-2.5 text-green-500" />
                      ) : (
                        <XCircle className="h-2.5 w-2.5 text-red-500" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">{interest.opportunityName}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {interest.opportunityType === "mna" ? "Merger & Acquisition" : "Real Estate"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {interest.interested ? (
                            <Badge className="bg-green-500 text-white">
                              Interested
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              Not Interested
                            </Badge>
                          )}
                          {interest.ndaSigned && (
                            <Badge variant="outline">
                              <FileSignature className="h-3 w-3 mr-1" />
                              NDA
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Date:</span> {format(item.date, "PPp")}
                        </div>
                        {interest.notInterestedReason && (
                          <div className="col-span-2">
                            <span className="font-medium">Reason:</span> {interest.notInterestedReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.type === "followUp") {
                const followUp = item.data;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-l-2 border-muted pl-4 pb-4 last:pb-0 relative"
                  >
                    <div className="absolute -left-2.5 top-1 h-5 w-5 rounded-full flex items-center justify-center border-2 border-muted bg-background">
                      <Calendar className="h-2.5 w-2.5 text-blue-500" />
                    </div>

                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">Follow-up</h4>
                            <Badge variant="outline">{format(item.date, "PPP")}</Badge>
                          </div>
                          <p className="text-sm whitespace-pre-wrap mt-2">{followUp.description}</p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Contacted by:</span> {followUp.contactedBy.name} • 
                        <span className="font-medium"> Person contacted:</span> {followUp.personContacted.name}
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.type === "note") {
                const note = item.data;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-l-2 border-muted pl-4 pb-4 last:pb-0 relative"
                  >
                    <div className="absolute -left-2.5 top-1 h-5 w-5 rounded-full flex items-center justify-center border-2 border-muted bg-background">
                      <StickyNote className="h-2.5 w-2.5 text-yellow-500" />
                    </div>

                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">Note</h4>
                          </div>
                          <p className="text-sm whitespace-pre-wrap mt-2">{note.note}</p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">By:</span> {note.createdByUser.name} • 
                        <span> {format(item.date, "PPp")}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.type === "activity") {
                const activity = item.data;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-l-2 border-muted pl-4 pb-4 last:pb-0 relative"
                  >
                    <div className="absolute -left-2.5 top-1 h-5 w-5 rounded-full flex items-center justify-center border-2 border-muted bg-background">
                      <Activity className="h-2.5 w-2.5 text-purple-500" />
                    </div>

                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{activity.activityType}</Badge>
                            <h4 className="font-medium">{activity.title}</h4>
                          </div>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {format(item.date, "PPp")}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

