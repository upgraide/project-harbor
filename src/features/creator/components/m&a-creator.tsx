"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOpportunity } from "@/features/opportunities/hooks/use-m&a-opportunities";
import {
  EbitdaRange,
  Industry,
  IndustrySubsector,
  SalesRange,
  Type,
  TypeDetails,
} from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { backofficeMergeAndAcquisitionPath } from "@/paths";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(Type).optional(),
  typeDetails: z.enum(TypeDetails).optional(),
  industry: z.enum(Industry).optional(),
  industrySubsector: z.enum(IndustrySubsector).optional(),
  sales: z.enum(SalesRange).optional(),
  ebitda: z.enum(EbitdaRange).optional(),
  ebitdaNormalized: z.string().optional(),
  netDebt: z.string().optional(),
  salesCAGR: z.string().optional(),
  ebitdaCAGR: z.string().optional(),
  assetIncluded: z.enum(["yes", "no"]).optional(),
  estimatedAssetValue: z.string().optional(),
  preNDANotes: z.string().optional(),
  im: z.string().optional(),
  entrepriseValue: z.string().optional(),
  equityValue: z.string().optional(),
  evDashEbitdaEntry: z.string().optional(),
  evDashEbitdaExit: z.string().optional(),
  ebitdaMargin: z.string().optional(),
  fcf: z.string().optional(),
  netDebtDashEbitda: z.string().optional(),
  capexItensity: z.string().optional(),
  workingCapitalNeeds: z.string().optional(),
  postNDANotes: z.string().optional(),
  coInvestment: z.enum(["yes", "no"]).optional(),
  equityContribution: z.string().optional(),
  grossIRR: z.string().optional(),
  netIRR: z.string().optional(),
  moic: z.string().optional(),
  cashOnCashReturn: z.string().optional(),
  cashConvertion: z.string().optional(),
  entryMultiple: z.string().optional(),
  exitExpectedMultiple: z.string().optional(),
  holdPeriod: z.string().optional(),
});

// Map industries to their allowed subsectors
const industrySubsectorMap: Record<string, IndustrySubsector[]> = {
  [Industry.SERVICES]: [
    IndustrySubsector.BUSINESS_SERVICES,
    IndustrySubsector.FINANCIAL_SERVICES,
    IndustrySubsector.OTHERS,
  ],
  [Industry.TRANSFORMATION_INDUSTRY]: [
    IndustrySubsector.CONSTRUCTION_MATERIALS,
    IndustrySubsector.FOOD_BEVERAGES,
    IndustrySubsector.OTHERS,
  ],
  [Industry.TRADING]: [
    IndustrySubsector.CONSTRUCTION_MATERIALS,
    IndustrySubsector.FOOD_BEVERAGES,
    IndustrySubsector.OTHERS,
  ],
};

type FormValues = z.infer<typeof formSchema>;

