"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

type ScheduleFollowUpDialogProps = {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ScheduleFollowUpDialog = ({
  leadId,
  open,
  onOpenChange,
}: ScheduleFollowUpDialogProps) => {
  const t = useScopedI18n("crm.leads.followUpDialog");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [note, setNote] = useState("");

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const scheduleFollowUp = useMutation(
    trpc.crm.leads.scheduleFollowUp.mutationOptions({
      onSuccess: () => {
        toast.success(t("success"));
        queryClient.invalidateQueries(
          trpc.crm.leads.getLeads.queryOptions({} as any)
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
    setFollowUpDate("");
    setFollowUpTime("");
    setNote("");
    onOpenChange(false);
  };

  const handleSchedule = () => {
    if (!leadId || !followUpDate) return;

    // Combine date and time into a Date object
    const dateTimeString = followUpTime 
      ? `${followUpDate}T${followUpTime}` 
      : `${followUpDate}T09:00`;
    const dateTime = new Date(dateTimeString);

    scheduleFollowUp.mutate({
      leadId,
      followUpDate: dateTime,
      note: note.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="followUpDate">{t("labels.date")}</Label>
            <Input
              id="followUpDate"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              disabled={scheduleFollowUp.isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="followUpTime">{t("labels.time")}</Label>
            <Input
              id="followUpTime"
              type="time"
              value={followUpTime}
              onChange={(e) => setFollowUpTime(e.target.value)}
              disabled={scheduleFollowUp.isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="followUpNote">{t("labels.note")}</Label>
            <Textarea
              id="followUpNote"
              placeholder={t("placeholders.note")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              disabled={scheduleFollowUp.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={resetAndClose}
            disabled={scheduleFollowUp.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSchedule}
            disabled={!followUpDate || scheduleFollowUp.isPending}
          >
            {scheduleFollowUp.isPending ? t("scheduling") : t("schedule")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
