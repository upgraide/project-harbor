"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, EllipsisVerticalIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StyledUploadButton } from "@/features/editor/components/styled-upload-button";
import { cn } from "@/lib/utils";
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
import { UserMultiSelect } from "@/features/users/components/user-multi-select";
import { UserSelect } from "@/features/users/components/user-select";
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

const chartConfig = (t: (key: string) => string) =>
  ({
    revenue: {
      label: t("graphCard.table.header.revenue"),
    },
    revenueFuture: {
      label: t("graphCard.table.header.revenue"),
    },
    ebitda: {
      label: t("graphCard.table.header.ebitda"),
    },
    ebitdaMargin: {
      label: t("graphCard.table.header.ebitdaMargin"),
    },
  }) satisfies ChartConfig;

// Helper to determine if a year is future (projected)
const getYearType = (year: string, currentYear: number = new Date().getFullYear()) => {
  const yearNum = Number.parseInt(year);
  return yearNum >= currentYear ? 'future' : 'historical';
};

// Helper to get CAGR label with dynamic years
const getCAGRLabel = (graphRows: { year: string; revenue: number; ebitda: number; ebitdaMargin: number }[], t: (key: string) => string) => {
  if (!graphRows || graphRows.length < 3) return null;
  const sortedRows = [...graphRows].sort((a, b) => a.year.localeCompare(b.year));
  const firstYear = sortedRows[0].year.slice(2, 4);
  const lastYear = sortedRows[sortedRows.length - 1].year.slice(2, 4);
  return `CAGR Sales ${firstYear}–${lastYear}`;
};

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
  // salesCAGR and ebitdaCAGR removed - now auto-calculated from graph data
  assetIncluded: z.enum(["yes", "no"]).optional(),
  estimatedAssetValue: z.string().optional(),
  preNDANotes: z.string().optional(),
  im: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
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
  clientAcquisitionerId: z.string().optional(),
  accountManagerIds: z.string().array().min(1, "At least 1 account manager is required").max(2, "Maximum 2 account managers allowed"),
  images: z.string().array().optional(),
  graphRows: z.array(
    z.object({
      year: z.string(),
      revenue: z.number(),
      ebitda: z.number(),
      ebitdaMargin: z.number(),
    })
  ).optional(),
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [graphUnit, setGraphUnit] = useState<"millions" | "thousands">("millions");
  
  // Initialize with 3 predefined years: current-1, current, current+1
  const currentYear = new Date().getFullYear();
  const [graphRows, setGraphRows] = useState<
    { year: string; revenue: number; ebitda: number; ebitdaMargin: number }[]
  >([
    { year: `${currentYear - 1}`, revenue: 0, ebitda: 0, ebitdaMargin: 0 },
    { year: `${currentYear}`, revenue: 0, ebitda: 0, ebitdaMargin: 0 },
    { year: `${currentYear + 1}`, revenue: 0, ebitda: 0, ebitdaMargin: 0 },
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      ebitdaNormalized: "",
      netDebt: "",
      // salesCAGR and ebitdaCAGR removed - now auto-calculated
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
      clientAcquisitionerId: "",
      accountManagerIds: [],
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const submitValues = {
        ...values,
        clientAcquisitionerId: values.clientAcquisitionerId || undefined,
        accountManagerIds: values.accountManagerIds?.length
          ? values.accountManagerIds
          : undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        graphRows: graphRows.length > 0 ? graphRows : undefined,
        graphUnit: graphUnit,
      };
      const newOpportunity = await createOpportunity.mutateAsync(submitValues);

      toast.success("Opportunity created successfully!");
      router.push(
        `${backofficeMergeAndAcquisitionPath()}/${newOpportunity.id}`
      );
    } catch {
      toast.error("Failed to create opportunity");
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setUploadedImages((prev) => prev.filter((url) => url !== imageUrl));
  };
  return (
    <main className="flex max-w-screen-xs flex-1 flex-col space-y-6 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
      <h1 className="font-bold text-2xl md:text-4xl">{t("title")}</h1>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Images Upload Section */}
          <section>
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-bold text-lg">
                  {t("imagesCard.title")}
                </CardTitle>
                <StyledUploadButton
                  buttonText={t("imagesCard.uploadButtonText")}
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    const imageUrls = res.map((file) => file.url);
                    const totalImages = uploadedImages.length + imageUrls.length;

                    if (totalImages > 10) {
                      toast.error(t("imagesCard.maxImagesError"));
                      return;
                    }

                    setUploadedImages((prev) => [...prev, ...imageUrls]);
                    toast.success(t("imagesCard.uploadSuccess"));
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message);
                  }}
                />
              </CardHeader>
              <CardContent>
                {uploadedImages.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {uploadedImages.map((imageUrl) => (
                      <div
                        className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                        key={imageUrl}
                      >
                        <Image
                          alt="Opportunity image"
                          className="object-cover"
                          fill
                          src={imageUrl}
                        />
                        <button
                          className={cn(
                            "absolute inset-0",
                            "flex items-center justify-center",
                            "bg-black/50",
                            "opacity-0 group-hover:opacity-100",
                            "transition-opacity"
                          )}
                          onClick={() => handleRemoveImage(imageUrl)}
                          title="Remove image"
                          type="button"
                        >
                          <XIcon className="size-6 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "border border-dashed",
                      "flex min-h-[200px] items-center justify-center",
                      "rounded-lg"
                    )}
                  >
                    <p className="text-muted-foreground text-sm">
                      {t("imagesCard.noImages")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

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

                {/* CAGR fields removed - now auto-calculated from graph data */}

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

          {/* Graph Data Section */}
          <section>
            {graphRows.length > 0 && (
              <Card className="border-none bg-transparent shadow-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-bold text-lg">
                    {t("graphCard.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig(t)}>
                    <ComposedChart
                      accessibilityLayer
                      data={graphRows}
                      margin={{
                        left: 50,
                        right: 50,
                        top: 20,
                        bottom: 40,
                      }}
                    >
                      <CartesianGrid horizontal={false} vertical={false} />
                      <XAxis
                        axisLine={false}
                        dataKey="year"
                        tickFormatter={(value) => {
                          const year = String(value);
                          const yearNum = Number.parseInt(year);
                          const currentYear = new Date().getFullYear();
                          const suffix = yearNum >= currentYear ? 'F' : 'H';
                          return `${year.slice(0, 4)}${suffix}`;
                        }}
                        tickLine={false}
                        tickMargin={8}
                      />
                      <YAxis
                        domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.3)]}
                        hide={true}
                        stroke="#113152"
                        yAxisId="left"
                      />
                      <YAxis
                        domain={[0, 30]}
                        hide={true}
                        orientation="right"
                        stroke="#679A85"
                        tickFormatter={(value) => `${value}M`}
                        yAxisId="right"
                      />
                      <YAxis
                        domain={[-750, 100]}
                        hide={true}
                        orientation="right"
                        stroke="#9C3E11"
                        yAxisId="margin"
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent indicator="line" />}
                        cursor={false}
                      />
                      <Bar
                        dataKey="revenue"
                        fill={isDark ? "#b3a092" : "#123353"}
                        label={{
                          position: "top",
                          fontSize: 12,
                          fontWeight: 600,
                          fill: ((entry: any) => {
                            const yearType = getYearType(String((entry as any)?.year || ''));
                            if (yearType === 'future') return '#e2d8d3';
                            return isDark ? "#b3a092" : "#123353";
                          }) as any,
                          formatter: (value: number) => {
                            const displayValue = graphUnit === 'thousands' ? value * 1000 : value;
                            return Math.round(displayValue).toString();
                          },
                        }}
                        radius={[4, 4, 0, 0]}
                        yAxisId="left"
                      >
                        {graphRows?.map((entry, index) => {
                          const yearType = getYearType(String((entry as any)?.year || ''));
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={yearType === 'future' ? '#e2d8d3' : (isDark ? "#b3a092" : "#123353")}
                            />
                          );
                        })}
                      </Bar>
                      <Line
                        dataKey="ebitda"
                        dot={false}
                        label={{
                          position: "top",
                          fontSize: 12,
                          fill: isDark ? "#BECED7" : "#984016",
                          stroke: "#000000",
                          strokeWidth: 1,
                          paintOrder: "stroke",
                          formatter: (value: number) => {
                            const displayValue = graphUnit === 'thousands' ? value * 1000 : value;
                            return Math.round(displayValue).toString();
                          },
                        }}
                        stroke={isDark ? "#ae9e98" : "#984016"}
                        strokeWidth={2}
                        type="monotone"
                        yAxisId="right"
                      />
                      <Line
                        dataKey="ebitdaMargin"
                        dot={{ fill: isDark ? "#984016" : "#7e9fb0", r: 6 }}
                        label={{
                          position: "top",
                          formatter: (value: number) => `${value}%`,
                          fontSize: 12,
                          fontWeight: 600,
                          fill: isDark ? "#984016" : "#7e9fb0",
                          offset: 10,
                        }}
                        stroke={isDark ? "#984016" : "#7e9fb0"}
                        strokeWidth={0}
                        type="monotone"
                        yAxisId="margin"
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </ComposedChart>
                  </ChartContainer>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t("graphCard.unitLabel")}:</span>
                      <Select value={graphUnit} onValueChange={(value: "millions" | "thousands") => setGraphUnit(value)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="millions">{t("graphCard.millions")}</SelectItem>
                          <SelectItem value="thousands">{t("graphCard.thousands")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {graphRows.length >= 3 && (
                      <div className="text-right text-muted-foreground text-xs">
                        {getCAGRLabel(graphRows, t)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-none bg-transparent shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-bold text-lg">
                  {graphRows.length > 0 ? t("graphCard.table.header.year") + " / " + t("graphCard.table.header.revenue") + " / " + t("graphCard.table.header.ebitda") + " / " + t("graphCard.table.header.ebitdaMargin") : t("graphCard.title")}
                </CardTitle>
                <Button
                  onClick={() => {
                    const newRow = {
                      year: new Date().getFullYear().toString(),
                      revenue: 0,
                      ebitda: 0,
                      ebitdaMargin: 0,
                    };
                    setGraphRows([...graphRows, newRow]);
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {t("graphCard.addRowButtonText")}
                </Button>
              </CardHeader>
              <CardContent>
                {graphRows.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>{t("graphCard.table.header.year")}</TableHead>
                        <TableHead className="px-6 py-4 text-right">
                          {t("graphCard.table.header.revenue")} ({graphUnit === 'millions' ? 'M€' : 'K€'})
                        </TableHead>
                        <TableHead className="px-6 py-4 text-right">
                          {t("graphCard.table.header.ebitda")} ({graphUnit === 'millions' ? 'M€' : 'K€'})
                        </TableHead>
                        <TableHead className="px-6 py-4 text-right">
                          {t("graphCard.table.header.ebitdaMargin")}
                        </TableHead>
                        <TableHead className="px-6 py-4 text-right">
                          {t("graphCard.table.header.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {graphRows.map((row, index) => (
                        <GraphRowTableRow
                          allRows={graphRows}
                          graphUnit={graphUnit}
                          key={`${row.year}-${index}`}
                          onUpdate={(updatedRows) => {
                            setGraphRows(updatedRows);
                          }}
                          row={row}
                          rowIndex={index}
                        />
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    {t("graphCard.noDataMessage")}
                  </div>
                )}
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

          {/* Companion and Account Managers */}
          <section>
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="font-bold text-lg">{t("teamAssignmentCard.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientAcquisitionerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("teamAssignmentCard.clientAcquisitioner.label")}
                      </FormLabel>
                      <FormControl>
                        <UserSelect
                          onValueChange={field.onChange}
                          placeholder={t(
                            "teamAssignmentCard.clientAcquisitioner.placeholder"
                          )}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "teamAssignmentCard.clientAcquisitioner.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountManagerIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("teamAssignmentCard.accountManagers.label")}
                      </FormLabel>
                      <FormControl>
                        <UserMultiSelect
                          action={field.onChange}
                          placeholder={t(
                            "teamAssignmentCard.accountManagers.placeholder"
                          )}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("teamAssignmentCard.accountManagers.description")}
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

type GraphRowTableRowProps = {
  row: {
    year: string;
    revenue: number;
    ebitda: number;
    ebitdaMargin: number;
  };
  rowIndex: number;
  graphUnit: "millions" | "thousands";
  allRows: {
    year: string;
    revenue: number;
    ebitda: number;
    ebitdaMargin: number;
  }[];
  onUpdate: (
    updatedRows: {
      year: string;
      revenue: number;
      ebitda: number;
      ebitdaMargin: number;
    }[]
  ) => void;
};

const GraphRowTableRow = ({
  row,
  rowIndex,
  graphUnit,
  allRows,
  onUpdate,
}: GraphRowTableRowProps) => {
  const t = useScopedI18n(
    "backoffice.mergersAndAcquisitionCreatePage.graphCard"
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedRow, setEditedRow] = useState(row);

  const handleSaveEdit = () => {
    const updatedRows = [...allRows];
    updatedRows[rowIndex] = editedRow;
    onUpdate(updatedRows);
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    const updatedRows = allRows.filter((_, index) => index !== rowIndex);
    onUpdate(updatedRows);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{row.year}</TableCell>
      <TableCell className="text-right">
        {graphUnit === 'thousands' ? Math.round(row.revenue * 1000).toString() : Math.round(row.revenue).toString()}
      </TableCell>
      <TableCell className="text-right">
        {graphUnit === 'thousands' ? Math.round(row.ebitda * 1000).toString() : Math.round(row.ebitda).toString()}
      </TableCell>
      <TableCell className="text-right">
        {Math.round(row.ebitdaMargin)}%
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <EllipsisVerticalIcon className="h-4 w-4" />
              <span className="sr-only">{t("openMenuText")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Dialog onOpenChange={setIsEditOpen} open={isEditOpen}>
                <DialogTrigger asChild>
                  <button
                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                    onClick={(e) => e.stopPropagation()}
                    type="button"
                  >
                    <EditIcon className="mr-2 h-4 w-4" />
                    {t("editButtonText")}
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("editGraphRowTitle")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="font-medium text-sm" htmlFor="year">
                        {t("year")}
                      </label>
                      <Input
                        id="year"
                        onChange={(e) =>
                          setEditedRow({
                            ...editedRow,
                            year: e.target.value,
                          })
                        }
                        type="text"
                        value={editedRow.year}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium text-sm" htmlFor="revenue">
                        {t("revenue")}
                      </label>
                      <Input
                        id="revenue"
                        onChange={(e) =>
                          setEditedRow({
                            ...editedRow,
                            revenue: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                        type="number"
                        value={editedRow.revenue}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium text-sm" htmlFor="ebitda">
                        {t("ebitda")}
                      </label>
                      <Input
                        id="ebitda"
                        onChange={(e) =>
                          setEditedRow({
                            ...editedRow,
                            ebitda: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                        type="number"
                        value={editedRow.ebitda}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="font-medium text-sm"
                        htmlFor="ebitdaMargin"
                      >
                        {t("ebitdaMargin")}
                      </label>
                      <Input
                        id="ebitdaMargin"
                        onChange={(e) =>
                          setEditedRow({
                            ...editedRow,
                            ebitdaMargin:
                              Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        step="0.01"
                        type="number"
                        value={editedRow.ebitdaMargin}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => setIsEditOpen(false)}
                      variant="outline"
                    >
                      {t("cancelButtonText")}
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      {t("saveButtonText")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleDelete}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              {t("deleteButtonText")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
