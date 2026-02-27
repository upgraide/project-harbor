"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeftIcon,
  CheckCircleIcon,
  InfoIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CommissionRole, type OpportunityType } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { crmCommissionsPath } from "@/paths";
import { useTRPC } from "@/trpc/client";

interface CommissionResolutionProps {
  opportunityId: string;
  opportunityType: OpportunityType;
  fallback?: ReactNode;
}

interface PaymentPlanRow {
  installmentNumber: number;
  percentage: string;
  paymentDate: string;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

interface RecipientRole {
  roleType: CommissionRole;
  commissionPercentage: number;
  calculatedAmount: number;
  isHalved?: boolean;
}

interface GroupedRecipient {
  userId: string;
  userName: string;
  userEmail: string;
  roles: RecipientRole[];
  totalAmount: number;
}

interface RecipientRole {
  roleType: CommissionRole;
  commissionPercentage: number;
  calculatedAmount: number;
  isHalved?: boolean;
}

interface GroupedRecipient {
  userId: string;
  userName: string;
  userEmail: string;
  roles: RecipientRole[];
  totalAmount: number;
}

export function CommissionResolution({
  opportunityId,
  opportunityType,
  fallback,
}: CommissionResolutionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useScopedI18n("crm.commissions");

  const getRoleLabel = (role: CommissionRole): string => t(`roles.${role}`);

  // All hooks must be called before any conditional returns
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanRow[]>([
    { installmentNumber: 1, percentage: "100", paymentDate: "" },
  ]);

  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editingPaidDate, setEditingPaidDate] = useState<string>("");

  // Use useQuery instead of useSuspenseQuery to handle errors gracefully
  const {
    data: preview,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    trpc.commissions.getCommissionPreview.queryOptions({
      opportunityId,
    })
  ) as {
    data: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
    refetch: () => void;
  };

  // Get actual commission payments if already resolved
  const { data: commissionPayments } = useQuery(
    trpc.commissions.getOpportunityCommissionPayments.queryOptions({
      opportunityId,
    })
  ) as { data: any[] };

