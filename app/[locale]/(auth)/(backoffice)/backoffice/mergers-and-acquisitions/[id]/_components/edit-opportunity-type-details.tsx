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

const editOpportunityTypeDetailsSchema = z.object({
  typeDetails: z.enum(["Maioritário", "Minoritário", "100%"]).optional(),
});

type MergersAndAcquisitions = Doc<"mergersAndAcquisitions"> | null;

function EditOpportunityTypeDetailsDialog({
  opportunity,
  setOpportunity,
}: {
  opportunity: MergersAndAcquisitions;
  setOpportunity: (opportunity: MergersAndAcquisitions) => void;
}) {
  const t = useScopedI18n(
    "backofficeMergersAndAcquisitionsOpportunityPage.editOpportunityTypeDetailsDialog"
  );
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const form = useForm<z.infer<typeof editOpportunityTypeDetailsSchema>>({
    resolver: zodResolver(editOpportunityTypeDetailsSchema),
    defaultValues: {
      typeDetails: opportunity?.typeDetails ?? undefined,
    },
  });

  useEffect(() => {
    if (opportunity) {
      form.reset({
        typeDetails: opportunity.typeDetails ?? undefined,
      });
    }
  }, [opportunity, form]);

  const onSubmit = (data: z.infer<typeof editOpportunityTypeDetailsSchema>) => {
    if (!opportunity) {
      return;
    }
    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        typeDetails: data.typeDetails,
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
                  name="typeDetails"
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
                            <SelectItem value="Maioritário">
                              {t("majoritarian")}
                            </SelectItem>
                            <SelectItem value="Minoritário">
                              {t("minority")}
                            </SelectItem>
                            <SelectItem value="100%">
                              {t("hundredPercent")}
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

export { EditOpportunityTypeDetailsDialog };
