"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyView } from "@/components/entity-components";
import { CommissionRole, OpportunityStatus } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { crmCommissionsPath } from "@/paths";
import { ArrowLeftIcon } from "lucide-react";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface EmployeeCommissionsProps {
  userId: string;
}

export const EmployeeCommissions = ({ userId }: EmployeeCommissionsProps) => {
  const t = useScopedI18n("crm.commissions");
  const trpc = useTRPC();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromView = searchParams.get('fromView');
  const [activeTab, setActiveTab] = useState<"pending" | "concluded">("pending");

  const { data, isLoading } = useQuery(
    trpc.commissions.getEmployeeCommissions.queryOptions({ userId })
  );

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">Loading employee commissions...</div>
      </div>
    );
  }

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
    ...data.projects.accountManager.map((p) => ({
      ...p,
      role: CommissionRole.ACCOUNT_MANAGER,
    })),
    ...(data.projects.dealSupport || []).map((p) => ({
      ...p,
      role: CommissionRole.DEAL_SUPPORT,
    })),
  ];

  const pendingProjects = allProjects.filter(
    (p) => p.status === OpportunityStatus.ACTIVE
  );

  const concludedProjects = allProjects.filter(
    (p) => p.status === OpportunityStatus.CONCLUDED
  );

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (fromView) {
                router.push(`/crm/commissions?view=${fromView}`);
              } else {
                router.back();
              }
            }}
            className="mb-2"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {t("detail.backToCommissions")}
          </Button>
          <h1 className="text-3xl font-bold">{data.user.name}</h1>
          <p className="text-muted-foreground">{data.user.email}</p>
        </div>
      </div>

      {/* Commission Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          CommissionRole.ACCOUNT_MANAGER,
          CommissionRole.CLIENT_ACQUISITION,
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
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "concluded")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pending">
                {t("projects.tabs.pending")} ({pendingProjects.length})
              </TabsTrigger>
              <TabsTrigger value="concluded">
                {t("projects.tabs.concluded")} ({concludedProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingProjects.length === 0 ? (
                <EmptyView
                  title={t("projects.emptyState")}
                  message={t("projects.emptyStateDescription")}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingProjects.map((project) => {
                    return (
                      <Card key={`${project.id}-${project.role}`} className="overflow-hidden flex flex-col opacity-75">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base line-clamp-1">
                              {project.name}
                            </CardTitle>
                            <Badge variant="secondary">
                              {t("projects.status.pending")}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {getRoleLabel(project.role)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="space-y-2 text-sm">
                            <div className="text-center text-muted-foreground">
                              {t("projects.details.projectNotFinished")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

              <TabsContent value="concluded">
                {concludedProjects.length === 0 ? (
                  <EmptyView
                    title={t("projects.noConcludedProjects")}
                    message={t("projects.noConcludedProjectsDescription")}
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {concludedProjects.map((project) => {
                      // Find the commission value for this project and role
                      const commissionValue = data.commissionValues.find(
                        cv => cv.opportunityId === project.id && cv.commission.roleType === project.role
                      );

                      // Check if commission is resolved by checking the schedule
                      const schedule = data.scheduleMap?.[project.id];
                      const isResolved = schedule?.isResolved === true;

                      const cardContent = (
                        <Card className={`overflow-hidden flex flex-col ${isResolved ? 'hover:shadow-lg transition-shadow cursor-pointer' : 'opacity-75'}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base line-clamp-1">
                                {project.name}
                              </CardTitle>
                              <Badge variant={isResolved ? "default" : "secondary"}>
                                {isResolved ? t("projects.status.concluded") : t("projects.status.notSetUp")}
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
                                  <span className="font-medium text-amber-600">{t("projects.status.notSetUp")}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );

                      // Only wrap in Link if commission is resolved
                      if (isResolved && commissionValue) {
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

                      // Not resolved - just show card without link
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

