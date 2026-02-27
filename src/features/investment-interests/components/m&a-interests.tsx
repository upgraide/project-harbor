"use client";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backofficeMergeAndAcquisitionPath } from "@/paths";
import { useGetAllMergerAndAcquisitionInterests } from "../hooks/use-interests";

type OpportunityInterestsProps = {
  opportunityId: string;
};

export const OpportunitiesLoading = () => (
  <main className="flex max-w-screen-xs flex-1 flex-col space-y-6 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
    <div className="animate-pulse space-y-4">
      <div className="h-10 w-48 rounded bg-muted" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="h-4 w-24 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </main>
);

export const OpportunitiesError = ({ message }: { message: string }) => (
  <main className="flex max-w-screen-xs flex-1 flex-col space-y-6 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{message}</p>
      </CardContent>
    </Card>
  </main>
);

export const OpportunityInterests = ({
  opportunityId,
}: OpportunityInterestsProps) => {
  const { data: interests } =
    useGetAllMergerAndAcquisitionInterests(opportunityId);

  const interestedUsers = interests.filter((i) => i.interested);
  const notInterestedUsers = interests.filter((i) => !i.interested);
  const ndaSignedUsers = interests.filter((i) => i.ndaSigned);

  return (
    <main className="flex max-w-screen-xs flex-1 flex-col space-y-6 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl md:text-4xl">User Interests</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            View all expressed interests and reasons for this opportunity
          </p>
        </div>
        <Link href={`${backofficeMergeAndAcquisitionPath()}/${opportunityId}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Opportunity
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-sm">Interested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{interestedUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-sm">
              Not Interested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {notInterestedUsers.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-sm">NDA Signed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{ndaSignedUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Interested Users */}
      {interestedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interested Users</CardTitle>
            <CardDescription>
              Users who expressed interest in this opportunity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>NDA Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interestedUsers.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell className="font-medium">
                      {interest.user.name}
                    </TableCell>
                    <TableCell>{interest.user.email}</TableCell>
                    <TableCell>
                      {interest.ndaSigned ? (
                        <Badge className="gap-1" variant="default">
                          <CheckCircle2 className="h-3 w-3" />
                          Signed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Signed</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(interest.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Not Interested Users */}
      {notInterestedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Not Interested Users</CardTitle>
            <CardDescription>
              Users who marked this opportunity as not interesting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notInterestedUsers.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell className="font-medium">
                      {interest.user.name}
                    </TableCell>
                    <TableCell>{interest.user.email}</TableCell>
                    <TableCell className="max-w-md">
                      {interest.notInterestedReason || (
                        <span className="text-muted-foreground italic">
                          No reason provided
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(interest.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {interests.length === 0 && (
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">
              No user interests recorded yet
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
};
