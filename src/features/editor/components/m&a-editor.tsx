/** biome-ignore-all lint/style/noNestedTernary: This is a complex component */
/** biome-ignore-all lint/style/noMagicNumbers: Ignored */
"use client";

import { EditIcon, EllipsisVerticalIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { ErrorView, LoadingView } from "@/components/entity-components";
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
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { StyledUploadButton } from "@/features/editor/components/styled-upload-button";
import {
  useRemoveOpportunityAssetIncluded,
  useRemoveOpportunityCapexItensity,
  useRemoveOpportunityCashConvertion,
  useRemoveOpportunityCashOnCashReturn,
  useRemoveOpportunityCoInvestment,
  useRemoveOpportunityEbitda,
  useRemoveOpportunityEbitdaCAGR,
  useRemoveOpportunityEbitdaMargin,
  useRemoveOpportunityEbitdaNormalized,
  useRemoveOpportunityEnterpriseValue,
  useRemoveOpportunityEntryMultiple,
  useRemoveOpportunityEquityContribution,
  useRemoveOpportunityEquityValue,
  useRemoveOpportunityEstimatedAssetValue,
  useRemoveOpportunityEvDashEbitdaEntry,
  useRemoveOpportunityEvDashEbitdaExit,
  useRemoveOpportunityExitExpectedMultiple,
  useRemoveOpportunityFcf,
  useRemoveOpportunityGrossIRR,
  useRemoveOpportunityHoldPeriod,
  useRemoveOpportunityIm,
  useRemoveOpportunityImage,
  useRemoveOpportunityIndustry,
  useRemoveOpportunityIndustrySubsector,
  useRemoveOpportunityMoic,
  useRemoveOpportunityNetDebt,
  useRemoveOpportunityNetDebtDashEbitda,
  useRemoveOpportunityNetIRR,
  useRemoveOpportunitySales,
  useRemoveOpportunitySalesCAGR,
  useRemoveOpportunityShareholderStructureImage,
  useRemoveOpportunityType,
  useRemoveOpportunityTypeDetails,
  useRemoveOpportunityWorkingCapitalNeeds,
  useSuspenseOpportunity,
  useUpdateGraphRows,
  useUpdateOpportunityAssetIncluded,
  useUpdateOpportunityCapexItensity,
  useUpdateOpportunityCashConvertion,
  useUpdateOpportunityCashOnCashReturn,
  useUpdateOpportunityCoInvestment,
  useUpdateOpportunityDescription,
  useUpdateOpportunityEbitda,
  useUpdateOpportunityEbitdaCAGR,
  useUpdateOpportunityEbitdaMargin,
  useUpdateOpportunityEbitdaNormalized,
  useUpdateOpportunityEnterpriseValue,
  useUpdateOpportunityEntryMultiple,
  useUpdateOpportunityEquityContribution,
  useUpdateOpportunityEquityValue,
  useUpdateOpportunityEstimatedAssetValue,
  useUpdateOpportunityEvDashEbitdaEntry,
  useUpdateOpportunityEvDashEbitdaExit,
  useUpdateOpportunityExitExpectedMultiple,
  useUpdateOpportunityFcf,
  useUpdateOpportunityGrossIRR,
  useUpdateOpportunityHoldPeriod,
  useUpdateOpportunityIm,
  useUpdateOpportunityImages,
  useUpdateOpportunityIndustry,
  useUpdateOpportunityIndustrySubsector,
  useUpdateOpportunityMoic,
  useUpdateOpportunityNetDebt,
  useUpdateOpportunityNetDebtDashEbitda,
  useUpdateOpportunityNetIRR,
  useUpdateOpportunitySales,
  useUpdateOpportunitySalesCAGR,
  useUpdateOpportunityShareholderStructure,
  useUpdateOpportunityType,
  useUpdateOpportunityTypeDetails,
  useUpdateOpportunityWorkingCapitalNeeds,
} from "@/features/opportunities/hooks/use-m&a-opportunities";
import {
  EbitdaRange,
  Industry,
  IndustrySubsector,
  SalesRange,
  Type,
  TypeDetails,
} from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";

const chartConfig = (t: (key: string) => string, isDark: boolean) =>
  ({
    revenue: {
      label: t("graphCard.table.header.revenue"),
      color: isDark ? "#BECED7" : "#113152",
    },
    ebitda: {
      label: t("graphCard.table.header.ebitda"),
      color: "#4F565A",
    },
    ebitdaMargin: {
      label: t("graphCard.table.header.ebitdaMargin"),
      color: "#9C3E11",
    },
  }) satisfies ChartConfig;

export const EditorLoading = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return <LoadingView message={t("loadingMessage")} />;
};

