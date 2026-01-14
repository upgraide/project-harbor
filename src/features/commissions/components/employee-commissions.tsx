"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  const { data } = useSuspenseQuery(
    trpc.commissions.getEmployeeCommissions.queryOptions({ userId })
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
                const commission = data.commissions.find(c => c.roleType === project.role);
                const commissionId = commission?.id || 'placeholder';
                
                // For admin viewing, always show the link even if commission not configured
                // The commission detail page will handle showing '-' for missing values

                return (
                  <Link 
                    key={project.id} 
                    href={commission ? `/crm/commissions/detail?opportunityId=${project.id}&commissionId=${commissionId}` : `/crm/commissions/detail?opportunityId=${project.id}&commissionId=create&roleType=${project.role}&userId=${userId}`}
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
