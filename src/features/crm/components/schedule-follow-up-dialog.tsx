"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
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
    if (!(leadId && followUpDate)) return;

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
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="followUpDate">{t("labels.date")}</Label>
            <Input
              disabled={scheduleFollowUp.isPending}
              id="followUpDate"
              onChange={(e) => setFollowUpDate(e.target.value)}
              type="date"
              value={followUpDate}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="followUpTime">{t("labels.time")}</Label>
            <Input
              disabled={scheduleFollowUp.isPending}
              id="followUpTime"
              onChange={(e) => setFollowUpTime(e.target.value)}
              type="time"
              value={followUpTime}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="followUpNote">{t("labels.note")}</Label>
            <Textarea
              disabled={scheduleFollowUp.isPending}
              id="followUpNote"
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("placeholders.note")}
              rows={3}
              value={note}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={scheduleFollowUp.isPending}
            onClick={resetAndClose}
            type="button"
            variant="outline"
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={!followUpDate || scheduleFollowUp.isPending}
            onClick={handleSchedule}
            type="button"
          >
            {scheduleFollowUp.isPending ? t("scheduling") : t("schedule")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
