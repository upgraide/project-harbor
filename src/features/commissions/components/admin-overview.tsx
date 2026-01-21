"use client";

import { useQuery } from "@tanstack/react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyView } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { CommissionManagement } from "./commission-management";
import { ResolvedCommissionsList } from "./resolved-commissions-list";
import { PlusIcon, AlertCircleIcon } from "lucide-react";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const AdminOverview = () => {
  const t = useScopedI18n("crm.commissions");
  const trpc = useTRPC();
  const router = useRouter();

  const { data: employees, isLoading: isLoadingEmployees } = useQuery(
    trpc.commissions.getEmployeeSummary.queryOptions()
  );

  const { data: pendingOpportunities, isLoading: isLoadingPending } = useQuery(
    trpc.commissions.getPendingCommissions.queryOptions()
  ) as { data: any[]; isLoading: boolean };

  if (isLoadingEmployees || isLoadingPending || !employees || !pendingOpportunities) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">{t("loading.commissionData")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            {t("tabs.pendingResolution")}
            {pendingOpportunities.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingOpportunities.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">{t("tabs.resolvedCommissions")}</TabsTrigger>
          <TabsTrigger value="employees">{t("tabs.teamMembers")}</TabsTrigger>
          <TabsTrigger value="settings">{t("tabs.commissionRates")}</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("pendingResolution.title")}</CardTitle>
              <CardDescription>
                {t("pendingResolution.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingOpportunities.length === 0 ? (
                <EmptyView
                  title=""
                  message={t("pendingResolution.emptyState")}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("pendingResolution.table.name")}</TableHead>
                      <TableHead>{t("pendingResolution.table.type")}</TableHead>
                      <TableHead className="text-right">{t("pendingResolution.table.finalAmount")}</TableHead>
                      <TableHead className="text-right">{t("pendingResolution.table.commissionable")}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOpportunities.map((opp) => (
                      <TableRow key={`${opp.id}-${opp.type}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <AlertCircleIcon className="h-4 w-4 text-amber-500" />
                            {opp.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(`opportunityTypes.${opp.type}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {opp.finalAmount
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 0,
                              }).format(opp.finalAmount)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {opp.commissionableAmount
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 0,
                              }).format(opp.commissionableAmount)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/crm/commissions/resolve/${opp.id}?type=${opp.type}`
                              )
                            }
                          >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            {t("pendingResolution.table.setupButton")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6 mt-6">
          {/* Employee Overview Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.overview.title")}</CardTitle>
              <CardDescription>
                {employees.length > 0
                  ? `${employees.length} team members`
                  : t("admin.overview.emptyState")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <EmptyView title={t("admin.overview.emptyState")} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.overview.table.employee")}</TableHead>
                      <TableHead className="text-right">
                        {t("admin.overview.table.totalReceived")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("admin.overview.table.totalYetToReceive")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow 
                        key={employee.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/crm/commissions/employee/${employee.id}?fromView=admin`)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium text-green-600">
                            {formatCurrency(employee.totalReceived)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium text-muted-foreground">
                            {formatCurrency(employee.totalYetToReceive)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-6 mt-6">
          <ResolvedCommissionsList />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <CommissionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
