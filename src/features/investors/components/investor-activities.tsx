"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Building2, Home, FileSignature } from "lucide-react";
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

type InvestorActivitiesProps = {
  investorId: string;
};

export const InvestorActivities = ({ investorId }: InvestorActivitiesProps) => {
  const trpc = useTRPC();

  const { data: interests, isLoading } = useQuery(
    trpc.investors.getInterests.queryOptions({ userId: investorId })
  );

  if (isLoading || !interests) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const interestedOpportunities = interests.filter((i) => i.interested);
  const notInterestedOpportunities = interests.filter((i) => !i.interested);

  return (
    <div className="space-y-6">
      {/* Interested Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Interested Opportunities ({interestedOpportunities.length})</CardTitle>
          <CardDescription>
            Opportunities this client has shown interest in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {interestedOpportunities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interested opportunities</p>
          ) : (
            <div className="space-y-3">
              {interestedOpportunities.map((interest) => {
                const Icon = interest.opportunityType === "mna" ? Building2 : Home;
                return (
                  <div
                    key={interest.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">{interest.opportunityName}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {interest.opportunityType === "mna" ? "Merger & Acquisition" : "Real Estate"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500 text-white">
                          Interested
                        </Badge>
                        {interest.ndaSigned && (
                          <Badge variant="outline">
                            <FileSignature className="h-3 w-3 mr-1" />
                            NDA Signed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {format(new Date(interest.updatedAt), "PPp")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Not Interested Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Not Interested Opportunities ({notInterestedOpportunities.length})</CardTitle>
          <CardDescription>
            Opportunities this client has declined
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notInterestedOpportunities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No declined opportunities</p>
          ) : (
            <div className="space-y-3">
              {notInterestedOpportunities.map((interest) => {
                const Icon = interest.opportunityType === "mna" ? Building2 : Home;
                return (
                  <div
                    key={interest.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">{interest.opportunityName}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {interest.opportunityType === "mna" ? "Merger & Acquisition" : "Real Estate"}
                        </p>
                        {interest.notInterestedReason && (
                          <p className="text-sm mt-2">
                            <span className="font-medium">Reason: </span>
                            {interest.notInterestedReason}
                          </p>
                        )}
                      </div>
                      <Badge variant="destructive">
                        Not Interested
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {format(new Date(interest.updatedAt), "PPp")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
