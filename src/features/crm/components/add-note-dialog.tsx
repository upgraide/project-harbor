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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

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
    if (!(leadId && note.trim())) return;

    addNote.mutate({
      leadId,
      note: note.trim(),
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
            <Label htmlFor="note">{t("labels.note")}</Label>
            <Textarea
              disabled={addNote.isPending}
              id="note"
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("placeholders.note")}
              rows={5}
              value={note}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={addNote.isPending}
            onClick={resetAndClose}
            type="button"
            variant="outline"
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={!note.trim() || addNote.isPending}
            onClick={handleAdd}
            type="button"
          >
            {addNote.isPending ? t("adding") : t("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
