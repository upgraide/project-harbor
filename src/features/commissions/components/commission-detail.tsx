"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, CalendarIcon, DollarSignIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OpportunityStatus } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { crmCommissionsPath } from "@/paths";
import { useTRPC } from "@/trpc/client";

interface CommissionDetailProps {
  commissionValueId: string;
}

export function CommissionDetail({ commissionValueId }: CommissionDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useScopedI18n("crm.commissions");
  const trpc = useTRPC();

  const {
    data: commissionDetail,
    isLoading,
    isError,
    error,
  } = useQuery(
    trpc.commissions.getCommissionDetail.queryOptions({
      commissionValueId,
    })
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">
          Loading commission details...
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError || !commissionDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button
              className="mb-2"
              onClick={() => router.back()}
              size="sm"
              variant="ghost"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              {t("detail.backToCommissions")}
            </Button>
            <h1 className="font-bold text-3xl">{t("detail.title")}</h1>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="font-semibold text-lg">Commission not found</p>
              <p className="mt-2 text-muted-foreground text-sm">
                {error?.message ||
                  "The commission you're looking for doesn't exist or you don't have permission to view it."}
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push(crmCommissionsPath())}
              >
                Return to Commissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-PT").format(new Date(date));
  };

  const getPaymentStatus = (payment: {
    paymentDate: Date | null;
    paymentAmount: number | null;
  }) => {
    if (!(payment.paymentDate || payment.paymentAmount)) {
      return {
        label: t("detail.paymentSchedule.statusValues.notSet"),
        variant: "secondary" as const,
      };
    }

    const now = new Date();
    const paymentDate = payment.paymentDate
      ? new Date(payment.paymentDate)
      : null;

    if (payment.paymentAmount && paymentDate && paymentDate <= now) {
      return {
        label: t("detail.paymentSchedule.statusValues.paid"),
        variant: "default" as const,
      };
    }

    if (payment.paymentAmount && paymentDate) {
      return {
        label: t("detail.paymentSchedule.statusValues.scheduled"),
        variant: "outline" as const,
      };
    }

    return {
      label: t("detail.paymentSchedule.statusValues.pending"),
      variant: "secondary" as const,
    };
  };

  const totalPaid = commissionDetail.payments
    .filter((p: any) => {
      if (!(p.paymentDate && p.paymentAmount)) return false;
      return new Date(p.paymentDate) <= new Date();
    })
    .reduce((sum: number, p: any) => sum + (p.paymentAmount ?? 0), 0);

  const totalScheduled = commissionDetail.payments.reduce(
    (sum: number, p: any) => sum + (p.paymentAmount ?? 0),
    0
  );

  const totalRemaining =
    (commissionDetail.totalCommissionValue ?? 0) - totalPaid;

  // Calculate aggregated totals across all roles for this user on this project
  const aggregatedTotalCommissionValue =
    commissionDetail.allProjectCommissions &&
    commissionDetail.allProjectCommissions.length > 0
      ? commissionDetail.allProjectCommissions.reduce(
          (sum: number, cv: any) => sum + (cv.totalCommissionValue ?? 0),
          0
        )
      : (commissionDetail.totalCommissionValue ?? 0);

  // Aggregate payments across all roles
  const aggregatedPayments =
    commissionDetail.allProjectCommissions &&
    commissionDetail.allProjectCommissions.length > 0
      ? commissionDetail.allProjectCommissions.flatMap(
          (cv: any) => cv.payments || []
        )
      : commissionDetail.payments;

  const aggregatedTotalPaid = aggregatedPayments
    .filter((p: any) => {
      if (!(p.paymentDate && p.paymentAmount)) return false;
      return new Date(p.paymentDate) <= new Date();
    })
    .reduce((sum: number, p: any) => sum + (p.paymentAmount ?? 0), 0);

  const aggregatedTotalScheduled = aggregatedPayments.reduce(
    (sum: number, p: any) => sum + (p.paymentAmount ?? 0),
    0
  );

  const aggregatedTotalRemaining =
    aggregatedTotalCommissionValue - aggregatedTotalPaid;

  // Group aggregated payments by installment number
  const paymentsByInstallment = new Map<
    number,
    {
      totalAmount: number;
      isPaid: boolean;
      paymentDate: Date | null;
      paidAt: Date | null;
    }
  >();
  for (const payment of aggregatedPayments) {
    const num = payment.installmentNumber;
    if (!paymentsByInstallment.has(num)) {
      paymentsByInstallment.set(num, {
        totalAmount: 0,
        isPaid: true, // Assume paid until we find an unpaid one
        paymentDate: payment.paymentDate,
        paidAt: payment.paidAt,
      });
    }
    const inst = paymentsByInstallment.get(num)!;
    inst.totalAmount += payment.paymentAmount ?? 0;
    if (!payment.isPaid) inst.isPaid = false;
    // Use the first non-null paidAt date
    if (payment.paidAt && !inst.paidAt) {
      inst.paidAt = payment.paidAt;
    }
  }

  // Get all installment numbers sorted
  const installmentNumbers = Array.from(paymentsByInstallment.keys()).sort(
    (a, b) => a - b
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            className="mb-2"
            onClick={() => router.back()}
            size="sm"
            variant="ghost"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {t("detail.backToCommissions")}
          </Button>
          <h1 className="font-bold text-3xl">{t("detail.title")}</h1>
        </div>
      </div>

      {/* Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t("detail.breakdown.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">
                {t("detail.breakdown.project")}
              </Label>
              <p className="font-medium">
                {commissionDetail.opportunity?.name ?? "Unknown Project"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("detail.breakdown.projectStatus")}
              </Label>
              <div className="mt-1">
                <Badge
                  variant={
                    commissionDetail.opportunity?.status ===
                    OpportunityStatus.CONCLUDED
                      ? "default"
                      : "secondary"
                  }
                >
                  {commissionDetail.opportunity?.status
                    ? t(
                        `projects.status.${commissionDetail.opportunity.status.toLowerCase()}`
                      )
                    : "Unknown"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("detail.breakdown.commissionee")}
              </Label>
              <p className="font-medium">
                {commissionDetail.commission.user.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {commissionDetail.commission.user.email}
              </p>
            </div>
          </div>

          {/* Roles and Commission Percentages */}
          <div className="mt-4">
            <Label className="mb-3 block text-muted-foreground">
              {t("detail.breakdown.rolesAndCommissions")}
            </Label>
            <div className="space-y-2">
              {commissionDetail.allProjectCommissions &&
              commissionDetail.allProjectCommissions.length > 0 ? (
                commissionDetail.allProjectCommissions.map(
                  (projectCommission: any, index: number) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                      key={index}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <span className="font-semibold text-primary text-xs">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {projectCommission.commission?.roleType
                              ? t(
                                  `roles.${projectCommission.commission.roleType}`
                                )
                              : "Unknown Role"}
                          </span>
                          {projectCommission.isHalved && (
                            <Badge className="text-xs" variant="secondary">
                              ½
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          {t("detail.breakdown.commissionPercentage")}:
                        </span>
                        <Badge
                          className="font-mono font-semibold text-sm"
                          variant="outline"
                        >
                          {projectCommission.effectivePercentage?.toFixed(2) ??
                            projectCommission.commission.commissionPercentage}
                          %
                        </Badge>
                        {projectCommission.isHalved && (
                          <span className="text-muted-foreground text-xs">
                            (base:{" "}
                            {projectCommission.commission.commissionPercentage}
                            %)
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <span className="font-medium">
                    {commissionDetail.commission?.roleType
                      ? t(`roles.${commissionDetail.commission.roleType}`)
                      : "Unknown Role"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      {t("detail.breakdown.commissionPercentage")}:
                    </span>
                    <Badge
                      className="font-mono font-semibold text-sm"
                      variant="outline"
                    >
                      {commissionDetail.commission.commissionPercentage}%
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Commission Value */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5" />
            {t("detail.totalValue.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commissionDetail.opportunity?.status !==
          OpportunityStatus.CONCLUDED ? (
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-muted-foreground text-sm">
                {t("detail.totalValue.calculationPending")}
              </p>
              <p className="mt-2 font-bold text-2xl">-</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.totalValue.finalAmount")}
                </Label>
                <p className="font-semibold text-lg">
                  {formatCurrency(commissionDetail.opportunity?.finalAmount)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.totalValue.commissionableAmount")}
                </Label>
                <p className="font-semibold text-lg">
                  {formatCurrency(
                    commissionDetail.opportunity?.commissionableAmount
                  )}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.totalValue.commissionPercentage")}
                </Label>
                <div className="flex flex-wrap items-center gap-1 font-semibold text-lg">
                  {commissionDetail.allProjectCommissions &&
                  commissionDetail.allProjectCommissions.length > 0
                    ? commissionDetail.allProjectCommissions.map(
                        (cv: any, idx: number) => (
                          <span className="flex items-center gap-1" key={idx}>
                            {idx > 0 && (
                              <span className="text-muted-foreground">+</span>
                            )}
                            <span>
                              {cv.effectivePercentage?.toFixed(2) ??
                                cv.commission.commissionPercentage}
                              %
                            </span>
                            {cv.isHalved && (
                              <Badge
                                className="ml-1 text-xs"
                                variant="secondary"
                              >
                                ½
                              </Badge>
                            )}
                          </span>
                        )
                      )
                    : `${commissionDetail.commission.commissionPercentage}%`}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.totalValue.totalCommission")}
                </Label>
                <p className="font-bold text-2xl text-primary">
                  {formatCurrency(aggregatedTotalCommissionValue)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {t("detail.paymentSchedule.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("detail.paymentSchedule.installment")}</TableHead>
                <TableHead>{t("detail.paymentSchedule.paymentDate")}</TableHead>
                <TableHead>
                  {t("detail.paymentSchedule.paymentAmount")}
                </TableHead>
                <TableHead>{t("detail.paymentSchedule.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* View mode - show aggregated payment schedule dynamically */}
              {installmentNumbers.length > 0 ? (
                installmentNumbers.map((num) => {
                  const installmentKey =
                    num === 1
                      ? "first"
                      : num === 2
                        ? "second"
                        : num === 3
                          ? "third"
                          : `${num}º`;
                  const aggregatedInstallment = paymentsByInstallment.get(num)!;

                  // Payment record exists - show actual data
                  const status = aggregatedInstallment.isPaid
                    ? {
                        label: t("detail.paymentSchedule.statusValues.paid"),
                        variant: "default" as const,
                      }
                    : {
                        label: t(
                          "detail.paymentSchedule.statusValues.scheduled"
                        ),
                        variant: "outline" as const,
                      };

                  // Show paidAt date when paid, otherwise show scheduled paymentDate
                  const displayDate =
                    aggregatedInstallment.isPaid && aggregatedInstallment.paidAt
                      ? aggregatedInstallment.paidAt
                      : aggregatedInstallment.paymentDate;

                  return (
                    <TableRow key={num}>
                      <TableCell className="font-medium">
                        {num <= 3
                          ? t(
                              `detail.paymentSchedule.installmentNumber.${installmentKey}`
                            )
                          : `${num}º Pagamento`}
                      </TableCell>
                      <TableCell>{formatDate(displayDate)}</TableCell>
                      <TableCell>
                        {formatCurrency(aggregatedInstallment.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    className="text-center text-muted-foreground"
                    colSpan={4}
                  >
                    {t("detail.paymentSchedule.statusValues.notSet")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Payment Summary - only show if there are actual payments with values */}
          {aggregatedPayments.length > 0 &&
            aggregatedPayments.some((p: any) => p.paymentAmount) && (
              <div className="mt-6 grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
                <div>
                  <Label className="text-muted-foreground">
                    {t("detail.paymentSchedule.totalPaid")}
                  </Label>
                  <p className="font-semibold text-green-600 text-lg">
                    {formatCurrency(aggregatedTotalPaid)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Total Scheduled
                  </Label>
                  <p className="font-semibold text-lg">
                    {formatCurrency(aggregatedTotalScheduled)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    {t("detail.paymentSchedule.totalRemaining")}
                  </Label>
                  <p
                    className={cn(
                      "font-semibold text-lg",
                      aggregatedTotalRemaining > 0
                        ? "text-orange-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatCurrency(aggregatedTotalRemaining)}
                  </p>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
