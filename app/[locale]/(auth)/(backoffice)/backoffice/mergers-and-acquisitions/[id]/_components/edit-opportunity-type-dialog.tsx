import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
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
    "backofficeMergersAndAcquisitionsOpportunityPage.editOpportunityTypeDialog",
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
      },
    );
    setOpportunity(null);
    form.reset();
  };

  return (
    <Dialog open={!!opportunity} onOpenChange={() => setOpportunity(null)}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 bg-sidebar border-b border-foreground/10">
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 px-6 py-4 bg-background">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("label")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
            <DialogFooter className="px-6 py-4 border-t border-foreground/10 bg-sidebar">
              <SubmitButton
                isSubmitting={form.formState.isSubmitting}
                size="lg"
                type="submit"
                className="w-full"
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
