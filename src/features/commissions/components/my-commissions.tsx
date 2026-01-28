"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyView } from "@/components/entity-components";
import { CommissionRole, OpportunityStatus } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const MyCommissions = () => {
  const t = useScopedI18n("crm.commissions");
  const trpc = useTRPC();
  const [activeTab, setActiveTab] = useState<"pendingPayments" | "pending" | "concluded">("pendingPayments");

  const { data } = useSuspenseQuery(
    trpc.commissions.getMyCommissions.queryOptions()
  );

  const getRoleLabel = (role: CommissionRole) => {
    return t(`roles.${role}`);
  };

  const getCommissionPercentage = (role: CommissionRole) => {
    const commission = data.commissions.find((c) => c.roleType === role);
    return commission?.commissionPercentage ?? 0;
  };

  // Calculate effective commission percentage for a specific project and role
  const getEffectiveCommissionPercentage = (projectId: string, role: CommissionRole, commissionableAmount?: number | null) => {
    if (!commissionableAmount) return null;
    
    const key = `${projectId}-${role}`;
    const commissionValue = data.commissionValueMap?.[key];
    
    if (commissionValue == null) return null;
    
    // Calculate: (commissionValue / commissionableAmount) * 100
    const effectivePercentage = (commissionValue / commissionableAmount) * 100;
    return effectivePercentage;
  };

  const allProjects = [
    ...data.projects.clientAcquisition.map((p) => ({
      ...p,
      role: CommissionRole.CLIENT_ACQUISITION,
    })),
    ...(data.projects.clientOriginator || []).map((p) => ({
      ...p,
      role: CommissionRole.CLIENT_ORIGINATOR,
    })),
    ...data.projects.accountManager.map((p) => ({
      ...p,
      role: CommissionRole.ACCOUNT_MANAGER,
    })),
    ...(data.projects.dealSupport || []).map((p) => ({
      ...p,
      role: CommissionRole.DEAL_SUPPORT,
    })),
  ].filter((p) => p.status !== OpportunityStatus.INACTIVE); // Exclude inactive opportunities

  // Pending projects: ACTIVE projects + CONCLUDED projects without commission setup
  const pendingProjects = allProjects.filter((project) => {
    // Include all ACTIVE projects
    if (project.status === OpportunityStatus.ACTIVE) return true;
    
    // Include CONCLUDED projects that don't have commissions set up yet
    if (project.status === OpportunityStatus.CONCLUDED) {
      const schedule = data.scheduleMap?.[project.id];
      return !schedule || !schedule.isResolved;
    }
    
    return false;
  });

  // Filter concluded projects with pending payments (has unpaid installments)
  const pendingPaymentProjects = allProjects.filter((project) => {
    if (project.status !== OpportunityStatus.CONCLUDED) return false;
    const schedule = data.scheduleMap?.[project.id];
    return schedule?.isResolved && schedule?.paymentStatus?.hasUnpaid;
  });

  // Filter concluded projects where all payments are complete
  const fullyPaidProjects = allProjects.filter((project) => {
    if (project.status !== OpportunityStatus.CONCLUDED) return false;
    const schedule = data.scheduleMap?.[project.id];
    return schedule?.isResolved && schedule?.paymentStatus?.allPaid;
  });

  return (
    <div className="space-y-6">
      {/* Payment Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {t("paymentStats.totalReceived")}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <CardDescription className="text-xs">
              {t("paymentStats.totalReceivedDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.paymentStats?.totalPaid ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {t("paymentStats.totalYetToReceive")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
            <CardDescription className="text-xs">
              {t("paymentStats.totalYetToReceiveDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(data.paymentStats?.totalYetToPay ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[
          CommissionRole.ACCOUNT_MANAGER,
          CommissionRole.CLIENT_ACQUISITION,
          CommissionRole.CLIENT_ORIGINATOR,
          CommissionRole.DEAL_SUPPORT,
        ].map((role) => {
          const roleProjects = allProjects.filter((p) => p.role === role);
          const percentage = getCommissionPercentage(role);

          return (
            <Card key={role}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {getRoleLabel(role)}
                </CardTitle>
                <div className="text-2xl font-bold">{percentage}%</div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {roleProjects.length} {t("summary.totalProjects")}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projects List with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>{t("projects.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pendingPayments" | "pending" | "concluded")}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pendingPayments">
                {t("projects.tabs.pendingPayments")} ({pendingPaymentProjects.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t("projects.tabs.pending")} ({pendingProjects.length})
              </TabsTrigger>
              <TabsTrigger value="concluded">
                {t("projects.tabs.concluded")} ({fullyPaidProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pendingPayments">
              {pendingPaymentProjects.length === 0 ? (
                <EmptyView
                  title={t("projects.noPendingPayments")}
                  message={t("projects.noPendingPaymentsDescription")}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingPaymentProjects.map((project) => {
                    const commissionValue = data.commissionValues.find(
                      cv => cv.opportunityId === project.id && cv.commission.roleType === project.role
                    );
                    const schedule = data.scheduleMap?.[project.id];

                    const cardContent = (
                      <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base line-clamp-1">
                              {project.name}
                            </CardTitle>
                            <Badge variant="outline" className="border-orange-600 text-orange-600">
                              {t("projects.status.pendingPayment")}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {getRoleLabel(project.role)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="space-y-2 text-sm">
                            {project.analytics?.final_amount ? (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t("projects.details.finalAmount")}:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(project.analytics.final_amount)}
                                </span>
                              </div>
                            ) : (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t("projects.details.finalAmount")}:
                                </span>
                                <span className="font-medium">-</span>
                              </div>
                            )}
                            {commissionValue?.totalCommissionValue ? (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">
                                  {t("projects.details.myCommission")}:
                                </span>
                                <span className="font-bold text-primary">
                                  {formatCurrency(commissionValue.totalCommissionValue)}
                                </span>
                              </div>
                            ) : null}
                            {schedule?.paymentStatus?.totalPaid !== undefined && (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">
                                  {t("projects.details.totalPaid")}:
                                </span>
                                <span className="font-bold text-green-600">
                                  {formatCurrency(schedule.paymentStatus.totalPaid)}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );

                    if (commissionValue) {
                      return (
                        <Link 
                          key={`${project.id}-${project.role}`}
                          href={`/crm/commissions/${commissionValue.id}`}
                          className="block"
                        >
                          {cardContent}
                        </Link>
                      );
                    }

                    return (
                      <div key={`${project.id}-${project.role}`}>
                        {cardContent}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {pendingProjects.length === 0 ? (
                <EmptyView
                  title={t("projects.emptyState")}
                  message={t("projects.emptyStateDescription")}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingProjects.map((project) => {
                    const schedule = data.scheduleMap?.[project.id];
                    const isConcludedNotSetUp = project.status === OpportunityStatus.CONCLUDED && (!schedule || !schedule.isResolved);
                    
                    return (
                      <Card key={`${project.id}-${project.role}`} className="overflow-hidden flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base line-clamp-1">
                              {project.name}
                            </CardTitle>
                            <Badge variant={isConcludedNotSetUp ? "outline" : "secondary"}>
                              {isConcludedNotSetUp ? t("projects.status.notSetUp") : t("projects.status.pending")}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {getRoleLabel(project.role)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="space-y-2 text-sm">
                            {isConcludedNotSetUp ? (
                              <>
                                {project.analytics?.final_amount ? (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      {t("projects.details.finalAmount")}:
                                    </span>
                                    <span className="font-medium">
                                      {formatCurrency(project.analytics.final_amount)}
                                    </span>
                                  </div>
                                ) : null}
                                <div className="flex justify-between border-t pt-2">
                                  <span className="text-muted-foreground">
                                    {t("projects.details.myCommission")}:
                                  </span>
                                  <span className="font-medium text-amber-600">{t("projects.status.notSetUp")}</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-muted-foreground">
                                {t("projects.details.projectNotFinished")}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="concluded">
              {fullyPaidProjects.length === 0 ? (
                <EmptyView
                  title={t("projects.noConcludedProjects")}
                  message={t("projects.noConcludedProjectsDescription")}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {fullyPaidProjects.map((project) => {
                    // Find the commission value for this project and role
                    const commissionValue = data.commissionValues.find(
                      cv => cv.opportunityId === project.id && cv.commission.roleType === project.role
                    );

                    const cardContent = (
                      <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base line-clamp-1">
                              {project.name}
                            </CardTitle>
                            <Badge variant="default">
                              {t("projects.status.concluded")}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {getRoleLabel(project.role)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="space-y-2 text-sm">
                            {project.analytics?.final_amount ? (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t("projects.details.finalAmount")}:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(project.analytics.final_amount)}
                                </span>
                              </div>
                            ) : (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t("projects.details.finalAmount")}:
                                </span>
                                <span className="font-medium">-</span>
                              </div>
                            )}
                            {commissionValue?.totalCommissionValue ? (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">
                                  {t("projects.details.myCommission")}:
                                </span>
                                <span className="font-bold text-primary">
                                  {formatCurrency(commissionValue.totalCommissionValue)}
                                </span>
                              </div>
                            ) : (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">
                                  {t("projects.details.myCommission")}:
                                </span>
                                <span className="font-medium">-</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );

                    // All concluded projects have commissions set up, wrap in Link
                    if (commissionValue) {
                      return (
                        <Link 
                          key={`${project.id}-${project.role}`}
                          href={`/crm/commissions/${commissionValue.id}`}
                          className="block"
                        >
                          {cardContent}
                        </Link>
                      );
                    }

                    // Fallback - just show card without link
                    return (
                      <div key={`${project.id}-${project.role}`}>
                        {cardContent}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};