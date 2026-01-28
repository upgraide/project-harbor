"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeftIcon, CalendarIcon, DollarSignIcon } from "lucide-react";
import { crmCommissionsPath } from "@/paths";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { OpportunityStatus } from "@/generated/prisma";

interface CommissionDetailProps {
  commissionValueId: string;
}

export function CommissionDetail({ commissionValueId }: CommissionDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useScopedI18n("crm.commissions");
  const trpc = useTRPC();

  const { data: commissionDetail, isLoading, isError, error } = useQuery(
    trpc.commissions.getCommissionDetail.queryOptions({
      commissionValueId,
    })
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">Loading commission details...</div>
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
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-2"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              {t("detail.backToCommissions")}
            </Button>
            <h1 className="text-3xl font-bold">{t("detail.title")}</h1>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold">Commission not found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {error?.message || "The commission you're looking for doesn't exist or you don't have permission to view it."}
              </p>
              <Button 
                onClick={() => router.push(crmCommissionsPath())} 
                className="mt-4"
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

  const getPaymentStatus = (payment: { paymentDate: Date | null; paymentAmount: number | null }) => {
    if (!payment.paymentDate && !payment.paymentAmount) {
      return {
        label: t("detail.paymentSchedule.statusValues.notSet"),
        variant: "secondary" as const,
      };
    }
    
    const now = new Date();
    const paymentDate = payment.paymentDate ? new Date(payment.paymentDate) : null;
    
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
      if (!p.paymentDate || !p.paymentAmount) return false;
      return new Date(p.paymentDate) <= new Date();
    })
    .reduce((sum: number, p: any) => sum + (p.paymentAmount ?? 0), 0);

  const totalScheduled = commissionDetail.payments
    .reduce((sum: number, p: any) => sum + (p.paymentAmount ?? 0), 0);

  const totalRemaining = (commissionDetail.totalCommissionValue ?? 0) - totalPaid;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {t("detail.backToCommissions")}
          </Button>
          <h1 className="text-3xl font-bold">{t("detail.title")}</h1>
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
                <Badge variant={commissionDetail.opportunity?.status === OpportunityStatus.CONCLUDED ? "default" : "secondary"}>
                  {commissionDetail.opportunity?.status ? 
                    t(`projects.status.${commissionDetail.opportunity.status.toLowerCase()}`) : 
                    "Unknown"}
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
              <p className="text-sm text-muted-foreground">
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
              {commissionDetail.allProjectCommissions && commissionDetail.allProjectCommissions.length > 0 ? (
                commissionDetail.allProjectCommissions.map((projectCommission: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-semibold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-medium">
                        {projectCommission.commission?.roleType ? 
                          t(`roles.${projectCommission.commission.roleType}`) : 
                          "Unknown Role"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t("detail.breakdown.commissionPercentage")}:
                      </span>
                      <Badge variant="outline" className="font-mono text-sm font-semibold">
                        {projectCommission.commission.commissionPercentage}%
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <span className="font-medium">
                    {commissionDetail.commission?.roleType ? 
                      t(`roles.${commissionDetail.commission.roleType}`) : 
                      "Unknown Role"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t("detail.breakdown.commissionPercentage")}:
                    </span>
                    <Badge variant="outline" className="font-mono text-sm font-semibold">
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
          {commissionDetail.opportunity?.status !== OpportunityStatus.CONCLUDED ? (
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {t("detail.totalValue.calculationPending")}
              </p>
              <p className="mt-2 text-2xl font-bold">-</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.totalValue.finalAmount")}
                </Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(commissionDetail.opportunity?.finalAmount)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.totalValue.commissionableAmount")}
                </Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(commissionDetail.opportunity?.commissionableAmount)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.totalValue.commissionPercentage")}
                </Label>
                <p className="text-lg font-semibold">
                  {commissionDetail.commission.commissionPercentage}%
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.totalValue.totalCommission")}
                </Label>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(commissionDetail.totalCommissionValue)}
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
                <TableHead>{t("detail.paymentSchedule.paymentAmount")}</TableHead>
                <TableHead>{t("detail.paymentSchedule.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* View mode - show payment schedule */}
              {[1, 2, 3].map((num) => {
                const installmentKey = num === 1 ? "first" : num === 2 ? "second" : "third";
                const payment = commissionDetail.payments.find((p: any) => p.installmentNumber === num);

                if (!payment) {
                  // No payment record exists - show placeholder
                  return (
                    <TableRow key={num}>
                      <TableCell className="font-medium">
                        {t(`detail.paymentSchedule.installmentNumber.${installmentKey}`)}
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t("detail.paymentSchedule.statusValues.notSet")}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                }

                // Payment record exists - show actual data or "-" if null
                const status = getPaymentStatus(payment);
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {t(`detail.paymentSchedule.installmentNumber.${installmentKey}`)}
                    </TableCell>
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell>{formatCurrency(payment.paymentAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Payment Summary - only show if there are actual payments with values */}
          {commissionDetail.payments.length > 0 && commissionDetail.payments.some((p: any) => p.paymentAmount) && (
            <div className="mt-6 grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.paymentSchedule.totalPaid")}
                </Label>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Total Scheduled
                </Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(totalScheduled)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  {t("detail.paymentSchedule.totalRemaining")}
                </Label>
                <p className={cn(
                  "text-lg font-semibold",
                  totalRemaining > 0 ? "text-orange-600" : "text-muted-foreground"
                )}>
                  {formatCurrency(totalRemaining)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