  // Log error for debugging
  useEffect(() => {
    if (isError && error) {
      console.error("Commission preview error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        data: error.data,
        opportunityId,
      });
    }
  }, [isError, error, opportunityId]);

  const updatePaymentStatus = useMutation(
    trpc.commissions.updatePaymentStatus.mutationOptions({
      onSuccess: (data, variables) => {
        const message = variables.isPaid
          ? t("detail.paymentSchedule.toasts.paymentMarkedPaid")
          : t("detail.paymentSchedule.toasts.paymentMarkedUnpaid");
        toast.success(message);
        queryClient.invalidateQueries(
          trpc.commissions.getOpportunityCommissionPayments.queryOptions({
            opportunityId,
          })
        );
        setEditingPaymentId(null);
        setEditingPaidDate("");
      },
      onError: () => {
        toast.error(t("detail.paymentSchedule.toasts.updateFailed"));
      },
    })
  );

  const resolveCommissionsMutation = useMutation(
    trpc.commissions.resolveCommissions.mutationOptions({
      onSuccess: () => {
        toast.success(t("resolution.toasts.resolveSuccess"));
        queryClient.invalidateQueries(
          trpc.commissions.getCommissionPreview.queryOptions({
            opportunityId,
          })
        );
        queryClient.invalidateQueries(
          trpc.commissions.getAllResolvedCommissions.queryOptions()
        );
        // Reload the page to show updated state
        window.location.reload();
      },
      onError: (error: any) => {
        toast.error(error.message || t("resolution.toasts.resolveFailed"));
      },
    })
  ) as any;

  // Initialize payment plan from existing schedule if already resolved
  useEffect(() => {
    if (
      preview?.existingSchedule?.paymentPlans &&
      preview.existingSchedule.paymentPlans.length > 0
    ) {
      const existingPlans = preview.existingSchedule.paymentPlans.map(
        (plan: any) => ({
          installmentNumber: plan.installmentNumber,
          percentage: plan.percentage.toString(),
          paymentDate: new Date(plan.paymentDate).toISOString().split("T")[0],
        })
      );
      setPaymentPlan(existingPlans);
    }
  }, [preview]);

  // Show fallback if query failed or user doesn't have access
  if (isError) {
    // If a custom fallback is provided, use it
    // Otherwise, show a detailed error page with retry capability
    if (fallback) {
      return fallback;
    }

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
            <h1 className="font-bold text-3xl">{t("resolution.title")}</h1>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
                <p className="font-semibold text-lg">{t("errorPage.title")}</p>
                <p className="mt-2 text-muted-foreground text-sm">
                  {error?.message || t("errorPage.message")}
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                <Button onClick={() => refetch()} variant="default">
                  {t("resolution.retry")}
                </Button>
                <Button
                  onClick={() => router.push(crmCommissionsPath())}
                  variant="outline"
                >
                  {t("errorPage.backButton")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !preview) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">
          {t("resolution.loadingDetails")}
        </div>
      </div>
    );
  }

  const addPaymentRow = () => {
    const nextNumber = paymentPlan.length + 1;
    setPaymentPlan([
      ...paymentPlan,
      { installmentNumber: nextNumber, percentage: "", paymentDate: "" },
    ]);
  };

  const removePaymentRow = (index: number) => {
    const newPlan = paymentPlan.filter((_, i) => i !== index);
    // Renumber installments
    setPaymentPlan(
      newPlan.map((row, idx) => ({ ...row, installmentNumber: idx + 1 }))
    );
  };

  const updatePaymentRow = (
    index: number,
    field: keyof PaymentPlanRow,
    value: string
  ) => {
    const newPlan = [...paymentPlan];
    newPlan[index] = { ...newPlan[index], [field]: value };
    setPaymentPlan(newPlan);
  };

  const getTotalPercentage = () =>
    paymentPlan.reduce(
      (sum, row) => sum + (Number.parseFloat(row.percentage) || 0),
      0
    );

  const canSubmit = () => {
    // Allow submission for both new and already resolved commissions
    if (paymentPlan.length === 0) return false;

    // All rows must have percentage and date
    const allValid = paymentPlan.every(
      (row) =>
        row.percentage &&
        row.paymentDate &&
        Number.parseFloat(row.percentage) > 0
    );

    // Total must be 100%
    const totalPercentage = getTotalPercentage();
    const percentageValid = Math.abs(totalPercentage - 100) < 0.01;

    return allValid && percentageValid;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    const formattedPlan = paymentPlan.map((row) => ({
      installmentNumber: row.installmentNumber,
      percentage: Number.parseFloat(row.percentage),
      paymentDate: new Date(row.paymentDate),
    }));

    resolveCommissionsMutation.mutate({
      opportunityId,
      opportunityType,
      paymentPlan: formattedPlan,
    });
  };

  const totalPercentage = getTotalPercentage();
  const percentageError = Math.abs(totalPercentage - 100) > 0.01;

  // Group recipients by user on the frontend for display
  const groupedRecipients: GroupedRecipient[] = (() => {
    if (!preview?.recipients) return [];

    const recipientMap = new Map<string, GroupedRecipient>();

    // Count account managers to determine if halving applies
    const accountManagerCount = preview.recipients.filter(
      (r: any) => r.roleType === CommissionRole.ACCOUNT_MANAGER
    ).length;

    preview.recipients.forEach((recipient: any) => {
      const existing = recipientMap.get(recipient.userId);

      const role: RecipientRole = {
        roleType: recipient.roleType,
        commissionPercentage: recipient.commissionPercentage,
        calculatedAmount: recipient.calculatedAmount,
        isHalved:
          recipient.roleType === CommissionRole.ACCOUNT_MANAGER &&
          accountManagerCount === 2,
      };

      if (existing) {
        existing.roles.push(role);
        existing.totalAmount += recipient.calculatedAmount;
      } else {
        recipientMap.set(recipient.userId, {
          userId: recipient.userId,
          userName: recipient.userName,
          userEmail: recipient.userEmail,
          roles: [role],
          totalAmount: recipient.calculatedAmount,
        });
      }
    });

    return Array.from(recipientMap.values());
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            className="mb-2"
            onClick={() => {
              const currentParams = new URLSearchParams(
                searchParams.toString()
              );
              const view = currentParams.get("view");
              const tab = currentParams.get("tab");
              const params = new URLSearchParams();
              if (view) params.set("view", view);
              if (tab) params.set("tab", tab);
              router.push(`${crmCommissionsPath()}?${params.toString()}`);
            }}
            size="sm"
            variant="ghost"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {t("resolution.backButton")}
          </Button>
          <h1 className="font-bold text-3xl">{t("resolution.title")}</h1>
          <p className="mt-1 text-muted-foreground">
            {preview.opportunity.name}
          </p>
        </div>
        {preview.isResolved && (
          <Badge className="h-8" variant="default">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            {t("resolution.alreadyResolved")}
          </Badge>
        )}
      </div>

      {/* Opportunity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("resolution.opportunityDetails.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">
                {t("resolution.opportunityDetails.status")}
              </Label>
              <div className="mt-1">
                <Badge
                  variant={
                    preview.opportunity.status === "CONCLUDED"
                      ? "default"
                      : "secondary"
                  }
                >
                  {preview.opportunity.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("resolution.opportunityDetails.finalAmount")}
              </Label>
              <p className="font-semibold text-lg">
                {formatCurrency(preview.opportunity.finalAmount || 0)}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("resolution.opportunityDetails.commissionableAmount")}
              </Label>
              <p className="font-semibold text-lg text-primary">
                {formatCurrency(preview.opportunity.commissionableAmount || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Recipients */}
      <Card>
        <CardHeader>
          <CardTitle>{t("resolution.recipients.title")}</CardTitle>
          <CardDescription>
            {t("resolution.recipients.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {groupedRecipients.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {t("resolution.recipients.emptyState")}
            </div>
          ) : (
            <TooltipProvider>
              <div className="space-y-6">
                {groupedRecipients.map((recipient) => (
                  <div
                    className="space-y-3 rounded-lg border p-4"
                    key={recipient.userId}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {recipient.userName}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {recipient.userEmail}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-sm">
                          {t("resolution.recipients.totalCommission")}
                        </div>
                        <div className="font-bold text-primary text-xl">
                          {formatCurrency(recipient.totalAmount)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {recipient.roles.map((role, roleIdx) => (
                        <div
                          className="flex items-center justify-between rounded bg-muted/50 px-3 py-2"
                          key={roleIdx}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {getRoleLabel(role.roleType)}
                            </span>
                            {role.isHalved && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 cursor-help text-orange-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {t("resolution.recipients.halvedTooltip")}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-muted-foreground text-sm">
                                {t("resolution.recipients.rate")}
                              </div>
                              <div className="font-semibold">
                                {role.commissionPercentage.toFixed(2)}%
                              </div>
                            </div>
                            <div className="min-w-[120px] text-right">
                              <div className="text-muted-foreground text-sm">
                                {t("resolution.recipients.amount")}
                              </div>
                              <div className="font-semibold">
                                {formatCurrency(role.calculatedAmount)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between border-t-2 pt-4">
                  <span className="font-bold text-lg">
                    {t("resolution.recipients.grandTotal")}
                  </span>
                  <span className="font-bold text-2xl text-primary">
                    {formatCurrency(
                      groupedRecipients.reduce(
                        (sum, r) => sum + r.totalAmount,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      {/* Payment Plan */}
      {preview.isResolved ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("resolution.paymentSchedule.title")}</CardTitle>
                <CardDescription>
                  {t("resolution.paymentSchedule.editDescription")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">#</TableHead>
                    <TableHead>
                      {t("resolution.paymentSchedule.percentage")}
                    </TableHead>
                    <TableHead>
                      {t("resolution.paymentSchedule.paymentDate")}
                    </TableHead>
                    <TableHead className="w-16" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentPlan.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {t("resolution.paymentSchedule.installment").replace(
                          "{number}",
                          row.installmentNumber.toString()
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            className="max-w-32"
                            max="100"
                            min="0"
                            onChange={(e) =>
                              updatePaymentRow(
                                idx,
                                "percentage",
                                e.target.value
                              )
                            }
                            step="0.01"
                            type="number"
                            value={row.percentage}
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          className="max-w-48"
                          onChange={(e) =>
                            updatePaymentRow(idx, "paymentDate", e.target.value)
                          }
                          type="date"
                          value={row.paymentDate}
                        />
                      </TableCell>
                      <TableCell>
                        {paymentPlan.length > 1 && (
                          <Button
                            onClick={() => removePaymentRow(idx)}
                            size="icon"
                            variant="ghost"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">
                      {t("resolution.paymentSchedule.total")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-bold ${
                          percentageError
                            ? "text-destructive"
                            : "text-green-600"
                        }`}
                      >
                        {totalPercentage.toFixed(2)}%
                      </span>
                      {percentageError && (
                        <span className="ml-2 text-destructive text-sm">
                          {t("resolution.paymentSchedule.mustEqual100")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex items-center justify-between border-t pt-4">
                <Button onClick={addPaymentRow} size="sm" variant="outline">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  {t("resolution.paymentSchedule.addPayment")}
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => router.back()} variant="outline">
                    {t("resolution.paymentSchedule.cancel")}
                  </Button>
                  <Button
                    disabled={
                      !canSubmit() || resolveCommissionsMutation.isPending
                    }
                    onClick={handleSubmit}
                  >
                    {" "}
                    {resolveCommissionsMutation.isPending
                      ? t("resolution.paymentSchedule.updating")
                      : t("resolution.paymentSchedule.update")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("resolution.paymentSchedule.title")}</CardTitle>
                <CardDescription>
                  {t("resolution.paymentSchedule.description")
                    .replace("{count}", groupedRecipients.length.toString())
                    .replace(
                      "{plural}",
                      groupedRecipients.length !== 1 ? "s" : ""
                    )}
                </CardDescription>
              </div>
              <Button onClick={addPaymentRow} size="sm" variant="outline">
                <PlusIcon className="mr-2 h-4 w-4" />
                {t("resolution.paymentSchedule.addPayment")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">#</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="w-16" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentPlan.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        Payment {row.installmentNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            className="max-w-32"
                            max="100"
                            min="0"
                            onChange={(e) =>
                              updatePaymentRow(
                                idx,
                                "percentage",
                                e.target.value
                              )
                            }
                            step="0.01"
                            type="number"
                            value={row.percentage}
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          className="max-w-48"
                          onChange={(e) =>
                            updatePaymentRow(idx, "paymentDate", e.target.value)
                          }
                          type="date"
                          value={row.paymentDate}
                        />
                      </TableCell>
                      <TableCell>
                        {paymentPlan.length > 1 && (
                          <Button
                            onClick={() => removePaymentRow(idx)}
                            size="icon"
                            variant="ghost"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">
                      {t("resolution.paymentSchedule.total")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-bold ${
                          percentageError
                            ? "text-destructive"
                            : "text-green-600"
                        }`}
                      >
                        {totalPercentage.toFixed(2)}%
                      </span>
                      {percentageError && (
                        <span className="ml-2 text-destructive text-sm">
                          {t("resolution.paymentSchedule.mustEqual100")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button onClick={() => router.back()} variant="outline">
                  {t("resolution.paymentSchedule.cancel")}
                </Button>
                <Button
                  disabled={
                    !canSubmit() || resolveCommissionsMutation.isPending
                  }
                  onClick={handleSubmit}
                >
                  {resolveCommissionsMutation.isPending
                    ? t("resolution.paymentSchedule.saving")
                    : t("resolution.paymentSchedule.save")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Tracking - Only shown if already resolved */}
      {preview.isResolved &&
        commissionPayments &&
        commissionPayments.length > 0 &&
        (() => {
          // Group commission values by user, aggregating all their roles
          const userGroupedPayments = new Map<
            string,
            {
              userId: string;
              userName: string;
              userEmail: string;
              roles: Array<{ roleType: CommissionRole; totalValue: number }>;
              totalCommission: number;
              // Group payments by installment number across all roles
              installments: Map<
                number,
                {
                  installmentNumber: number;
                  paymentDate: Date | null;
                  totalAmount: number;
                  payments: Array<{
                    id: string;
                    isPaid: boolean;
                    paidAt: Date | null;
                    paymentAmount: number;
                    roleType: CommissionRole;
                  }>;
                }
              >;
            }
          >();

          for (const commissionValue of commissionPayments as any[]) {
            const userId = commissionValue.commission.user.id;
            const userName = commissionValue.commission.user.name;
            const userEmail = commissionValue.commission.user.email;
            const roleType = commissionValue.commission.roleType;
            const totalValue = commissionValue.totalCommissionValue ?? 0;

            if (!userGroupedPayments.has(userId)) {
              userGroupedPayments.set(userId, {
                userId,
                userName,
                userEmail,
                roles: [],
                totalCommission: 0,
                installments: new Map(),
              });
            }

            const userGroup = userGroupedPayments.get(userId)!;
            userGroup.roles.push({ roleType, totalValue });
            userGroup.totalCommission += totalValue;

            // Group payments by installment number
            for (const payment of commissionValue.payments) {
              const installmentNum = payment.installmentNumber;
              if (!userGroup.installments.has(installmentNum)) {
                userGroup.installments.set(installmentNum, {
                  installmentNumber: installmentNum,
                  paymentDate: payment.paymentDate,
                  totalAmount: 0,
                  payments: [],
                });
              }
              const installment = userGroup.installments.get(installmentNum)!;
              installment.totalAmount += payment.paymentAmount ?? 0;
              installment.payments.push({
                id: payment.id,
                isPaid: payment.isPaid,
                paidAt: payment.paidAt,
                paymentAmount: payment.paymentAmount ?? 0,
                roleType,
              });
            }
          }

          const groupedUsers = Array.from(userGroupedPayments.values());

          return (
            <Card>
              <CardHeader>
                <CardTitle>Payment Tracking</CardTitle>
                <CardDescription>
                  Mark payments as paid for each team member (payments are
                  grouped across all their roles)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {groupedUsers.map((userGroup) => {
                    // Calculate totals across all installments
                    const allPayments = Array.from(
                      userGroup.installments.values()
                    ).flatMap((i) => i.payments);
                    const totalPaid = allPayments
                      .filter((p) => p.isPaid)
                      .reduce((sum, p) => sum + p.paymentAmount, 0);
                    const totalRemaining =
                      userGroup.totalCommission - totalPaid;

                    return (
                      <div
                        className="rounded-lg border p-4"
                        key={userGroup.userId}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">
                              {userGroup.userName}
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              {userGroup.roles
                                .map((r) => t(`roles.${r.roleType}`))
                                .join(", ")}{" "}
                              • {formatCurrency(userGroup.totalCommission)}{" "}
                              total
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-muted-foreground text-sm">
                              Paid / Remaining
                            </div>
                            <div className="flex gap-2">
                              <span className="font-semibold text-green-600">
                                {formatCurrency(totalPaid)}
                              </span>
                              <span className="text-muted-foreground">/</span>
                              <span className="font-semibold text-orange-600">
                                {formatCurrency(totalRemaining)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">Paid</TableHead>
                              <TableHead>Installment</TableHead>
                              <TableHead>Scheduled Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Array.from(userGroup.installments.entries())
                              .sort(([a], [b]) => a - b)
                              .map(([installmentNum, installment]) => {
                                // Check if all payments in this installment are paid
                                const allPaid = installment.payments.every(
                                  (p) => p.isPaid
                                );
                                const somePaid = installment.payments.some(
                                  (p) => p.isPaid
                                );
                                const firstPayment = installment.payments[0];
                                const isEditingThis = installment.payments.some(
                                  (p) => editingPaymentId === p.id
                                );
                                const installmentKey =
                                  installmentNum === 1
                                    ? "first"
                                    : installmentNum === 2
                                      ? "second"
                                      : "third";

                                return (
                                  <TableRow key={installmentNum}>
                                    <TableCell>
                                      <Checkbox
                                        checked={allPaid}
                                        disabled={updatePaymentStatus.isPending}
                                        onCheckedChange={() => {
                                          // Toggle all payments in this installment
                                          const newIsPaid = !allPaid;
                                          for (const payment of installment.payments) {
                                            updatePaymentStatus.mutate({
                                              paymentId: payment.id,
                                              isPaid: newIsPaid,
                                              paidAt: newIsPaid
                                                ? installment.paymentDate
                                                  ? new Date(
                                                      installment.paymentDate
                                                    )
                                                  : new Date()
                                                : null,
                                            });
                                          }
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {t(
                                        `detail.paymentSchedule.installmentNumber.${installmentKey}`
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {isEditingThis ? (
                                        <div className="flex items-center gap-2">
                                          <Input
                                            className="w-40"
                                            onChange={(e) =>
                                              setEditingPaidDate(e.target.value)
                                            }
                                            type="date"
                                            value={editingPaidDate}
                                          />
                                          <Button
                                            disabled={
                                              updatePaymentStatus.isPending
                                            }
                                            onClick={() => {
                                              if (!editingPaidDate) return;
                                              // Update all payments in this installment
                                              for (const payment of installment.payments) {
                                                updatePaymentStatus.mutate({
                                                  paymentId: payment.id,
                                                  isPaid: true,
                                                  paidAt: new Date(
                                                    editingPaidDate
                                                  ),
                                                });
                                              }
                                              setEditingPaymentId(null);
                                              setEditingPaidDate("");
                                            }}
                                            size="sm"
                                            variant="ghost"
                                          >
                                            Save
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              setEditingPaymentId(null);
                                              setEditingPaidDate("");
                                            }}
                                            size="sm"
                                            variant="ghost"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      ) : (
                                        <div>
                                          <div>
                                            {installment.paymentDate
                                              ? new Date(
                                                  installment.paymentDate
                                                ).toLocaleDateString()
                                              : "-"}
                                          </div>
                                          {allPaid && firstPayment?.paidAt && (
                                            <div className="text-muted-foreground text-xs">
                                              Paid:{" "}
                                              {new Date(
                                                firstPayment.paidAt
                                              ).toLocaleDateString()}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {formatCurrency(installment.totalAmount)}
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          allPaid
                                            ? "default"
                                            : somePaid
                                              ? "secondary"
                                              : "outline"
                                        }
                                      >
                                        {allPaid
                                          ? t(
                                              "detail.paymentSchedule.statusValues.paid"
                                            )
                                          : somePaid
                                            ? "Partial"
                                            : t(
                                                "detail.paymentSchedule.statusValues.scheduled"
                                              )}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {allPaid && !isEditingThis && (
                                        <Button
                                          disabled={
                                            updatePaymentStatus.isPending
                                          }
                                          onClick={() => {
                                            setEditingPaymentId(
                                              firstPayment.id
                                            );
                                            setEditingPaidDate(
                                              firstPayment.paidAt
                                                ? new Date(firstPayment.paidAt)
                                                    .toISOString()
                                                    .split("T")[0]
                                                : installment.paymentDate
                                                  ? new Date(
                                                      installment.paymentDate
                                                    )
                                                      .toISOString()
                                                      .split("T")[0]
                                                  : new Date()
                                                      .toISOString()
                                                      .split("T")[0]
                                            );
                                          }}
                                          size="sm"
                                          variant="ghost"
                                        >
                                          Edit Date
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })()}
    </div>
  );
}
