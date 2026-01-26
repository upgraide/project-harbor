"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Heart, 
  XCircle, 
  Building2, 
  Home,
  FileSignature
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";

type InvestorTimelineProps = {
  investorId: string;
};

export const InvestorTimeline = ({ investorId }: InvestorTimelineProps) => {
  const trpc = useTRPC();

  const { data: interests } = useSuspenseQuery(
    trpc.investors.getInterests.queryOptions({ userId: investorId })
  );

  // Sort by most recent first
  const sortedInterests = [...interests].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const interestedCount = interests.filter((i) => i.interested).length;
  const notInterestedCount = interests.filter((i) => !i.interested).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Interest Timeline</CardTitle>
        <CardDescription>
          Historical record of opportunity interests and interactions ({interests.length} total)
        </CardDescription>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="font-semibold">{interestedCount}</span> Interested
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="font-semibold">{notInterestedCount}</span> Not Interested
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {interests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No investment interests recorded</p>
        ) : (
          <div className="space-y-3">
            {sortedInterests.map((interest) => {
              const Icon = interest.opportunityType === "mna" ? Building2 : Home;
              return (
                <div
                  key={interest.id}
                  className="flex gap-4 border-l-2 border-muted pl-4 pb-4 last:pb-0 relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-2.5 top-1 h-5 w-5 rounded-full flex items-center justify-center border-2 border-muted bg-background">
                    {interest.interested ? (
                      <Heart className="h-2.5 w-2.5 text-green-500 fill-green-500" />
                    ) : (
                      <XCircle className="h-2.5 w-2.5 text-red-500" />
                    )}
                  </div>

                  {/* Content */}
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

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Date:</span> {format(new Date(interest.updatedAt), "PPp")}
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
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
