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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

type AddNoteDialogProps = {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddNoteDialog = ({
  leadId,
  open,
  onOpenChange,
}: AddNoteDialogProps) => {
  const t = useScopedI18n("crm.leads.noteDialog");
  const [note, setNote] = useState("");

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const addNote = useMutation(
    trpc.crm.leads.addNote.mutationOptions({
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
    setNote("");
    onOpenChange(false);
  };

  const handleAdd = () => {
    if (!leadId || !note.trim()) return;

    addNote.mutate({
      leadId,
      note: note.trim(),
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
            <Label htmlFor="note">{t("labels.note")}</Label>
            <Textarea
              id="note"
              placeholder={t("placeholders.note")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              disabled={addNote.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={resetAndClose}
            disabled={addNote.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!note.trim() || addNote.isPending}
          >
            {addNote.isPending ? t("adding") : t("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
