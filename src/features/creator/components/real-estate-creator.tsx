"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { LocationMapPreview } from "@/features/creator/components/location-map-preview";
import { StyledUploadButton } from "@/features/editor/components/styled-upload-button";
import { useCreateRealEstateOpportunity } from "@/features/opportunities/hooks/use-real-estate-opportunities";
import { UserMultiSelect } from "@/features/users/components/user-multi-select";
import { UserSelect } from "@/features/users/components/user-select";
import {
  RealEstateAssetType,
  RealEstateInvestmentType,
} from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { backofficeRealEstatePath } from "@/paths";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  asset: z.enum(RealEstateAssetType).optional(),
  nRoomsLastYear: z.string().optional(),
  noi: z.string().optional(),
  occupancyLastYear: z.string().optional(),
  walt: z.string().optional(),
  nBeds: z.string().optional(),
  investment: z.enum(RealEstateInvestmentType).optional(),
  subRent: z.string().optional(),
  rentPerSqm: z.string().optional(),
  subYield: z.string().optional(),
  capex: z.string().optional(),
  capexPerSqm: z.string().optional(),
  sale: z.string().optional(),
  salePerSqm: z.string().optional(),
  location: z.string().optional(),
  area: z.string().optional(),
  value: z.string().optional(),
  yield: z.string().optional(),
  rent: z.string().optional(),
  gcaAboveGround: z.string().optional(),
  gcaBelowGround: z.string().optional(),
  license: z.string().optional(),
  irr: z.string().optional(),
  coc: z.string().optional(),
  licenseStage: z.string().optional(),
  holdingPeriod: z.string().optional(),
  breakEvenOccupancy: z.string().optional(),
  vacancyRate: z.string().optional(),
  estimatedRentValue: z.string().optional(),
  occupancyRate: z.string().optional(),
  moic: z.string().optional(),
  price: z.string().optional(),
  totalInvestment: z.string().optional(),
  profitOnCost: z.string().optional(),
  profit: z.string().optional(),
  sofCosts: z.string().optional(),
  sellPerSqm: z.string().optional(),
  gdv: z.string().optional(),
  wault: z.string().optional(),
  debtServiceCoverageRatio: z.string().optional(),
  expectedExitYield: z.string().optional(),
  ltv: z.string().optional(),
  ltc: z.string().optional(),
  yieldOnCost: z.string().optional(),
  coInvestment: z.enum(["yes", "no"]).optional(),
  gpEquityValue: z.string().optional(),
  gpEquityPercentage: z.string().optional(),
  totalEquityRequired: z.string().optional(),
  sponsorPresentation: z.string().optional(),
  promoteStructure: z.string().optional(),
  projectIRR: z.string().optional(),
  investorIRR: z.string().optional(),
  coInvestmentHoldPeriod: z.string().optional(),
  coInvestmentBreakEvenOccupancy: z.string().optional(),
  clientAcquisitionerId: z.string().optional(),
  accountManagerIds: z
    .string()
    .array()
    .min(1, "At least 1 account manager is required")
    .max(2, "Maximum 2 account managers allowed"),
  images: z.string().array().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const parseOptionalFloat = (value?: string): number | null =>
  value ? Number.parseFloat(value) : null;

const parseOptionalInt = (value?: string): number | null =>
  value ? Number.parseInt(value, 10) : null;

