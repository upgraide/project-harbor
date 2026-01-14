"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyView } from "@/components/entity-components";
import { CommissionRole } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

type EditState = {
  userId: string;
  roleType: CommissionRole;
  value: string;
};

export const CommissionManagement = () => {
  const t = useScopedI18n("crm.commissions");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [editingCell, setEditingCell] = useState<EditState | null>(null);

  const { data: teamMembers } = useSuspenseQuery(
    trpc.commissions.getTeamMembers.queryOptions()
  );

  const updateCommission = useMutation(
    trpc.commissions.updateCommission.mutationOptions({
      onSuccess: () => {
        toast.success(t("admin.management.validation.saveSuccess"));
        queryClient.invalidateQueries(
          trpc.commissions.getTeamMembers.queryOptions()
        );
        queryClient.invalidateQueries(
          trpc.commissions.getEmployeeSummary.queryOptions()
        );
        setEditingCell(null);
      },
      onError: () => {
        toast.error(t("admin.management.validation.saveFailed"));
      },
    })
  );

  const getRoleLabel = (role: CommissionRole) => {
    return t(`roles.${role}`);
  };

  const getCommissionValue = (
    userId: string,
    roleType: CommissionRole
  ): number => {
    const member = teamMembers.find((m) => m.id === userId);
    const commission = member?.commissions.find((c) => c.roleType === roleType);
    return commission?.commissionPercentage ?? 0;
  };

  const handleEdit = (userId: string, roleType: CommissionRole) => {
    const currentValue = getCommissionValue(userId, roleType);
    setEditingCell({
      userId,
      roleType,
      value: currentValue.toString(),
    });
  };

  const handleSave = () => {
    if (!editingCell) return;

    const percentage = Number.parseFloat(editingCell.value);

    if (Number.isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error(t("admin.management.validation.invalidPercentage"));
      return;
    }

    updateCommission.mutate({
      userId: editingCell.userId,
      roleType: editingCell.roleType,
      commissionPercentage: percentage,
    });
  };

  const handleCancel = () => {
    setEditingCell(null);
  };

  const isEditing = (userId: string, roleType: CommissionRole) => {
    return (
      editingCell?.userId === userId && editingCell?.roleType === roleType
    );
  };

  const allRoles = [
    CommissionRole.ACCOUNT_MANAGER,
    CommissionRole.CLIENT_ACQUISITION,
    CommissionRole.DEAL_SUPPORT,
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.management.title")}</CardTitle>
        <CardDescription>{t("admin.management.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {teamMembers.length === 0 ? (
          <EmptyView
            title={t("admin.management.emptyState")}
            message={t("admin.management.emptyStateDescription")}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.management.table.employee")}</TableHead>
                  {allRoles.map((role) => (
                    <TableHead key={role} className="text-center">
                      {getRoleLabel(role)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </TableCell>
                    {allRoles.map((role) => (
                      <TableCell key={role} className="text-center">
                        {isEditing(member.id, role) ? (
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={editingCell?.value}
                              onChange={(e) =>
                                setEditingCell({
                                  ...editingCell!,
                                  value: e.target.value,
                                })
                              }
                              className="w-20 text-center"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                if (e.key === "Escape") handleCancel();
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={handleSave}
                              disabled={updateCommission.isPending}
                            >
                              {updateCommission.isPending
                                ? t("admin.management.table.saving")
                                : t("admin.management.table.save")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={updateCommission.isPending}
                            >
                              {t("admin.management.table.cancel")}
                            </Button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEdit(member.id, role)}
                            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                          >
                            <span className="font-mono text-sm">
                              {getCommissionValue(member.id, role)}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({t("admin.management.table.edit")})
                            </span>
                          </button>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
