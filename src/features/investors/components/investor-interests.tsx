"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Building2,
  CheckCircle2,
  FileSignature,
  Home,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  backofficeMergeAndAcquisitionOpportunityPath,
  backofficeRealEstateOpportunityPath,
} from "@/paths";
import { useTRPC } from "@/trpc/client";

type InvestorInterestsProps = {
  investorId: string;
};

export const InvestorInterests = ({ investorId }: InvestorInterestsProps) => {
  const trpc = useTRPC();

  const { data: interests } = useSuspenseQuery(
    trpc.investors.getInterests.queryOptions({ userId: investorId })
  );

  const mnaInterests = interests.filter((i) => i.opportunityType === "mna");
  const reInterests = interests.filter(
    (i) => i.opportunityType === "realEstate"
  );

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
            All merger and acquisition opportunities this investor has
            interacted with
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mnaInterests.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No M&A interests recorded
            </p>
          ) : (
            <div className="space-y-3">
              {mnaInterests.map((interest) => (
                <div
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  key={interest.id}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        className="font-medium hover:underline"
                        href={backofficeMergeAndAcquisitionOpportunityPath(
                          interest.opportunityId
                        )}
                      >
                        {interest.opportunityName}
                      </Link>
                      {interest.interested ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Interested
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Interested
                        </Badge>
                      )}
                      {interest.ndaSigned && (
                        <Badge variant="outline">
                          <FileSignature className="mr-1 h-3 w-3" />
                          NDA Signed
                        </Badge>
                      )}
                    </div>
                    {interest.notInterestedReason && (
                      <p className="mt-1 text-muted-foreground text-sm">
                        Reason: {interest.notInterestedReason}
                      </p>
                    )}
                    <p className="mt-1 text-muted-foreground text-xs">
                      Last updated:{" "}
                      {format(new Date(interest.updatedAt), "PPp")}
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
            <p className="text-muted-foreground text-sm">
              No real estate interests recorded
            </p>
          ) : (
            <div className="space-y-3">
              {reInterests.map((interest) => (
                <div
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  key={interest.id}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        className="font-medium hover:underline"
                        href={backofficeRealEstateOpportunityPath(
                          interest.opportunityId
                        )}
                      >
                        {interest.opportunityName}
                      </Link>
                      {interest.interested ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Interested
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Interested
                        </Badge>
                      )}
                      {interest.ndaSigned && (
                        <Badge variant="outline">
                          <FileSignature className="mr-1 h-3 w-3" />
                          NDA Signed
                        </Badge>
                      )}
                    </div>
                    {interest.notInterestedReason && (
                      <p className="mt-1 text-muted-foreground text-sm">
                        Reason: {interest.notInterestedReason}
                      </p>
                    )}
                    <p className="mt-1 text-muted-foreground text-xs">
                      Last updated:{" "}
                      {format(new Date(interest.updatedAt), "PPp")}
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
