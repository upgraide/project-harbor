"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Building2, Home, CheckCircle2, XCircle, FileSignature } from "lucide-react";
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
import { useTRPC } from "@/trpc/client";
import { backofficeMergeAndAcquisitionOpportunityPath, backofficeRealEstateOpportunityPath } from "@/paths";

type InvestorInterestsProps = {
  investorId: string;
};

export const InvestorInterests = ({ investorId }: InvestorInterestsProps) => {
  const trpc = useTRPC();

  const { data: interests } = useSuspenseQuery(
    trpc.investors.getInterests.queryOptions({ userId: investorId })
  );

  const mnaInterests = interests.filter((i) => i.opportunityType === "mna");
  const reInterests = interests.filter((i) => i.opportunityType === "realEstate");

  return (
    <div className="space-y-6">
      {/* M&A Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            M&A Opportunities ({mnaInterests.length})
          </CardTitle>
          <CardDescription>
            All merger and acquisition opportunities this investor has interacted with
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mnaInterests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No M&A interests recorded</p>
          ) : (
            <div className="space-y-3">
              {mnaInterests.map((interest) => (
                <div
                  key={interest.id}
                  className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={backofficeMergeAndAcquisitionOpportunityPath(interest.opportunityId)}
                        className="font-medium hover:underline"
                      >
                        {interest.opportunityName}
                      </Link>
                      {interest.interested ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Interested
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Interested
                        </Badge>
                      )}
                      {interest.ndaSigned && (
                        <Badge variant="outline">
                          <FileSignature className="h-3 w-3 mr-1" />
                          NDA Signed
                        </Badge>
                      )}
                    </div>
                    {interest.notInterestedReason && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Reason: {interest.notInterestedReason}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {format(new Date(interest.updatedAt), "PPp")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real Estate Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Real Estate Opportunities ({reInterests.length})
          </CardTitle>
          <CardDescription>
            All real estate opportunities this investor has interacted with
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reInterests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No real estate interests recorded</p>
          ) : (
            <div className="space-y-3">
              {reInterests.map((interest) => (
                <div
                  key={interest.id}
                  className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={backofficeRealEstateOpportunityPath(interest.opportunityId)}
                        className="font-medium hover:underline"
                      >
                        {interest.opportunityName}
                      </Link>
                      {interest.interested ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Interested
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Interested
                        </Badge>
                      )}
                      {interest.ndaSigned && (
                        <Badge variant="outline">
                          <FileSignature className="h-3 w-3 mr-1" />
                          NDA Signed
                        </Badge>
                      )}
                    </div>
                    {interest.notInterestedReason && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Reason: {interest.notInterestedReason}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {format(new Date(interest.updatedAt), "PPp")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
