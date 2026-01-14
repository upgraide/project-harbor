"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
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
import { EmptyView } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { CommissionManagement } from "./commission-management";

export const AdminOverview = () => {
  const t = useScopedI18n("crm.commissions");
  const trpc = useTRPC();
  const router = useRouter();

  const { data: employees } = useSuspenseQuery(
    trpc.commissions.getEmployeeSummary.queryOptions()
  );

  return (
    <div className="space-y-6">
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
                  <TableHead className="text-center">
                    {t("admin.overview.table.totalProjects")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("admin.overview.table.commissionRoles")}
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
                    <TableCell className="text-center">
                      <Badge variant="secondary">{employee.totalProjects}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{employee.commissionCount}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Commission Management Section */}
      <CommissionManagement />
    </div>
  );
};
