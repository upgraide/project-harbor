import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SubmitButton } from "@/components/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useScopedI18n } from "@/locales/client";

const editOpportunityTypeSchema = z.object({
  type: z.enum(["Buy In", "Buy Out", "Buy In/Buy Out"]).optional(),
});

function EditOpportunityTypeDialog({
  opportunity,
  setOpportunity,
}: {
  opportunity: Doc<"mergersAndAcquisitions"> | null;
  setOpportunity: (opportunity: Doc<"mergersAndAcquisitions"> | null) => void;
}) {
  const t = useScopedI18n(
    "backofficeMergersAndAcquisitionsOpportunityPage.editOpportunityTypeDialog"
  );
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const form = useForm<z.infer<typeof editOpportunityTypeSchema>>({
    resolver: zodResolver(editOpportunityTypeSchema),
    defaultValues: {
      type: opportunity?.type ?? undefined,
    },
  });

  useEffect(() => {
    if (opportunity) {
      form.reset({
        type: opportunity.type ?? undefined,
      });
    }
  }, [opportunity, form]);

  const onSubmit = (data: z.infer<typeof editOpportunityTypeSchema>) => {
    if (!opportunity) {
      return;
    }
    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        type: data.type,
      }),
      {
        loading: t("toastLoading"),
        success: t("toastSuccess"),
        error: t("toastError"),
      }
    );
    setOpportunity(null);
    form.reset();
  };

  return (
    <Dialog onOpenChange={() => setOpportunity(null)} open={!!opportunity}>
      <DialogContent className="gap-0 overflow-hidden p-0">
        <DialogHeader className="border-foreground/10 border-b bg-sidebar p-6">
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 bg-background px-6 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("label")}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("selectPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Buy In">{t("buyIn")}</SelectItem>
                            <SelectItem value="Buy Out">
                              {t("buyOut")}
                            </SelectItem>
                            <SelectItem value="Buy In/Buy Out">
                              {t("buyInBuyOut")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="border-foreground/10 border-t bg-sidebar px-6 py-4">
              <SubmitButton
                className="w-full"
                isSubmitting={form.formState.isSubmitting}
                size="lg"
                type="submit"
              >
                {t("updateButton")}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { EditOpportunityTypeDialog };
