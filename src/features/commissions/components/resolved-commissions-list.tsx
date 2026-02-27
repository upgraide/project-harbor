"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmptyView } from "@/components/entity-components";
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
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

export function ResolvedCommissionsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const t = useScopedI18n("crm.commissions");

  const activeTab = searchParams.get("tab") || "resolved";

  const { data: schedules } = useSuspenseQuery(
    trpc.commissions.getAllResolvedCommissions.queryOptions()
  ) as { data: any[] };

  // Separate into pending payments and fully paid
  const pendingPayments = schedules.filter((s) => s.paymentStatus?.hasUnpaid);
  const fullyPaid = schedules.filter((s) => s.paymentStatus?.allPaid);

  const renderTable = (data: any[], showTotalPaid = false) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("resolvedList.table.name")}</TableHead>
          <TableHead>{t("resolvedList.table.type")}</TableHead>
          <TableHead className="text-right">
            {t("resolvedList.table.commissionable")}
          </TableHead>
          <TableHead className="text-center">
            {t("resolvedList.table.recipients")}
          </TableHead>
          {showTotalPaid && (
            <TableHead className="text-right">
              {t("resolvedList.table.totalPaid")}
            </TableHead>
          )}
          <TableHead className="text-center">
            {t("resolvedList.table.resolvedDate")}
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((schedule) => (
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
            {showTotalPaid && (
              <TableCell className="text-right">
                <span className="font-semibold text-green-600">
                  {formatCurrency(schedule.paymentStatus?.totalPaid ?? 0)}
                </span>
              </TableCell>
            )}
            <TableCell className="text-center text-muted-foreground text-sm">
              {formatDate(schedule.resolvedAt)}
            </TableCell>
            <TableCell className="text-right">
              <Button
                onClick={() => {
                  const currentParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  const view = currentParams.get("view");
                  const params = new URLSearchParams();
                  if (view) params.set("view", view);
                  params.set("tab", activeTab);
                  router.push(
                    `/crm/commissions/resolve/${schedule.opportunityId}?${params.toString()}`
                  );
                }}
                size="sm"
                variant="ghost"
              >
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                {t("resolvedList.table.viewButton")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Pending Payments Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {t("resolvedList.titlePendingPayments")}
                {pendingPayments.length > 0 && (
                  <Badge variant="destructive">{pendingPayments.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {t("resolvedList.descriptionPendingPayments")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pendingPayments.length === 0 ? (
            <EmptyView
              message={t("resolvedList.emptyPendingPaymentsMessage")}
              title={t("resolvedList.emptyPendingPayments")}
            />
          ) : (
            renderTable(pendingPayments, false)
          )}
        </CardContent>
      </Card>

      {/* Fully Paid Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {t("resolvedList.titleFullyPaid")}
                {fullyPaid.length > 0 && (
                  <Badge variant="secondary">{fullyPaid.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {t("resolvedList.descriptionFullyPaid")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {fullyPaid.length === 0 ? (
            <EmptyView
              message={t("resolvedList.emptyFullyPaidMessage")}
              title={t("resolvedList.emptyFullyPaid")}
            />
          ) : (
            renderTable(fullyPaid, true)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
