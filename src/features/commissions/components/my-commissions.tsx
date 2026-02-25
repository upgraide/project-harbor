"use client";

import { useState, useMemo } from "react";
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

// Type for a grouped project (one per opportunity, with all roles)
interface GroupedProject {
  id: string;
  name: string;
  status: OpportunityStatus;
  analytics?: {
    closed_at?: Date | null;
    final_amount?: number | null;
    commissionable_amount?: number | null;
  } | null;
  roles: CommissionRole[];
  totalCommissionValue: number;
  commissionValueIds: string[];  // All CommissionValue IDs for this user on this opportunity
  primaryCommissionValueId: string | null;  // First CommissionValue ID for linking
}

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

  // Group projects by opportunityId, collecting all roles for each
  const groupedProjects = useMemo(() => {
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
    ].filter((p) => p.status !== OpportunityStatus.INACTIVE);

    // Group by opportunity ID
    const grouped = new Map<string, GroupedProject>();
    
    for (const project of allProjects) {
      if (!grouped.has(project.id)) {
        grouped.set(project.id, {
          id: project.id,
          name: project.name,
          status: project.status,
          analytics: project.analytics,
          roles: [],
          totalCommissionValue: 0,
          commissionValueIds: [],
          primaryCommissionValueId: null,
        });
      }
      
      const group = grouped.get(project.id)!;
      group.roles.push(project.role);
      
      // Find commission value for this role
      const commissionValue = data.commissionValues.find(
        cv => cv.opportunityId === project.id && cv.commission.roleType === project.role
      );
      if (commissionValue) {
        group.totalCommissionValue += commissionValue.totalCommissionValue ?? 0;
        group.commissionValueIds.push(commissionValue.id);
        if (!group.primaryCommissionValueId) {
          group.primaryCommissionValueId = commissionValue.id;
        }
      }
    }
    
    return Array.from(grouped.values());
  }, [data]);

  // Filter grouped projects by status
  const pendingProjects = useMemo(() => {
    return groupedProjects.filter((project) => {
      if (project.status === OpportunityStatus.ACTIVE) return true;
      if (project.status === OpportunityStatus.CONCLUDED) {
        const schedule = data.scheduleMap?.[project.id];
        return !schedule || !schedule.isResolved;
      }
      return false;
    });
  }, [groupedProjects, data.scheduleMap]);

  const pendingPaymentProjects = useMemo(() => {
    return groupedProjects.filter((project) => {
      if (project.status !== OpportunityStatus.CONCLUDED) return false;
      const schedule = data.scheduleMap?.[project.id];
      return schedule?.isResolved && schedule?.paymentStatus?.hasUnpaid;
    });
  }, [groupedProjects, data.scheduleMap]);

  const fullyPaidProjects = useMemo(() => {
    return groupedProjects.filter((project) => {
      if (project.status !== OpportunityStatus.CONCLUDED) return false;
      const schedule = data.scheduleMap?.[project.id];
      return schedule?.isResolved && schedule?.paymentStatus?.allPaid;
    });
  }, [groupedProjects, data.scheduleMap]);

  // Calculate role stats from all projects (not grouped)
  const allProjectsWithRoles = useMemo(() => [
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
  ].filter((p) => p.status !== OpportunityStatus.INACTIVE), [data]);

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
          const roleProjects = allProjectsWithRoles.filter((p) => p.role === role);
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
                            {project.roles.map(role => getRoleLabel(role)).join(", ")}
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
                            {project.totalCommissionValue > 0 ? (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">
                                  {t("projects.details.myCommission")}:
                                </span>
                                <span className="font-bold text-primary">
                                  {formatCurrency(project.totalCommissionValue)}
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

                    if (project.primaryCommissionValueId) {
                      return (
                        <Link 
                          key={project.id}
                          href={`/crm/commissions/${project.primaryCommissionValueId}`}
                          className="block"
                        >
                          {cardContent}
                        </Link>
                      );
                    }

                    return (
                      <div key={project.id}>
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
                      <Card key={project.id} className="overflow-hidden flex flex-col">
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
                            {project.roles.map(role => getRoleLabel(role)).join(", ")}
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
                            {project.roles.map(role => getRoleLabel(role)).join(", ")}
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
                            {project.totalCommissionValue > 0 ? (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">
                                  {t("projects.details.myCommission")}:
                                </span>
                                <span className="font-bold text-primary">
                                  {formatCurrency(project.totalCommissionValue)}
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

                    // Link to the primary commission value
                    if (project.primaryCommissionValueId) {
                      return (
                        <Link 
                          key={project.id}
                          href={`/crm/commissions/${project.primaryCommissionValueId}`}
                          className="block"
                        >
                          {cardContent}
                        </Link>
                      );
                    }

                    // Fallback - just show card without link
                    return (
                      <div key={project.id}>
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