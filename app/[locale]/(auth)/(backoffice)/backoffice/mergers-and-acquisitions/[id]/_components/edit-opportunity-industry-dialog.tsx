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

const editOpportunityIndustrySchema = z.object({
  industry: z
    .enum([
      "Services",
      "Transformation Industry",
      "Trading",
      "Energy & Infrastructure",
      "Fitness",
      "Healthcare & Pharmaceuticals",
      "IT",
      "TMT (Technology, Media & Telecom)",
      "Transports",
    ])
    .optional(),
  industrySubsector: z
    .enum([
      "Business Services",
      "Financial Services",
      "Construction & Materials",
      "Food & Beverages",
      "Others",
    ])
    .optional(),
});

type MergersAndAcquisitions = Doc<"mergersAndAcquisitions"> | null;

function EditOpportunityIndustryDialog({
  opportunity,
  setOpportunity,
}: {
  opportunity: MergersAndAcquisitions;
  setOpportunity: (opportunity: MergersAndAcquisitions) => void;
}) {
  const t = useScopedI18n(
    "backofficeMergersAndAcquisitionsOpportunityPage.editOpportunityIndustryDialog"
  );
  const updateOpportunity = useMutation(api.mergersAndAcquisitions.update);

  const form = useForm<z.infer<typeof editOpportunityIndustrySchema>>({
    resolver: zodResolver(editOpportunityIndustrySchema),
    defaultValues: {
      industry: opportunity?.industry ?? undefined,
    },
  });

  useEffect(() => {
    if (opportunity) {
      form.reset({
        industry: opportunity.industry ?? undefined,
        industrySubsector: opportunity.industrySubsector ?? undefined,
      });
    }
  }, [opportunity, form]);

  const onSubmit = (data: z.infer<typeof editOpportunityIndustrySchema>) => {
    if (!opportunity) {
      return;
    }

    const shouldClearSubsector =
      data.industry &&
      !(
        data.industry === "Services" ||
        data.industry === "Transformation Industry" ||
        data.industry === "Trading"
      );

    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        industry: data.industry,
        industrySubsector: shouldClearSubsector
          ? null
          : (data.industrySubsector ?? null),
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
                  name="industry"
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
                            {[
                              "Services",
                              "Transformation Industry",
                              "Trading",
                              "Energy & Infrastructure",
                              "Fitness",
                              "Healthcare & Pharmaceuticals",
                              "IT",
                              "TMT (Technology, Media & Telecom)",
                              "Transports",
                            ].map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry ===
                                "TMT (Technology, Media & Telecom)"
                                  ? t("content.industry.tmt")
                                  : t(
                                      `content.industry.${industry.toLowerCase().replace("& ", "and").replace(" ", "")}`
                                    )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("industry") === "Services" && (
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="industrySubsector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("industrySubsectorLabel")}</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t("selectPlaceholder")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Business Services",
                                  "Financial Services",
                                ].map((industrySubsector) => (
                                  <SelectItem
                                    key={industrySubsector}
                                    value={industrySubsector}
                                  >
                                    {t(
                                      `content.industrySubsector.${industrySubsector.toLowerCase().replace("& ", "and").replace(" ", "")}`
                                    )}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {(form.watch("industry") === "Transformation Industry" ||
                  form.watch("industry") === "Trading") && (
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="industrySubsector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("industrySubsectorLabel")}</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t("selectPlaceholder")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Construction & Materials",
                                  "Food & Beverages",
                                  "Others",
                                ].map((industrySubsector) => (
                                  <SelectItem
                                    key={industrySubsector}
                                    value={industrySubsector}
                                  >
                                    {t(
                                      `content.industrySubsector.${industrySubsector.toLowerCase().replace("& ", "and").replace(" ", "")}`
                                    )}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
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

export { EditOpportunityIndustryDialog };
