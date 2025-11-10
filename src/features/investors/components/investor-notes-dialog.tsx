"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useScopedI18n } from "@/locales/client";
import { useAddInvestorNote } from "../hooks/use-add-investor-note";
import { useInvestorNotes } from "../hooks/use-investor-notes";

const noteFormSchema = z.object({
  note: z.string().min(1, "Note is required"),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

type InvestorNotesDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  userId: string;
};

export const InvestorNotesDialog = ({
  open,
  onOpenChangeAction,
  userId,
}: InvestorNotesDialogProps) => {
  const t = useScopedI18n("backoffice.investors.notesDialog");
  const { data: notes, isLoading } = useInvestorNotes(userId);
  const addNote = useAddInvestorNote(userId);

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = async (data: NoteFormValues) => {
    try {
      await addNote.mutateAsync({ userId, note: data.note });
      form.reset();
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };

  return (
    <Dialog onOpenChange={onOpenChangeAction} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.note")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("labels.notePlaceholder")}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button disabled={addNote.isPending} type="submit">
                  {addNote.isPending ? t("adding") : t("add")}
                </Button>
              </div>
            </form>
          </Form>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">{t("notesHistory")}</h3>
            {isLoading && <div>{t("loading")}</div>}
            {!isLoading && notes && notes.length > 0 && (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div className="rounded-lg border p-4" key={note.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm">{note.note}</p>
                        <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
                          <span>
                            {t("createdBy")} {note.createdByUser.name}
                          </span>
                          <span>•</span>
                          <span>{format(new Date(note.createdAt), "PPp")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!isLoading && (!notes || notes.length === 0) && (
              <div className="text-center text-muted-foreground text-sm">
                {t("noNotes")}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
