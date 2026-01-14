"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  const allProjects = [
    ...data.projects.clientAcquisition.map((p) => ({
      ...p,
      role: CommissionRole.CLIENT_ACQUISITION,
    })),
    ...data.projects.accountManager.map((p) => ({
      ...p,
      role: CommissionRole.ACCOUNT_MANAGER,
    })),
  ];

  return (
    <div className="space-y-6">
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

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>{t("projects.title")}</CardTitle>
          <CardDescription>
            {allProjects.length > 0
              ? `${allProjects.length} projects`
              : t("projects.emptyStateDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allProjects.length === 0 ? (
            <EmptyView
              title={t("projects.emptyState")}
              message={t("projects.emptyStateDescription")}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((project) => {
                const commissionId = data.commissions.find(c => c.roleType === project.role)?.id;
                
                return (
                  <Link 
                    key={project.id} 
                    href={commissionId ? `/crm/commissions/detail?opportunityId=${project.id}&commissionId=${commissionId}` : '#'}
                    className="block"
                  >
                    <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-1">
                          {project.name}
                        </CardTitle>
                        <Badge
                          variant={
                            project.status === OpportunityStatus.CONCLUDED
                              ? "default"
                              : "secondary"
                          }
                        >
                          {project.status === OpportunityStatus.CONCLUDED
                            ? t("projects.status.concluded")
                            : t("projects.status.pending")}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {getRoleLabel(project.role)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2 text-sm">
                        {project.status === OpportunityStatus.CONCLUDED &&
                        project.analytics ? (
                          <>
                            {project.analytics.final_amount && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t("projects.details.finalAmount")}:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(project.analytics.final_amount)}
                                </span>
                              </div>
                            )}
                            {project.analytics.commissionable_amount && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t("projects.details.commissionableAmount")}:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    project.analytics.commissionable_amount
                                  )}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-muted-foreground">
                                {t("projects.details.commissionPercentage")}:
                              </span>
                              <span className="font-bold">
                                {getCommissionPercentage(project.role)}%
                              </span>
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
                </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