export const Creator = () => {
  const t = useScopedI18n("backoffice.realEstateCreatePage");
  const createOpportunity = useCreateRealEstateOpportunity();
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showLocationMap, setShowLocationMap] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      license: "",
      licenseStage: "",
      clientAcquisitionerId: "",
      accountManagerIds: [],
    },
  });

  // Watch the selected asset type
  const selectedAsset = form.watch("asset");

  // Determine which fields should be visible based on asset type
  const getVisibleFields = (asset?: string) => {
    const fieldsConfig: Record<string, Set<string>> = {
      AGNOSTIC: new Set(),
      MIXED: new Set(),
      HOSPITALITY: new Set(["nRoomsLastYear", "noi", "occupancyLastYear"]),
      LOGISTICS_AND_INDUSTRIAL: new Set(["walt"]),
      OFFICE: new Set(["walt"]),
      RESIDENTIAL: new Set(),
      SENIOR_LIVING: new Set(["nBeds"]),
      SHOPPING_CENTER: new Set(),
      STREET_RETAIL: new Set(),
      STUDENT_HOUSING: new Set(["nBeds"]),
    };
    return fieldsConfig[asset || ""] || new Set();
  };

  const visibleFields = getVisibleFields(selectedAsset);
  const shouldShowField = (fieldName: string): boolean =>
    visibleFields.size === 0 ? false : visibleFields.has(fieldName);

  // Watch the selected investment strategy
  const selectedInvestment = form.watch("investment");

  // Determine which fields should be visible based on investment strategy
  const getVisibleFieldsForStrategy = (strategy?: string) => {
    const strategyConfig: Record<string, Set<string>> = {
      LEASE_AND_OPERATION: new Set(["rent"]),
      S_AND_L: new Set(["rent", "rentPerSqm", "yield"]),
      CORE: new Set(["rent", "rentPerSqm", "yield"]),
      FIX_AND_FLIP: new Set(["capex", "capexPerSqm", "sale", "salePerSqm"]),
      REFURBISHMENT: new Set(["capex", "capexPerSqm", "sale", "salePerSqm"]),
      VALUE_ADD: new Set(["capex", "capexPerSqm", "sale", "salePerSqm"]),
      OPPORTUNISTIC: new Set(["capex", "capexPerSqm", "sale", "salePerSqm"]),
      DEVELOPMENT: new Set(["capex", "capexPerSqm", "sale", "salePerSqm"]),
    };
    return strategyConfig[strategy || ""] || new Set();
  };

  const visibleStrategyFields = getVisibleFieldsForStrategy(selectedInvestment);
  const shouldShowStrategyField = (fieldName: string): boolean =>
    visibleStrategyFields.has(fieldName);

  const handleSubmit = async (values: FormValues) => {
    try {
      const newOpportunity = (await createOpportunity.mutateAsync({
        name: values.name,
        description: values.description,
        asset: values.asset,
        nRoomsLastYear: parseOptionalInt(values.nRoomsLastYear),
        noi: parseOptionalFloat(values.noi),
        occupancyLastYear: parseOptionalFloat(values.occupancyLastYear),
        walt: parseOptionalFloat(values.walt),
        nBeds: parseOptionalInt(values.nBeds),
        investment: values.investment,
        subRent: parseOptionalFloat(values.subRent),
        rentPerSqm: parseOptionalFloat(values.rentPerSqm),
        subYield: parseOptionalFloat(values.subYield),
        capex: parseOptionalFloat(values.capex),
        capexPerSqm: parseOptionalFloat(values.capexPerSqm),
        sale: parseOptionalFloat(values.sale),
        salePerSqm: parseOptionalFloat(values.salePerSqm),
        location: values.location,
        area: parseOptionalFloat(values.area),
        value: parseOptionalFloat(values.value),
        yield: parseOptionalFloat(values.yield),
        rent: parseOptionalFloat(values.rent),
        gcaAboveGround: parseOptionalFloat(values.gcaAboveGround),
        gcaBelowGround: parseOptionalFloat(values.gcaBelowGround),
        license: values.license,
        irr: parseOptionalFloat(values.irr),
        coc: parseOptionalFloat(values.coc),
        licenseStage: values.licenseStage,
        holdingPeriod: parseOptionalFloat(values.holdingPeriod),
        breakEvenOccupancy: parseOptionalFloat(values.breakEvenOccupancy),
        vacancyRate: parseOptionalFloat(values.vacancyRate),
        estimatedRentValue: parseOptionalFloat(values.estimatedRentValue),
        occupancyRate: parseOptionalFloat(values.occupancyRate),
        moic: parseOptionalFloat(values.moic),
        price: parseOptionalFloat(values.price),
        totalInvestment: parseOptionalFloat(values.totalInvestment),
        profitOnCost: parseOptionalFloat(values.profitOnCost),
        profit: parseOptionalFloat(values.profit),
        sofCosts: parseOptionalFloat(values.sofCosts),
        sellPerSqm: parseOptionalFloat(values.sellPerSqm),
        gdv: parseOptionalFloat(values.gdv),
        wault: parseOptionalFloat(values.wault),
        debtServiceCoverageRatio: parseOptionalFloat(
          values.debtServiceCoverageRatio
        ),
        expectedExitYield: parseOptionalFloat(values.expectedExitYield),
        ltv: parseOptionalFloat(values.ltv),
        ltc: parseOptionalFloat(values.ltc),
        yieldOnCost: parseOptionalFloat(values.yieldOnCost),
        coInvestment: values.coInvestment === "yes",
        gpEquityValue: parseOptionalFloat(values.gpEquityValue),
        gpEquityPercentage: parseOptionalFloat(values.gpEquityPercentage),
        totalEquityRequired: parseOptionalFloat(values.totalEquityRequired),
        sponsorPresentation: values.sponsorPresentation,
        promoteStructure: values.promoteStructure,
        projectIRR: parseOptionalFloat(values.projectIRR),
        investorIRR: parseOptionalFloat(values.investorIRR),
        coInvestmentHoldPeriod: parseOptionalFloat(
          values.coInvestmentHoldPeriod
        ),
        coInvestmentBreakEvenOccupancy: parseOptionalFloat(
          values.coInvestmentBreakEvenOccupancy
        ),
        clientAcquisitionerId: values.clientAcquisitionerId || undefined,
        accountManagerIds: values.accountManagerIds?.length
          ? values.accountManagerIds
          : undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
      })) as unknown as { id: string };

      toast.success("Opportunity created successfully!");
      router.push(`${backofficeRealEstatePath()}/${newOpportunity.id}`);
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
                    const totalImages =
                      uploadedImages.length + imageUrls.length;

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

          {/* Asset and Investment Information (Pre-NDA) Card */}
          <section>
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="font-bold text-lg">
                  {t("assetInformationCard.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="asset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("assetInformationCard.asset.label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "assetInformationCard.asset.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(RealEstateAssetType).map((entry) => (
                            <SelectItem key={entry[1]} value={entry[1]}>
                              {t(
                                `assetInformationCard.asset.values.${entry[1]}`
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t("assetInformationCard.asset.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="investment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("assetInformationCard.investment.label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "assetInformationCard.investment.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(RealEstateInvestmentType).map(
                            (entry) => (
                              <SelectItem key={entry[1]} value={entry[1]}>
                                {t(
                                  `assetInformationCard.investment.values.${entry[1]}`
                                )}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t("assetInformationCard.investment.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("assetInformationCard.location.label")}
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder={t(
                              "assetInformationCard.location.placeholder"
                            )}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          disabled={!field.value}
                          onClick={() => {
                            if (field.value) {
                              setShowLocationMap(!showLocationMap);
                            }
                          }}
                          type="button"
                          variant="outline"
                        >
                          {showLocationMap
                            ? t("assetInformationCard.location.hideMapButton")
                            : t(
                                "assetInformationCard.location.checkLocationButton"
                              )}
                        </Button>
                      </div>
                      <FormDescription>
                        {t("assetInformationCard.location.description")}
                      </FormDescription>
                      <FormMessage />
                      {showLocationMap && field.value && (
                        <LocationMapPreview location={field.value} />
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("assetInformationCard.area.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "assetInformationCard.area.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("assetInformationCard.area.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {shouldShowField("nRoomsLastYear") && (
                  <FormField
                    control={form.control}
                    name="nRoomsLastYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("assetInformationCard.nRoomsLastYear.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "assetInformationCard.nRoomsLastYear.placeholder"
                            )}
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("assetInformationCard.nRoomsLastYear.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("nBeds") && (
                  <FormField
                    control={form.control}
                    name="nBeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("assetInformationCard.nBeds.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "assetInformationCard.nBeds.placeholder"
                            )}
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("assetInformationCard.nBeds.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("noi") && (
                  <FormField
                    control={form.control}
                    name="noi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("assetInformationCard.noi.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "assetInformationCard.noi.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("assetInformationCard.noi.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("occupancyLastYear") && (
                  <FormField
                    control={form.control}
                    name="occupancyLastYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("assetInformationCard.occupancyLastYear.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "assetInformationCard.occupancyLastYear.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "assetInformationCard.occupancyLastYear.description"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowField("walt") && (
                  <FormField
                    control={form.control}
                    name="walt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("assetInformationCard.walt.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "assetInformationCard.walt.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("assetInformationCard.walt.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </section>

          {/* Financial Information - Operational Card */}
          <section>
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="font-bold text-lg">
                  {t("operationalFinancialCard.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="subRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("operationalFinancialCard.subRent.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "operationalFinancialCard.subRent.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("operationalFinancialCard.subRent.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {shouldShowStrategyField("rentPerSqm") && (
                  <FormField
                    control={form.control}
                    name="rentPerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("operationalFinancialCard.rentPerSqm.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "operationalFinancialCard.rentPerSqm.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("operationalFinancialCard.rentPerSqm.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="subYield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("operationalFinancialCard.subYield.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "operationalFinancialCard.subYield.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("operationalFinancialCard.subYield.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("operationalFinancialCard.value.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "operationalFinancialCard.value.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("operationalFinancialCard.value.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {shouldShowStrategyField("yield") && (
                  <FormField
                    control={form.control}
                    name="yield"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("operationalFinancialCard.yield.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "operationalFinancialCard.yield.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("operationalFinancialCard.yield.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowStrategyField("rent") && (
                  <FormField
                    control={form.control}
                    name="rent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("operationalFinancialCard.rent.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "operationalFinancialCard.rent.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("operationalFinancialCard.rent.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="gcaAboveGround"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("operationalFinancialCard.gcaAboveGround.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "operationalFinancialCard.gcaAboveGround.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "operationalFinancialCard.gcaAboveGround.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gcaBelowGround"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("operationalFinancialCard.gcaBelowGround.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "operationalFinancialCard.gcaBelowGround.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "operationalFinancialCard.gcaBelowGround.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {shouldShowStrategyField("capex") && (
                  <FormField
                    control={form.control}
                    name="capex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("operationalFinancialCard.capex.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "operationalFinancialCard.capex.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("operationalFinancialCard.capex.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowStrategyField("capexPerSqm") && (
                  <FormField
                    control={form.control}
                    name="capexPerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("operationalFinancialCard.capexPerSqm.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "operationalFinancialCard.capexPerSqm.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "operationalFinancialCard.capexPerSqm.description"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowStrategyField("sale") && (
                  <FormField
                    control={form.control}
                    name="sale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("operationalFinancialCard.sale.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "operationalFinancialCard.sale.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("operationalFinancialCard.sale.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {shouldShowStrategyField("salePerSqm") && (
                  <FormField
                    control={form.control}
                    name="salePerSqm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("operationalFinancialCard.salePerSqm.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "operationalFinancialCard.salePerSqm.placeholder"
                            )}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("operationalFinancialCard.salePerSqm.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  name="license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.license.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.license.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.license.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licenseStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.licenseStage.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.licenseStage.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.licenseStage.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="irr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.irr.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.irr.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.irr.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.coc.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.coc.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.coc.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="holdingPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.holdingPeriod.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.holdingPeriod.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.holdingPeriod.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breakEvenOccupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.breakEvenOccupancy.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.breakEvenOccupancy.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.breakEvenOccupancy.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vacancyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.vacancyRate.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.vacancyRate.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.vacancyRate.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedRentValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.estimatedRentValue.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.estimatedRentValue.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.estimatedRentValue.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupancyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.occupancyRate.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.occupancyRate.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.occupancyRate.description")}
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
                      <FormLabel>{t("postNDACard.moic.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.moic.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.moic.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.price.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.price.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.price.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.totalInvestment.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.totalInvestment.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.totalInvestment.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profitOnCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.profitOnCost.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.profitOnCost.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.profitOnCost.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.profit.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.profit.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.profit.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sofCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.sofCosts.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.sofCosts.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.sofCosts.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellPerSqm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.sellPerSqm.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.sellPerSqm.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.sellPerSqm.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gdv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.gdv.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.gdv.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.gdv.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wault"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.wault.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.wault.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.wault.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="debtServiceCoverageRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.debtServiceCoverageRatio.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.debtServiceCoverageRatio.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.debtServiceCoverageRatio.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedExitYield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.expectedExitYield.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "postNDACard.expectedExitYield.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.expectedExitYield.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ltv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.ltv.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.ltv.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.ltv.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ltc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postNDACard.ltc.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.ltc.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.ltc.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yieldOnCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("postNDACard.yieldOnCost.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postNDACard.yieldOnCost.placeholder")}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("postNDACard.yieldOnCost.description")}
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
                        {t("coInvestmentCard.coInvestment.label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "coInvestmentCard.coInvestment.placeholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">
                            {t("coInvestmentCard.coInvestment.yes")}
                          </SelectItem>
                          <SelectItem value="no">
                            {t("coInvestmentCard.coInvestment.no")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t("coInvestmentCard.coInvestment.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gpEquityValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.gpEquityValue.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.gpEquityValue.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.gpEquityValue.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gpEquityPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.gpEquityPercentage.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.gpEquityPercentage.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.gpEquityPercentage.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalEquityRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.totalEquityRequired.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.totalEquityRequired.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.totalEquityRequired.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sponsorPresentation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.sponsorPresentation.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.sponsorPresentation.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.sponsorPresentation.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="promoteStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.promoteStructure.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.promoteStructure.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.promoteStructure.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectIRR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.projectIRR.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.projectIRR.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.projectIRR.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="investorIRR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.investorIRR.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.investorIRR.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("coInvestmentCard.investorIRR.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coInvestmentHoldPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("coInvestmentCard.coInvestmentHoldPeriod.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.coInvestmentHoldPeriod.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.coInvestmentHoldPeriod.description"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coInvestmentBreakEvenOccupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "coInvestmentCard.coInvestmentBreakEvenOccupancy.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "coInvestmentCard.coInvestmentBreakEvenOccupancy.placeholder"
                          )}
                          step="0.01"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "coInvestmentCard.coInvestmentBreakEvenOccupancy.description"
                        )}
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
                <CardTitle className="font-bold text-lg">
                  {t("teamAssignmentCard.title")}
                </CardTitle>
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
              onClick={() => router.push(backofficeRealEstatePath())}
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
