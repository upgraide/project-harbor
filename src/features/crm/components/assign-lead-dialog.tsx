"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

type AssignLeadDialogProps = {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AssignLeadDialog = ({
  leadId,
  open,
  onOpenChange,
}: AssignLeadDialogProps) => {
  const t = useScopedI18n("crm.leads.assignDialog");
  const [assignedToId, setAssignedToId] = useState("");
  const [department, setDepartment] = useState<Department | "">("");

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const { data: teamMembers } = useQuery(
    trpc.crm.leads.getTeamMembers.queryOptions()
  );
  
  const assignLead = useMutation(
    trpc.crm.leads.assign.mutationOptions({
      onSuccess: () => {
        toast.success(t("success"));
        queryClient.invalidateQueries(
          trpc.crm.leads.getMany.queryOptions({} as any)
        );
        if (leadId) {
          queryClient.invalidateQueries(
            trpc.crm.leads.getOne.queryOptions({ id: leadId })
          );
        }
        resetAndClose();
      },
      onError: () => {
        toast.error(t("error"));
      },
    })
  );

  const resetAndClose = () => {
    setAssignedToId("");
    setDepartment("");
    onOpenChange(false);
  };

  const handleAssign = () => {
    if (!leadId || !assignedToId) return;

    assignLead.mutate({
      leadId,
      assignedToId,
      department: department || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="assignTo">{t("labels.assignTo")}</Label>
            <Select value={assignedToId} onValueChange={setAssignedToId}>
              <SelectTrigger id="assignTo">
                <SelectValue placeholder={t("placeholders.selectUser")} />
              </SelectTrigger>
              <SelectContent>
                {teamMembers?.map((member: { id: string; name: string; email: string }) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department">{t("labels.department")}</Label>
            <Select
              value={department}
              onValueChange={(value) => setDepartment(value as Department)}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder={t("placeholders.selectDepartment")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MNA">M&A</SelectItem>
                <SelectItem value="CRE">CRE</SelectItem>
                <SelectItem value="MNA_AND_CRE">M&A & CRE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={resetAndClose}
            disabled={assignLead.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={!assignedToId || assignLead.isPending}
          >
            {assignLead.isPending ? t("assigning") : t("assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