export const EditorError = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return <ErrorView message={t("errorMessage")} />;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex component
export const Editor = ({ opportunityId }: { opportunityId: string }) => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  const locale = useCurrentLocale();
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);
  const { theme, resolvedTheme } = useTheme();
  const isDark =
    resolvedTheme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Update operations
  const updateDescription = useUpdateOpportunityDescription();
  const updateType = useUpdateOpportunityType();
  const updateTypeDetails = useUpdateOpportunityTypeDetails();
  const updateIndustry = useUpdateOpportunityIndustry();
  const updateIndustrySubsector = useUpdateOpportunityIndustrySubsector();
  const updateSales = useUpdateOpportunitySales();
  const updateEbitda = useUpdateOpportunityEbitda();
  const updateEbitdaNormalized = useUpdateOpportunityEbitdaNormalized();
  const updateNetDebt = useUpdateOpportunityNetDebt();
  const updateSalesCAGR = useUpdateOpportunitySalesCAGR();
  const updateEbitdaCAGR = useUpdateOpportunityEbitdaCAGR();
  const updateAssetIncluded = useUpdateOpportunityAssetIncluded();
  const updateEstimatedAssetValue = useUpdateOpportunityEstimatedAssetValue();
  const updateGraphRows = useUpdateGraphRows();
  const updateImages = useUpdateOpportunityImages();
  const updateIm = useUpdateOpportunityIm();
  const updateEnterpriseValue = useUpdateOpportunityEnterpriseValue();
  const updateEquityValue = useUpdateOpportunityEquityValue();
  const updateShareholderStructure = useUpdateOpportunityShareholderStructure();
  const updateEvDashEbitdaEntry = useUpdateOpportunityEvDashEbitdaEntry();
  const updateEvDashEbitdaExit = useUpdateOpportunityEvDashEbitdaExit();
  const updateEbitdaMargin = useUpdateOpportunityEbitdaMargin();
  const updateFcf = useUpdateOpportunityFcf();
  const updateNetDebtDashEbitda = useUpdateOpportunityNetDebtDashEbitda();
  const updateCapexItensity = useUpdateOpportunityCapexItensity();
  const updateWorkingCapitalNeeds = useUpdateOpportunityWorkingCapitalNeeds();
  const updateCoInvestment = useUpdateOpportunityCoInvestment();
  const updateEquityContribution = useUpdateOpportunityEquityContribution();
  const updateGrossIRR = useUpdateOpportunityGrossIRR();
  const updateCashConvertion = useUpdateOpportunityCashConvertion();
  const updateCashOnCashReturn = useUpdateOpportunityCashOnCashReturn();
  const updateEntryMultiple = useUpdateOpportunityEntryMultiple();
  const updateExitExpectedMultiple = useUpdateOpportunityExitExpectedMultiple();
  const updateHoldPeriod = useUpdateOpportunityHoldPeriod();
  const updateMoic = useUpdateOpportunityMoic();
  const updateNetIRR = useUpdateOpportunityNetIRR();

  // Remove operations
  const removeType = useRemoveOpportunityType();
  const removeTypeDetails = useRemoveOpportunityTypeDetails();
  const removeIndustry = useRemoveOpportunityIndustry();
  const removeIndustrySubsector = useRemoveOpportunityIndustrySubsector();
  const removeSales = useRemoveOpportunitySales();
  const removeEbitda = useRemoveOpportunityEbitda();
  const removeEbitdaNormalized = useRemoveOpportunityEbitdaNormalized();
  const removeNetDebt = useRemoveOpportunityNetDebt();
  const removeSalesCAGR = useRemoveOpportunitySalesCAGR();
  const removeEbitdaCAGR = useRemoveOpportunityEbitdaCAGR();
  const removeAssetIncluded = useRemoveOpportunityAssetIncluded();
  const removeEstimatedAssetValue = useRemoveOpportunityEstimatedAssetValue();
  const removeImage = useRemoveOpportunityImage();
  const removeIm = useRemoveOpportunityIm();
  const removeEnterpriseValue = useRemoveOpportunityEnterpriseValue();
  const removeEquityValue = useRemoveOpportunityEquityValue();
  const removeShareholderStructure =
    useRemoveOpportunityShareholderStructureImage();
  const removeEvDashEbitdaEntry = useRemoveOpportunityEvDashEbitdaEntry();
  const removeEvDashEbitdaExit = useRemoveOpportunityEvDashEbitdaExit();
  const removeEbitdaMargin = useRemoveOpportunityEbitdaMargin();
  const removeFcf = useRemoveOpportunityFcf();
  const removeNetDebtDashEbitda = useRemoveOpportunityNetDebtDashEbitda();
  const removeCapexItensity = useRemoveOpportunityCapexItensity();
  const removeWorkingCapitalNeeds = useRemoveOpportunityWorkingCapitalNeeds();
  const removeCoInvestment = useRemoveOpportunityCoInvestment();
  const removeEquityContribution = useRemoveOpportunityEquityContribution();
  const removeGrossIRR = useRemoveOpportunityGrossIRR();
  const removeCashConvertion = useRemoveOpportunityCashConvertion();
  const removeCashOnCashReturn = useRemoveOpportunityCashOnCashReturn();
  const removeEntryMultiple = useRemoveOpportunityEntryMultiple();
  const removeExitExpectedMultiple = useRemoveOpportunityExitExpectedMultiple();
  const removeHoldPeriod = useRemoveOpportunityHoldPeriod();
  const removeMoic = useRemoveOpportunityMoic();
  const removeNetIRR = useRemoveOpportunityNetIRR();

  return (
    <main className="m-4 flex max-w-screen-xs flex-1 flex-col space-y-6 md:mx-auto md:max-w-screen-xl">
      <h1 className="font-bold text-2xl md:text-4xl">{opportunity.name}</h1>

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
                const currentImages = opportunity.images || [];
                const totalImages = currentImages.length + imageUrls.length;

                // Validate we don't exceed 10 images total
                if (totalImages > 10) {
                  toast.error("Cannot exceed 10 images total");
                  return;
                }

                await updateImages.mutateAsync({
                  id: opportunityId,
                  images: [...currentImages, ...imageUrls],
                });
                toast.success(t("imagesCard.uploadSuccess"));
              }}
              onUploadError={(error: Error) => {
                toast.error(error.message);
              }}
            />
          </CardHeader>
          <CardContent>
            {opportunity.images && opportunity.images.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {opportunity.images.map((imageUrl) => (
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
                        "disabled:opacity-100",
                        "transition-opacity"
                      )}
                      disabled={removeImage.isPending}
                      onClick={() => {
                        removeImage.mutateAsync({
                          id: opportunityId,
                          imageUrl,
                        });
                      }}
                      title="Delete image"
                      type="button"
                    >
                      {removeImage.isPending ? (
                        <div
                          className={cn(
                            "size-6",
                            "rounded-full",
                            "border-2 border-white border-t-transparent",
                            "animate-spin"
                          )}
                        />
                      ) : (
                        <XIcon className="size-6 text-white" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  "border border-dashed",
                  "rounded-lg",
                  "flex flex-col items-center justify-center",
                  "py-12",
                  "border-muted-foreground/50"
                )}
              >
                <p className="text-balance text-muted-foreground text-sm">
                  {t("imagesCard.noImages")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-lg">
              {t("description")}
            </CardTitle>
            <EditorEditButton
              cancelButtonText={t("cancelButtonText")}
              currentValue={
                locale === "en"
                  ? opportunity.englishDescription || ""
                  : opportunity.description || ""
              }
              fieldName="description"
              inputType="textarea"
              onSaveAction={async (value) => {
                if (locale === "en") {
                  await updateDescription.mutateAsync({
                    id: opportunityId,
                    description: value,
                    isEnglish: true,
                  });
                } else {
                  await updateDescription.mutateAsync({
                    id: opportunityId,
                    description: value,
                  });
                }
              }}
              saveButtonText={t("saveButtonText")}
              title={t("editDescription")}
            />
          </CardHeader>
          <CardContent>
            <p className="text-balance text-base">
              {locale === "en"
                ? opportunity.englishDescription
                : opportunity.description}
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-lg">
              {t("financialInformationCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("financialInformationCard.table.header.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("financialInformationCard.table.header.value")}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    {t("financialInformationCard.table.header.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"type"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.body.type.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.type
                      ? t(
                          `financialInformationCard.table.body.type.values.${opportunity.type}`
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.type ?? ""}
                            description={t(
                              "financialInformationCard.table.body.type.description"
                            )}
                            fieldName="type"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateType.mutateAsync({
                                id: opportunityId,
                                type: value as Type,
                              });
                            }}
                            options={[
                              {
                                label: t(
                                  "financialInformationCard.table.body.type.values.BUY_IN"
                                ),
                                value: Type.BUY_IN,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.type.values.BUY_OUT"
                                ),
                                value: Type.BUY_OUT,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.type.values.BUY_IN_BUY_OUT"
                                ),
                                value: Type.BUY_IN_BUY_OUT,
                              },
                            ]}
                            placeholder={t(
                              "financialInformationCard.table.body.type.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.type.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.type === null}
                            onClick={async () => {
                              await removeType.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"typeDetails"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.body.typeDetails.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.typeDetails
                      ? t(
                          `financialInformationCard.table.body.typeDetails.values.${opportunity.typeDetails}`
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.typeDetails ?? ""}
                            description={t(
                              "financialInformationCard.table.body.typeDetails.description"
                            )}
                            fieldName="type"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateTypeDetails.mutateAsync({
                                id: opportunityId,
                                typeDetails: value as TypeDetails,
                              });
                            }}
                            options={[
                              {
                                label: t(
                                  "financialInformationCard.table.body.typeDetails.values.MAIORITARIO"
                                ),
                                value: TypeDetails.MAIORITARIO,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.typeDetails.values.MINORITARIO"
                                ),
                                value: TypeDetails.MINORITARIO,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.typeDetails.values.FULL_OWNERSHIP"
                                ),
                                value: TypeDetails.FULL_OWNERSHIP,
                              },
                            ]}
                            placeholder={t(
                              "financialInformationCard.table.body.typeDetails.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.typeDetails.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.typeDetails === null}
                            onClick={async () => {
                              await removeTypeDetails.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"industry"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.body.industry.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.industry
                      ? t(
                          `financialInformationCard.table.body.industry.values.${opportunity.industry}`
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.industry ?? ""}
                            description={t(
                              "financialInformationCard.table.body.industry.description"
                            )}
                            fieldName="industry"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateIndustry.mutateAsync({
                                id: opportunityId,
                                industry: value as Industry,
                              });
                            }}
                            options={[
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.SERVICES"
                                ),
                                value: Industry.SERVICES,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.TRANSFORMATION_INDUSTRY"
                                ),
                                value: Industry.TRANSFORMATION_INDUSTRY,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.TRADING"
                                ),
                                value: Industry.TRADING,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.ENERGY_INFRASTRUCTURE"
                                ),
                                value: Industry.ENERGY_INFRASTRUCTURE,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.FITNESS"
                                ),
                                value: Industry.FITNESS,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.HEALTHCARE_PHARMACEUTICALS"
                                ),
                                value: Industry.HEALTHCARE_PHARMACEUTICALS,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.IT"
                                ),
                                value: Industry.IT,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.TMT"
                                ),
                                value: Industry.TMT,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industry.values.TRANSPORTS"
                                ),
                                value: Industry.TRANSPORTS,
                              },
                            ]}
                            placeholder={t(
                              "financialInformationCard.table.body.industry.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.industry.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.industry === null}
                            onClick={async () => {
                              await removeIndustry.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"industrySubsector"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "financialInformationCard.table.body.industrySubsector.label"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.industrySubsector
                      ? t(
                          `financialInformationCard.table.body.industrySubsector.values.${opportunity.industrySubsector}`
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.industrySubsector ?? ""}
                            description={t(
                              "financialInformationCard.table.body.industrySubsector.description"
                            )}
                            fieldName="industrySubsector"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateIndustrySubsector.mutateAsync({
                                id: opportunityId,
                                industrySubsector: value as IndustrySubsector,
                              });
                            }}
                            options={[
                              {
                                label: t(
                                  "financialInformationCard.table.body.industrySubsector.values.BUSINESS_SERVICES"
                                ),
                                value: IndustrySubsector.BUSINESS_SERVICES,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industrySubsector.values.FINANCIAL_SERVICES"
                                ),
                                value: IndustrySubsector.FINANCIAL_SERVICES,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industrySubsector.values.CONSTRUCTION_MATERIALS"
                                ),
                                value: IndustrySubsector.CONSTRUCTION_MATERIALS,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industrySubsector.values.FOOD_BEVERAGES"
                                ),
                                value: IndustrySubsector.FOOD_BEVERAGES,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.industrySubsector.values.OTHERS"
                                ),
                                value: IndustrySubsector.OTHERS,
                              },
                            ]}
                            placeholder={t(
                              "financialInformationCard.table.body.industrySubsector.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.industrySubsector.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.industrySubsector === null}
                            onClick={async () => {
                              await removeIndustrySubsector.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"dimension"}>
                  <TableCell className="bg-muted px-6 py-4 font-medium">
                    {t("financialInformationCard.table.body.dimension.label")}
                  </TableCell>
                  <TableCell className="bg-muted px-6 py-4" />
                  <TableCell className="bg-muted px-6 py-4" />
                </TableRow>
                <TableRow key={"sales"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.body.sales.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sales
                      ? t(
                          `financialInformationCard.table.body.sales.values.${opportunity.sales}`
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.sales ?? ""}
                            description={t(
                              "financialInformationCard.table.body.sales.description"
                            )}
                            fieldName="sales"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateSales.mutateAsync({
                                id: opportunityId,
                                sales: value as SalesRange,
                              });
                            }}
                            options={[
                              {
                                label: t(
                                  "financialInformationCard.table.body.sales.values.RANGE_0_5"
                                ),
                                value: SalesRange.RANGE_0_5,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.sales.values.RANGE_5_10"
                                ),
                                value: SalesRange.RANGE_5_10,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.sales.values.RANGE_10_15"
                                ),
                                value: SalesRange.RANGE_10_15,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.sales.values.RANGE_20_30"
                                ),
                                value: SalesRange.RANGE_20_30,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.sales.values.RANGE_30_PLUS"
                                ),
                                value: SalesRange.RANGE_30_PLUS,
                              },
                            ]}
                            placeholder={t(
                              "financialInformationCard.table.body.sales.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.sales.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.sales === null}
                            onClick={async () => {
                              await removeSales.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"ebitda"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.body.ebitda.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitda
                      ? t(
                          `financialInformationCard.table.body.ebitda.values.${opportunity.ebitda}`
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.ebitda ?? ""}
                            description={t(
                              "financialInformationCard.table.body.ebitda.description"
                            )}
                            fieldName="ebitda"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateEbitda.mutateAsync({
                                id: opportunityId,
                                ebitda: value as EbitdaRange,
                              });
                            }}
                            options={[
                              {
                                label: t(
                                  "financialInformationCard.table.body.ebitda.values.RANGE_1_2"
                                ),
                                value: EbitdaRange.RANGE_1_2,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.ebitda.values.RANGE_2_3"
                                ),
                                value: EbitdaRange.RANGE_2_3,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.ebitda.values.RANGE_3_5"
                                ),
                                value: EbitdaRange.RANGE_3_5,
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.ebitda.values.RANGE_5_PLUS"
                                ),
                                value: EbitdaRange.RANGE_5_PLUS,
                              },
                            ]}
                            placeholder={t(
                              "financialInformationCard.table.body.ebitda.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.ebitda.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.ebitda === null}
                            onClick={async () => {
                              await removeEbitda.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"ebitdaNormalized"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "financialInformationCard.table.body.ebitdaNormalized.label"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaNormalized != null
                      ? opportunity.ebitdaNormalized +
                        t(
                          "financialInformationCard.table.body.ebitdaNormalized.units"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.ebitdaNormalized?.toString() || ""
                            }
                            description={t(
                              "financialInformationCard.table.body.ebitdaNormalized.description"
                            )}
                            fieldName="ebitdaNormalized"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEbitdaNormalized.mutateAsync({
                                id: opportunityId,
                                ebitdaNormalized: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "financialInformationCard.table.body.ebitdaNormalized.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.ebitdaNormalized.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.ebitdaNormalized === null}
                            onClick={async () => {
                              await removeEbitdaNormalized.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"netDebt"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.body.netDebt.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netDebt != null
                      ? t(
                          "financialInformationCard.table.body.netDebt.prefix"
                        ) +
                        opportunity.netDebt +
                        t("financialInformationCard.table.body.netDebt.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.netDebt?.toString() || ""}
                            description={t(
                              "financialInformationCard.table.body.netDebt.description"
                            )}
                            fieldName="netDebt"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateNetDebt.mutateAsync({
                                id: opportunityId,
                                netDebt: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "financialInformationCard.table.body.netDebt.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.netDebt.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.netDebt === null}
                            onClick={async () => {
                              await removeNetDebt.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"CAGRs"}>
                  <TableCell className="bg-muted px-6 py-4 font-medium">
                    {t("financialInformationCard.table.body.CAGRs.label")}
                  </TableCell>
                  <TableCell className="bg-muted px-6 py-4" />
                  <TableCell className="bg-muted px-6 py-4" />
                </TableRow>
                <TableRow key={"salesCAGR"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.body.salesCAGR.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.salesCAGR != null
                      ? opportunity.salesCAGR +
                        t("financialInformationCard.table.body.salesCAGR.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.salesCAGR?.toString() || ""
                            }
                            description={t(
                              "financialInformationCard.table.body.salesCAGR.description"
                            )}
                            fieldName="salesCAGR"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateSalesCAGR.mutateAsync({
                                id: opportunityId,
                                salesCAGR: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "financialInformationCard.table.body.salesCAGR.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.salesCAGR.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.salesCAGR === null}
                            onClick={async () => {
                              await removeSalesCAGR.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"ebitdaCAGR"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.body.ebitdaCAGR.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaCAGR != null
                      ? opportunity.ebitdaCAGR +
                        t(
                          "financialInformationCard.table.body.ebitdaCAGR.units"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.ebitdaCAGR?.toString() || ""
                            }
                            description={t(
                              "financialInformationCard.table.body.ebitdaCAGR.description"
                            )}
                            fieldName="ebitdaCAGR"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEbitdaCAGR.mutateAsync({
                                id: opportunityId,
                                ebitdaCAGR: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "financialInformationCard.table.body.ebitdaCAGR.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.ebitdaCAGR.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.ebitdaCAGR === null}
                            onClick={async () => {
                              await removeEbitdaCAGR.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"asset"}>
                  <TableCell className="bg-muted px-6 py-4 font-medium">
                    {t("financialInformationCard.table.body.asset.label")}
                  </TableCell>
                  <TableCell className="bg-muted px-6 py-4" />
                  <TableCell className="bg-muted px-6 py-4" />
                </TableRow>
                <TableRow key={"assetIncluded"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "financialInformationCard.table.body.assetIncluded.label"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.assetIncluded != null
                      ? opportunity.assetIncluded
                        ? t(
                            "financialInformationCard.table.body.assetIncluded.yes"
                          )
                        : t(
                            "financialInformationCard.table.body.assetIncluded.no"
                          )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.assetIncluded?.toString() || ""
                            }
                            description={t(
                              "financialInformationCard.table.body.assetIncluded.description"
                            )}
                            fieldName="assetIncluded"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateAssetIncluded.mutateAsync({
                                id: opportunityId,
                                assetIncluded: value === "true",
                              });
                            }}
                            options={[
                              {
                                label: t(
                                  "financialInformationCard.table.body.assetIncluded.yes"
                                ),
                                value: "true",
                              },
                              {
                                label: t(
                                  "financialInformationCard.table.body.assetIncluded.no"
                                ),
                                value: "false",
                              },
                            ]}
                            placeholder={t(
                              "financialInformationCard.table.body.assetIncluded.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.assetIncluded.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.assetIncluded === null}
                            onClick={async () => {
                              await removeAssetIncluded.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"estimatedAssetValue"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "financialInformationCard.table.body.estimatedAssetValue.label"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.estimatedAssetValue != null
                      ? t(
                          "financialInformationCard.table.body.estimatedAssetValue.prefix"
                        ) +
                        opportunity.estimatedAssetValue +
                        t(
                          "financialInformationCard.table.body.estimatedAssetValue.units"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.estimatedAssetValue?.toString() || ""
                            }
                            description={t(
                              "financialInformationCard.table.body.estimatedAssetValue.description"
                            )}
                            fieldName="estimatedAssetValue"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEstimatedAssetValue.mutateAsync({
                                id: opportunityId,
                                estimatedAssetValue: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "financialInformationCard.table.body.estimatedAssetValue.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "financialInformationCard.table.body.estimatedAssetValue.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.estimatedAssetValue === null}
                            onClick={async () => {
                              await removeEstimatedAssetValue.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-lg" />
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig(t, isDark)}>
              <ComposedChart
                accessibilityLayer
                data={opportunity.graphRows ?? []}
                margin={{
                  left: 50,
                  right: 50,
                  top: 20,
                }}
              >
                <CartesianGrid horizontal={false} vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="year"
                  tickFormatter={(value) => `${value.slice(0, 5)}H`}
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
                  fill={isDark ? "#BECED7" : "#113152"}
                  label={{
                    position: "top",
                    fontSize: 12,
                    fontWeight: 600,
                    fill: isDark ? "#FFFFFF" : "#000000",
                    formatter: (value: number) => value.toFixed(2),
                  }}
                  radius={[4, 4, 0, 0]}
                  yAxisId="left"
                />
                <Line
                  dataKey="ebitda"
                  dot={false}
                  label={{
                    position: "top",
                    fontSize: 12,
                    formatter: (value: number) => value.toFixed(2),
                  }}
                  stroke="#4F565A"
                  strokeWidth={2}
                  type="monotone"
                  yAxisId="right"
                />
                <Line
                  dataKey="ebitdaMargin"
                  dot={{ fill: "#9C3E11", r: 6 }}
                  label={{
                    position: "top",
                    formatter: (value: number) => `${value}%`,
                    fontSize: 12,
                    fontWeight: 600,
                    offset: 10,
                  }}
                  stroke="#9C3E11"
                  strokeWidth={0}
                  type="monotone"
                  yAxisId="margin"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-lg">
              {t("graphCard.title")}
            </CardTitle>
            <Button
              onClick={() => {
                const newRow = {
                  year: new Date().getFullYear().toString(),
                  revenue: 0,
                  ebitda: 0,
                  ebitdaMargin: 0,
                };
                const updatedRows = [...(opportunity.graphRows ?? []), newRow];
                updateGraphRows.mutate({
                  id: opportunity.id,
                  graphRows: updatedRows as {
                    year: string;
                    revenue: number;
                    ebitda: number;
                    ebitdaMargin: number;
                  }[],
                });
              }}
              size="sm"
              variant="outline"
            >
              {t("graphCard.addRowButtonText")}
            </Button>
          </CardHeader>
          <CardContent>
            {opportunity.graphRows && opportunity.graphRows.length > 0 ? (
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>{t("graphCard.table.header.year")}</TableHead>
                    <TableHead className="px-6 py-4 text-right">
                      {t("graphCard.table.header.revenue")}
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right">
                      {t("graphCard.table.header.ebitda")}
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
                  {(
                    opportunity.graphRows as {
                      year: string;
                      revenue: number;
                      ebitda: number;
                      ebitdaMargin: number;
                    }[]
                  ).map((row, index) => (
                    <GraphRowTableRow
                      allRows={
                        opportunity.graphRows as {
                          year: string;
                          revenue: number;
                          ebitda: number;
                          ebitdaMargin: number;
                        }[]
                      }
                      key={`${row.year}-${index}`}
                      onUpdate={(updatedRows) => {
                        updateGraphRows.mutate({
                          id: opportunity.id,
                          graphRows: updatedRows,
                        });
                      }}
                      opportunityId={opportunity.id}
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

      <section>
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-lg">
              {t("shareholderStructureCard.title")}
            </CardTitle>
            <StyledUploadButton
              buttonText={t("shareholderStructureCard.uploadButtonText")}
              endpoint="imageUploader"
              onClientUploadComplete={async (res) => {
                const imageUrls = res.map((file) => file.url);
                const currentImages = opportunity.shareholderStructure || [];
                const totalImages = currentImages.length + imageUrls.length;

                // Validate we don't exceed 10 images total
                if (totalImages > 10) {
                  toast.error("Cannot exceed 10 images total");
                  return;
                }

                await updateShareholderStructure.mutateAsync({
                  id: opportunityId,
                  shareholderStructure: [...currentImages, ...imageUrls],
                });
                toast.success(t("shareholderStructureCard.uploadSuccess"));
              }}
              onUploadError={(error: Error) => {
                toast.error(error.message);
              }}
            />
          </CardHeader>
          <CardContent>
            {opportunity.shareholderStructure &&
            opportunity.shareholderStructure.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {opportunity.shareholderStructure.map((imageUrl) => (
                  <div
                    className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                    key={imageUrl}
                  >
                    <Image
                      alt="Shareholder structure image"
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
                        "disabled:opacity-100",
                        "transition-opacity"
                      )}
                      disabled={removeShareholderStructure.isPending}
                      onClick={() => {
                        removeShareholderStructure.mutateAsync({
                          id: opportunityId,
                          imageUrl,
                        });
                      }}
                      title="Delete shareholder structure image"
                      type="button"
                    >
                      {removeShareholderStructure.isPending ? (
                        <div
                          className={cn(
                            "size-6",
                            "rounded-full",
                            "border-2 border-white border-t-transparent",
                            "animate-spin"
                          )}
                        />
                      ) : (
                        <XIcon className="size-6 text-white" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  "border border-dashed",
                  "rounded-lg",
                  "flex flex-col items-center justify-center",
                  "py-12",
                  "border-muted-foreground/50"
                )}
              >
                <p className="text-balance text-muted-foreground text-sm">
                  {t("shareholderStructureCard.noImages")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-lg">
              {t("postNDACard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("postNDACard.table.header.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("postNDACard.table.header.value")}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    {t("postNDACard.table.header.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"im"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.im.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.im != null ? opportunity.im : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.im?.toString() || ""}
                            description={t(
                              "postNDACard.table.body.im.description"
                            )}
                            fieldName="im"
                            inputType="text"
                            onSaveAction={async (value) => {
                              await updateIm.mutateAsync({
                                id: opportunityId,
                                im: value,
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.im.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.table.body.im.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.im === null}
                            onClick={async () => {
                              await removeIm.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"enterpriseValue"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.enterpriseValue.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entrepriseValue != null
                      ? t("postNDACard.table.body.enterpriseValue.prefix") +
                        opportunity.entrepriseValue +
                        t("postNDACard.table.body.enterpriseValue.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.entrepriseValue?.toString() || ""
                            }
                            description={t(
                              "postNDACard.table.body.enterpriseValue.description"
                            )}
                            fieldName="entrepriseValue"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEnterpriseValue.mutateAsync({
                                id: opportunityId,
                                entrepriseValue: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.enterpriseValue.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.table.body.enterpriseValue.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.entrepriseValue === null}
                            onClick={async () => {
                              await removeEnterpriseValue.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"equityValue"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.equityValue.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityValue != null
                      ? t("postNDACard.table.body.equityValue.prefix") +
                        opportunity.equityValue +
                        t("postNDACard.table.body.equityValue.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.equityValue?.toString() || ""
                            }
                            description={t(
                              "postNDACard.table.body.equityValue.description"
                            )}
                            fieldName="equityValue"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEquityValue.mutateAsync({
                                id: opportunityId,
                                equityValue: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.equityValue.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.table.body.equityValue.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.equityValue === null}
                            onClick={async () => {
                              await removeEquityValue.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"evDashEbitdaEntry"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.evDashEbitdaEntry.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaEntry != null
                      ? opportunity.evDashEbitdaEntry +
                        t("postNDACard.table.body.evDashEbitdaEntry.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.evDashEbitdaEntry?.toString() || ""
                            }
                            description={t(
                              "postNDACard.table.body.evDashEbitdaEntry.description"
                            )}
                            fieldName="evDashEbitdaEntry"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEvDashEbitdaEntry.mutateAsync({
                                id: opportunityId,
                                evDashEbitdaEntry: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.evDashEbitdaEntry.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.table.body.evDashEbitdaEntry.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.evDashEbitdaEntry === null}
                            onClick={async () => {
                              await removeEvDashEbitdaEntry.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"evDashEbitdaExit"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.evDashEbitdaExit.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaExit != null
                      ? opportunity.evDashEbitdaExit +
                        t("postNDACard.table.body.evDashEbitdaExit.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.evDashEbitdaExit?.toString() || ""
                            }
                            description={t(
                              "postNDACard.table.body.evDashEbitdaExit.description"
                            )}
                            fieldName="evDashEbitdaExit"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEvDashEbitdaExit.mutateAsync({
                                id: opportunityId,
                                evDashEbitdaExit: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.evDashEbitdaExit.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.table.body.evDashEbitdaExit.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.evDashEbitdaExit === null}
                            onClick={async () => {
                              await removeEvDashEbitdaExit.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"ebitdaMargin"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.ebitdaMargin.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaMargin != null
                      ? opportunity.ebitdaMargin +
                        t("postNDACard.table.body.ebitdaMargin.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.ebitdaMargin?.toString() || ""
                            }
                            description={t(
                              "postNDACard.table.body.ebitdaMargin.description"
                            )}
                            fieldName="ebitdaMargin"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEbitdaMargin.mutateAsync({
                                id: opportunityId,
                                ebitdaMargin: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.ebitdaMargin.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.table.body.ebitdaMargin.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.ebitdaMargin === null}
                            onClick={async () => {
                              await removeEbitdaMargin.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"fcf"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.fcf.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.fcf != null
                      ? t("postNDACard.table.body.fcf.prefix") +
                        opportunity.fcf +
                        t("postNDACard.table.body.fcf.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.fcf?.toString() || ""}
                            description={t(
                              "postNDACard.table.body.fcf.description"
                            )}
                            fieldName="fcf"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateFcf.mutateAsync({
                                id: opportunityId,
                                fcf: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.fcf.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.table.body.fcf.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.fcf === null}
                            onClick={async () => {
                              await removeFcf.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"netDebtDashEbitda"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.netDebtDashEbitda.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netDebtDashEbitda != null
                      ? opportunity.netDebtDashEbitda +
                        t("postNDACard.table.body.netDebtDashEbitda.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.netDebtDashEbitda?.toString() || ""
                            }
                            description={t(
                              "postNDACard.table.body.netDebtDashEbitda.description"
                            )}
                            fieldName="netDebtDashEbitda"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateNetDebtDashEbitda.mutateAsync({
                                id: opportunityId,
                                netDebtDashEbitda: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.netDebtDashEbitda.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.table.body.netDebtDashEbitda.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.netDebtDashEbitda === null}
                            onClick={async () => {
                              await removeNetDebtDashEbitda.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"capexItensity"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.capexItensity.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexItensity != null
                      ? opportunity.capexItensity +
                        t("postNDACard.table.body.capexItensity.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.capexItensity?.toString() || ""
                            }
                            description={t(
                              "postNDACard.table.body.capexItensity.description"
                            )}
                            fieldName="capexItensity"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateCapexItensity.mutateAsync({
                                id: opportunityId,
                                capexItensity: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.capexItensity.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.table.body.capexItensity.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.capexItensity === null}
                            onClick={async () => {
                              await removeCapexItensity.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"workingCapitalNeeds"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.table.body.workingCapitalNeeds.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.workingCapitalNeeds != null
                      ? opportunity.workingCapitalNeeds +
                        t("postNDACard.table.body.workingCapitalNeeds.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.workingCapitalNeeds?.toString() || ""
                            }
                            description={t(
                              "postNDACard.table.body.workingCapitalNeeds.description"
                            )}
                            fieldName="workingCapitalNeeds"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateWorkingCapitalNeeds.mutateAsync({
                                id: opportunityId,
                                workingCapitalNeeds: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.table.body.workingCapitalNeeds.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.table.body.workingCapitalNeeds.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.workingCapitalNeeds === null}
                            onClick={async () => {
                              await removeWorkingCapitalNeeds.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-lg">
              {t("coInvestmentCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("coInvestmentCard.table.header.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("coInvestmentCard.table.header.value")}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    {t("coInvestmentCard.table.header.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"coInvestment"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.coInvestment.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coInvestment != null
                      ? opportunity.coInvestment
                        ? t("coInvestmentCard.table.body.coInvestment.yes")
                        : t("coInvestmentCard.table.body.coInvestment.no")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.coInvestment?.toString() || ""
                            }
                            description={t(
                              "coInvestmentCard.table.body.coInvestment.description"
                            )}
                            fieldName="coInvestment"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateCoInvestment.mutateAsync({
                                id: opportunityId,
                                coInvestment: value === "true",
                              });
                            }}
                            options={[
                              {
                                label: t(
                                  "coInvestmentCard.table.body.coInvestment.yes"
                                ),
                                value: "true",
                              },
                              {
                                label: t(
                                  "coInvestmentCard.table.body.coInvestment.no"
                                ),
                                value: "false",
                              },
                            ]}
                            placeholder={t(
                              "coInvestmentCard.table.body.coInvestment.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.coInvestment.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.coInvestment === null}
                            onClick={async () => {
                              await removeCoInvestment.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"equityContribution"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.equityContribution.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityContribution != null
                      ? opportunity.equityContribution +
                        t(
                          "coInvestmentCard.table.body.equityContribution.units"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.equityContribution?.toString() || ""
                            }
                            description={t(
                              "coInvestmentCard.table.body.equityContribution.description"
                            )}
                            fieldName="equityContribution"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEquityContribution.mutateAsync({
                                id: opportunityId,
                                equityContribution: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.equityContribution.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.equityContribution.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.equityContribution === null}
                            onClick={async () => {
                              await removeEquityContribution.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"grossIRR"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.grossIRR.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.grossIRR != null
                      ? opportunity.grossIRR +
                        t("coInvestmentCard.table.body.grossIRR.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.grossIRR?.toString() || ""
                            }
                            description={t(
                              "coInvestmentCard.table.body.grossIRR.description"
                            )}
                            fieldName="grossIRR"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateGrossIRR.mutateAsync({
                                id: opportunityId,
                                grossIRR: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.grossIRR.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.grossIRR.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.grossIRR === null}
                            onClick={async () => {
                              await removeGrossIRR.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"netIRR"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.netIRR.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netIRR != null
                      ? opportunity.netIRR +
                        t("coInvestmentCard.table.body.netIRR.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.netIRR?.toString() || ""}
                            description={t(
                              "coInvestmentCard.table.body.netIRR.description"
                            )}
                            fieldName="netIRR"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateNetIRR.mutateAsync({
                                id: opportunityId,
                                netIRR: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.netIRR.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.netIRR.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.netIRR === null}
                            onClick={async () => {
                              await removeNetIRR.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"moic"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.moic.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.moic != null
                      ? opportunity.moic +
                        t("coInvestmentCard.table.body.moic.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={opportunity.moic?.toString() || ""}
                            description={t(
                              "coInvestmentCard.table.body.moic.description"
                            )}
                            fieldName="moic"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateMoic.mutateAsync({
                                id: opportunityId,
                                moic: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.moic.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("coInvestmentCard.table.body.moic.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.moic === null}
                            onClick={async () => {
                              await removeMoic.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"cashOnCashReturn"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.cashOnCashReturn.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashOnCashReturn != null
                      ? opportunity.cashOnCashReturn +
                        t("coInvestmentCard.table.body.cashOnCashReturn.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.cashOnCashReturn?.toString() || ""
                            }
                            description={t(
                              "coInvestmentCard.table.body.cashOnCashReturn.description"
                            )}
                            fieldName="cashOnCashReturn"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateCashOnCashReturn.mutateAsync({
                                id: opportunityId,
                                cashOnCashReturn: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.cashOnCashReturn.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.cashOnCashReturn.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.cashOnCashReturn === null}
                            onClick={async () => {
                              await removeCashOnCashReturn.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"cashConvertion"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.cashConvertion.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashConvertion != null
                      ? opportunity.cashConvertion +
                        t("coInvestmentCard.table.body.cashConvertion.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.cashConvertion?.toString() || ""
                            }
                            description={t(
                              "coInvestmentCard.table.body.cashConvertion.description"
                            )}
                            fieldName="cashConvertion"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateCashConvertion.mutateAsync({
                                id: opportunityId,
                                cashConvertion: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.cashConvertion.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.cashConvertion.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.cashConvertion === null}
                            onClick={async () => {
                              await removeCashConvertion.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"entryMultiple"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.entryMultiple.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entryMultiple != null
                      ? opportunity.entryMultiple +
                        t("coInvestmentCard.table.body.entryMultiple.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.entryMultiple?.toString() || ""
                            }
                            description={t(
                              "coInvestmentCard.table.body.entryMultiple.description"
                            )}
                            fieldName="entryMultiple"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEntryMultiple.mutateAsync({
                                id: opportunityId,
                                entryMultiple: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.entryMultiple.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.entryMultiple.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.entryMultiple === null}
                            onClick={async () => {
                              await removeEntryMultiple.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"exitExpectedMultiple"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "coInvestmentCard.table.body.exitExpectedMultiple.label"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.exitExpectedMultiple != null
                      ? opportunity.exitExpectedMultiple +
                        t(
                          "coInvestmentCard.table.body.exitExpectedMultiple.units"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.exitExpectedMultiple?.toString() || ""
                            }
                            description={t(
                              "coInvestmentCard.table.body.exitExpectedMultiple.description"
                            )}
                            fieldName="exitExpectedMultiple"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateExitExpectedMultiple.mutateAsync({
                                id: opportunityId,
                                exitExpectedMultiple: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.exitExpectedMultiple.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.exitExpectedMultiple.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.exitExpectedMultiple === null}
                            onClick={async () => {
                              await removeExitExpectedMultiple.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"holdPeriod"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentCard.table.body.holdPeriod.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.holdPeriod != null
                      ? opportunity.holdPeriod +
                        " " +
                        t("coInvestmentCard.table.body.holdPeriod.units")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-12 min-w-10 space-y-1"
                      >
                        <DropdownMenuItem asChild>
                          <EditorEditButton
                            cancelButtonText={t("cancelButtonText")}
                            currentValue={
                              opportunity.holdPeriod?.toString() || ""
                            }
                            description={t(
                              "coInvestmentCard.table.body.holdPeriod.description"
                            )}
                            fieldName="holdPeriod"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateHoldPeriod.mutateAsync({
                                id: opportunityId,
                                holdPeriod: Number.parseFloat(value),
                              });
                            }}
                            placeholder={t(
                              "coInvestmentCard.table.body.holdPeriod.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "coInvestmentCard.table.body.holdPeriod.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={opportunity.holdPeriod === null}
                            onClick={async () => {
                              await removeHoldPeriod.mutateAsync({
                                id: opportunityId,
                              });
                            }}
                            size="icon"
                            variant="destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
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
  opportunityId: string;
  rowIndex: number;
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
  allRows,
  onUpdate,
}: GraphRowTableRowProps) => {
  const t = useScopedI18n(
    "backoffice.mergersAndAcquisitionOpportunityPage.graphCard"
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
      <TableCell className="text-right">{row.revenue.toFixed(2)}</TableCell>
      <TableCell className="text-right">{row.ebitda.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        {row.ebitdaMargin.toFixed(2)}%
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

type EditorEditButtonInputType = "text" | "textarea";
type SelectOption = {
  label: string;
  value: string;
};

type EditorEditButtonProps = {
  fieldName: string;
  title: string;
  cancelButtonText?: string;
  saveButtonText?: string;
  currentValue: string;
  onSaveAction: (value: string) => void | Promise<void>;
  inputType?: EditorEditButtonInputType | "select" | "number" | "numberInput";
  placeholder?: string;
  description?: string;
  minHeight?: string;
  options?: SelectOption[];
};

export const EditorEditButton = ({
  fieldName,
  title,
  currentValue,
  onSaveAction,
  cancelButtonText = "Cancel",
  saveButtonText = "Save",
  inputType = "text",
  placeholder,
  description,
  minHeight = "min-h-32",
  options,
}: EditorEditButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedValue, setEditedValue] = useState(currentValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveAction(editedValue);
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedValue(currentValue);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditedValue(currentValue);
    }
  };

  const renderInput = () => {
    if (inputType === "textarea") {
      return (
        <Textarea
          aria-label={fieldName}
          className={minHeight}
          disabled={isSaving}
          onChange={(e) => setEditedValue(e.target.value)}
          placeholder={placeholder}
          value={editedValue}
        />
      );
    }

    if (inputType === "select") {
      return (
        <Select
          onValueChange={(value) => setEditedValue(value)}
          value={editedValue}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (inputType === "number" || inputType === "numberInput") {
      return (
        <Input
          aria-label={fieldName}
          disabled={isSaving}
          onChange={(e) => setEditedValue(e.target.value)}
          placeholder={placeholder}
          step="0.01"
          type="number"
          value={editedValue}
        />
      );
    }

    return (
      <Input
        aria-label={fieldName}
        disabled={isSaving}
        onChange={(e) => setEditedValue(e.target.value)}
        placeholder={placeholder}
        value={editedValue}
      />
    );
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button aria-label={title} size="icon" title={title} variant="outline">
          <EditIcon aria-hidden="true" className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{renderInput()}</div>
        <DialogFooter className="gap-2">
          <Button
            disabled={isSaving}
            onClick={handleCancel}
            type="button"
            variant="outline"
          >
            {cancelButtonText}
          </Button>
          <Button
            disabled={isSaving || editedValue === currentValue}
            onClick={handleSave}
            type="button"
          >
            {isSaving ? <Spinner className="mr-2" /> : saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
