"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyView } from "@/components/entity-components";
import { useTRPC } from "@/trpc/client";
import { ExternalLinkIcon } from "lucide-react";
import { useScopedI18n } from "@/locales/client";
import Link from "next/link";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

export function ResolvedCommissionsList() {
  const router = useRouter();
  const trpc = useTRPC();
  const t = useScopedI18n("crm.commissions");

  const { data: schedules } = useSuspenseQuery(
    trpc.commissions.getAllResolvedCommissions.queryOptions()
  ) as { data: any[] };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("resolvedList.title")}</CardTitle>
        <CardDescription>
          {t("resolvedList.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <EmptyView
            title={t("resolvedList.emptyTitle")}
            message={t("resolvedList.emptyMessage")}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("resolvedList.table.name")}</TableHead>
                <TableHead>{t("resolvedList.table.type")}</TableHead>
                <TableHead className="text-right">{t("resolvedList.table.commissionable")}</TableHead>
                <TableHead className="text-center">{t("resolvedList.table.recipients")}</TableHead>
                <TableHead className="text-center">Payments</TableHead>
                <TableHead className="text-center">{t("resolvedList.table.resolvedDate")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {schedule.opportunity?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t(`opportunityTypes.${schedule.opportunityType}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {schedule.opportunity?.commissionableAmount
                      ? formatCurrency(schedule.opportunity.commissionableAmount)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{schedule.recipientsCount}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{schedule.paymentPlans.length}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {formatDate(schedule.resolvedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/crm/commissions/resolve/${schedule.opportunityId}?type=${schedule.opportunityType}`
                        )
                      }
                    >
                      <ExternalLinkIcon className="mr-2 h-4 w-4" />
                      View/Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
