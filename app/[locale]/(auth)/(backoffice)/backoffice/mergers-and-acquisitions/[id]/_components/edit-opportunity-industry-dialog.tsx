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
    "backofficeMergersAndAcquisitionsOpportunityPage.editOpportunityIndustryDialog",
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

    toast.promise(
      updateOpportunity({
        id: opportunity._id,
        industry: data.industry,
        industrySubsector: data.industrySubsector ?? undefined,
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
                                      `content.industry.${industry.toLowerCase().replace("& ", "and").replace(" ", "")}`,
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
                                      `content.industrySubsector.${industrySubsector.toLowerCase().replace("& ", "and").replace(" ", "")}`,
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
                                      `content.industrySubsector.${industrySubsector.toLowerCase().replace("& ", "and").replace(" ", "")}`,
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

export { EditOpportunityIndustryDialog };