export const Creator = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionCreatePage");
  const createOpportunity = useCreateOpportunity();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      ebitdaNormalized: "",
      netDebt: "",
      salesCAGR: "",
      ebitdaCAGR: "",
      estimatedAssetValue: "",
      preNDANotes: "",
      im: "",
      entrepriseValue: "",
      equityValue: "",
      evDashEbitdaEntry: "",
      evDashEbitdaExit: "",
      ebitdaMargin: "",
      fcf: "",
      netDebtDashEbitda: "",
      capexItensity: "",
      workingCapitalNeeds: "",
      postNDANotes: "",
      equityContribution: "",
      grossIRR: "",
      netIRR: "",
      moic: "",
      cashOnCashReturn: "",
      cashConvertion: "",
      entryMultiple: "",
      exitExpectedMultiple: "",
      holdPeriod: "",
    },
  });

  const handleSubmit = async () => {
    try {
      const newOpportunity = await createOpportunity.mutateAsync();

      toast.success("Opportunity created successfully!");
      router.push(
        `${backofficeMergeAndAcquisitionPath()}/${newOpportunity.id}`
      );
    } catch {
      toast.error("Failed to create opportunity");
    }
  };

  return (
    <main className="m-4 flex max-w-screen-xs flex-1 flex-col space-y-6 md:mx-auto md:max-w-screen-xl">
      <h1 className="font-bold text-2xl md:text-4xl">{t("title")}</h1>

      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(() => handleSubmit())}
        >
          {/* Basic Information Card */}
          <section>
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="font-bold text-lg">
                  {t("basicInformationCard.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("basicInformationCard.name.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "basicInformationCard.name.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("basicInformationCard.name.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("basicInformationCard.description.label")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "basicInformationCard.description.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("basicInformationCard.description.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Financial Information (Pre-NDA) Card */}
          <section>
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="font-bold text-lg">
                  {t("financialInformationCard.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("financialInformationCard.table.body.type.label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "financialInformationCard.table.body.type.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(Type).map((entry) => (
                            <SelectItem key={entry[1]} value={entry[1]}>
                              {t(
                                `financialInformationCard.table.body.type.values.${entry[1]}`
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.type.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typeDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "financialInformationCard.table.body.typeDetails.label"
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "financialInformationCard.table.body.typeDetails.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(TypeDetails).map((entry) => (
                            <SelectItem key={entry[1]} value={entry[1]}>
                              {t(
                                `financialInformationCard.table.body.typeDetails.values.${entry[1]}`
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.typeDetails.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "financialInformationCard.table.body.industry.label"
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "financialInformationCard.table.body.industry.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(Industry).map((entry) => (
                            <SelectItem key={entry[1]} value={entry[1]}>
                              {t(
                                `financialInformationCard.table.body.industry.values.${entry[1]}`
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.industry.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(() => {
                  const selectedIndustry = form.watch("industry");
                  const hasSubsectors =
                    selectedIndustry && industrySubsectorMap[selectedIndustry];

                  if (!hasSubsectors) {
                    return null;
                  }

                  return (
                    <FormField
                      control={form.control}
                      name="industrySubsector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "financialInformationCard.table.body.industrySubsector.label"
                            )}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "financialInformationCard.table.body.industrySubsector.placeholder"
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industrySubsectorMap[selectedIndustry]?.map(
                                (subsector) => (
                                  <SelectItem key={subsector} value={subsector}>
                                    {t(
                                      `financialInformationCard.table.body.industrySubsector.values.${subsector}`
                                    )}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t(
                              "financialInformationCard.table.body.industrySubsector.description"
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })()}

                <FormField
                  control={form.control}
                  name="sales"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("financialInformationCard.table.body.sales.label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "financialInformationCard.table.body.sales.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(SalesRange).map((entry) => (
                            <SelectItem key={entry[1]} value={entry[1]}>
                              {t(
                                `financialInformationCard.table.body.sales.values.${entry[1]}`
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.sales.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ebitda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("financialInformationCard.table.body.ebitda.label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "financialInformationCard.table.body.ebitda.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(EbitdaRange).map((entry) => (
                            <SelectItem key={entry[1]} value={entry[1]}>
                              {t(
                                `financialInformationCard.table.body.ebitda.values.${entry[1]}`
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.ebitda.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ebitdaNormalized"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "financialInformationCard.table.body.ebitdaNormalized.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "financialInformationCard.table.body.ebitdaNormalized.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.ebitdaNormalized.description"
                        )}{" "}
                        (
                        {t(
                          "financialInformationCard.table.body.ebitdaNormalized.units"
                        )}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="netDebt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("financialInformationCard.table.body.netDebt.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "financialInformationCard.table.body.netDebt.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.netDebt.description"
                        )}{" "}
                        (
                        {t(
                          "financialInformationCard.table.body.netDebt.prefix"
                        )}
                        {t("financialInformationCard.table.body.netDebt.units")}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salesCAGR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "financialInformationCard.table.body.salesCAGR.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "financialInformationCard.table.body.salesCAGR.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.salesCAGR.description"
                        )}{" "}
                        (
                        {t(
                          "financialInformationCard.table.body.salesCAGR.units"
                        )}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ebitdaCAGR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "financialInformationCard.table.body.ebitdaCAGR.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "financialInformationCard.table.body.ebitdaCAGR.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.ebitdaCAGR.description"
                        )}{" "}
                        (
                        {t(
                          "financialInformationCard.table.body.ebitdaCAGR.units"
                        )}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assetIncluded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "financialInformationCard.table.body.assetIncluded.label"
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "financialInformationCard.table.body.assetIncluded.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">
                            {t(
                              "financialInformationCard.table.body.assetIncluded.yes"
                            )}
                          </SelectItem>
                          <SelectItem value="no">
                            {t(
                              "financialInformationCard.table.body.assetIncluded.no"
                            )}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.assetIncluded.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedAssetValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "financialInformationCard.table.body.estimatedAssetValue.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "financialInformationCard.table.body.estimatedAssetValue.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "financialInformationCard.table.body.estimatedAssetValue.description"
                        )}{" "}
                        (
                        {t(
                          "financialInformationCard.table.body.estimatedAssetValue.prefix"
                        )}
                        {t(
                          "financialInformationCard.table.body.estimatedAssetValue.units"
                        )}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preNDANotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("financialInformationCard.preNDANotes.label")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "financialInformationCard.preNDANotes.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("financialInformationCard.preNDANotes.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Post-NDA Information Card */}
          <section>
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="font-bold text-lg">
                  {t("postNDACard.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="im"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.im.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.im.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.table.body.im.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entrepriseValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.enterpriseValue.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.enterpriseValue.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "postNDACard.table.body.enterpriseValue.description"
                        )}{" "}
                        ({t("postNDACard.table.body.enterpriseValue.prefix")}
                        {t("postNDACard.table.body.enterpriseValue.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equityValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.equityValue.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.equityValue.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.table.body.equityValue.description")} (
                        {t("postNDACard.table.body.equityValue.prefix")}
                        {t("postNDACard.table.body.equityValue.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evDashEbitdaEntry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.evDashEbitdaEntry.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.evDashEbitdaEntry.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "postNDACard.table.body.evDashEbitdaEntry.description"
                        )}{" "}
                        ({t("postNDACard.table.body.evDashEbitdaEntry.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evDashEbitdaExit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.evDashEbitdaExit.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.evDashEbitdaExit.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "postNDACard.table.body.evDashEbitdaExit.description"
                        )}{" "}
                        ({t("postNDACard.table.body.evDashEbitdaExit.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ebitdaMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.ebitdaMargin.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.ebitdaMargin.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.table.body.ebitdaMargin.description")} (
                        {t("postNDACard.table.body.ebitdaMargin.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fcf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.fcf.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.fcf.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.table.body.fcf.description")} (
                        {t("postNDACard.table.body.fcf.prefix")}
                        {t("postNDACard.table.body.fcf.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="netDebtDashEbitda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.netDebtDashEbitda.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.netDebtDashEbitda.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "postNDACard.table.body.netDebtDashEbitda.description"
                        )}{" "}
                        ({t("postNDACard.table.body.netDebtDashEbitda.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capexItensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.capexItensity.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.capexItensity.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.table.body.capexItensity.description")}{" "}
                        ({t("postNDACard.table.body.capexItensity.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingCapitalNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.table.body.workingCapitalNeeds.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.table.body.workingCapitalNeeds.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "postNDACard.table.body.workingCapitalNeeds.description"
                        )}{" "}
                        ({t("postNDACard.table.body.workingCapitalNeeds.units")}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postNDANotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.postNDANotes.label")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "postNDACard.postNDANotes.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.postNDANotes.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Co-Investment Card */}
          <section>
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="font-bold text-lg">
                  {t("coInvestmentCard.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="coInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.table.body.coInvestment.label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "coInvestmentCard.table.body.coInvestment.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">
                            {t("coInvestmentCard.table.body.coInvestment.yes")}
                          </SelectItem>
                          <SelectItem value="no">
                            {t("coInvestmentCard.table.body.coInvestment.no")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.table.body.coInvestment.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equityContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "coInvestmentCard.table.body.equityContribution.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.equityContribution.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.table.body.equityContribution.description"
                        )}{" "}
                        (
                        {t(
                          "coInvestmentCard.table.body.equityContribution.units"
                        )}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grossIRR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.table.body.grossIRR.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.grossIRR.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.table.body.grossIRR.description")}{" "}
                        ({t("coInvestmentCard.table.body.grossIRR.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="netIRR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.table.body.netIRR.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.netIRR.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.table.body.netIRR.description")} (
                        {t("coInvestmentCard.table.body.netIRR.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.table.body.moic.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.moic.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.table.body.moic.description")} (
                        {t("coInvestmentCard.table.body.moic.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cashOnCashReturn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "coInvestmentCard.table.body.cashOnCashReturn.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.cashOnCashReturn.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.table.body.cashOnCashReturn.description"
                        )}{" "}
                        (
                        {t(
                          "coInvestmentCard.table.body.cashOnCashReturn.units"
                        )}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cashConvertion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.table.body.cashConvertion.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.cashConvertion.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.table.body.cashConvertion.description"
                        )}{" "}
                        ({t("coInvestmentCard.table.body.cashConvertion.units")}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entryMultiple"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.table.body.entryMultiple.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.entryMultiple.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.table.body.entryMultiple.description"
                        )}{" "}
                        ({t("coInvestmentCard.table.body.entryMultiple.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exitExpectedMultiple"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "coInvestmentCard.table.body.exitExpectedMultiple.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.exitExpectedMultiple.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.table.body.exitExpectedMultiple.description"
                        )}{" "}
                        (
                        {t(
                          "coInvestmentCard.table.body.exitExpectedMultiple.units"
                        )}
                        )
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="holdPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.table.body.holdPeriod.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.table.body.holdPeriod.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.table.body.holdPeriod.description"
                        )}{" "}
                        ({t("coInvestmentCard.table.body.holdPeriod.units")})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Action Buttons */}
          <section className="flex gap-4">
            <Button disabled={createOpportunity.isPending} type="submit">
              {createOpportunity.isPending
                ? t("creatingButtonText")
                : t("createButtonText")}
            </Button>
            <Button
              onClick={() => router.push(backofficeMergeAndAcquisitionPath())}
              type="button"
              variant="outline"
            >
              {t("cancelButtonText")}
            </Button>
          </section>
        </form>
      </Form>
    </main>
  );
};
