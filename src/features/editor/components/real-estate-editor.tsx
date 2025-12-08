"use client";

import { EditIcon, EllipsisVerticalIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useRemoveOpportunityArea,
  useRemoveOpportunityAsset,
  useRemoveOpportunityBreakEvenOccupancy,
  useRemoveOpportunityCapex,
  useRemoveOpportunityCapexPerSqm,
  useRemoveOpportunityCOC,
  useRemoveOpportunityCoInvestment,
  useRemoveOpportunityCoInvestmentBreakEvenOccupancy,
  useRemoveOpportunityCoInvestmentHoldPeriod,
  useRemoveOpportunityDebtServiceCoverageRatio,
  useRemoveOpportunityEstimatedRentValue,
  useRemoveOpportunityExpectedExitYield,
  useRemoveOpportunityGCAAboveGround,
  useRemoveOpportunityGCABelowGround,
  useRemoveOpportunityGDV,
  useRemoveOpportunityGPEquityPercentage,
  useRemoveOpportunityGPEquityValue,
  useRemoveOpportunityHoldingPeriod,
  useRemoveOpportunityImage,
  useRemoveOpportunityInvestment,
  useRemoveOpportunityInvestorIRR,
  useRemoveOpportunityIRR,
  useRemoveOpportunityLicense,
  useRemoveOpportunityLicenseStage,
  useRemoveOpportunityLocation,
  useRemoveOpportunityLTC,
  useRemoveOpportunityLTV,
  useRemoveOpportunityMOIC,
  useRemoveOpportunityNBeds,
  useRemoveOpportunityNOI,
  useRemoveOpportunityNRoomsLastYear,
  useRemoveOpportunityOccupancyLastYear,
  useRemoveOpportunityOccupancyRate,
  useRemoveOpportunityPrice,
  useRemoveOpportunityProfit,
  useRemoveOpportunityProfitOnCost,
  useRemoveOpportunityProjectIRR,
  useRemoveOpportunityPromoteStructure,
  useRemoveOpportunityRent,
  useRemoveOpportunityRentPerSqm,
  useRemoveOpportunitySale,
  useRemoveOpportunitySalePerSqm,
  useRemoveOpportunitySellPerSqm,
  useRemoveOpportunitySofCosts,
  useRemoveOpportunitySponsorPresentation,
  useRemoveOpportunitySubRent,
  useRemoveOpportunitySubYield,
  useRemoveOpportunityTotalEquityRequired,
  useRemoveOpportunityTotalInvestment,
  useRemoveOpportunityVacancyRate,
  useRemoveOpportunityValue,
  useRemoveOpportunityWALT,
  useRemoveOpportunityWAULT,
  useRemoveOpportunityYield,
  useRemoveOpportunityYieldOnCost,
  useSuspenseOpportunity,
  useUpdateOpportunityArea,
  useUpdateOpportunityAsset,
  useUpdateOpportunityBreakEvenOccupancy,
  useUpdateOpportunityCapex,
  useUpdateOpportunityCapexPerSqm,
  useUpdateOpportunityCOC,
  useUpdateOpportunityCoInvestment,
  useUpdateOpportunityCoInvestmentBreakEvenOccupancy,
  useUpdateOpportunityCoInvestmentHoldPeriod,
  useUpdateOpportunityDebtServiceCoverageRatio,
  useUpdateOpportunityDescription,
  useUpdateOpportunityEstimatedRentValue,
  useUpdateOpportunityExpectedExitYield,
  useUpdateOpportunityGCAAboveGround,
  useUpdateOpportunityGCABelowGround,
  useUpdateOpportunityGDV,
  useUpdateOpportunityGPEquityPercentage,
  useUpdateOpportunityGPEquityValue,
  useUpdateOpportunityHoldingPeriod,
  useUpdateOpportunityImages,
  useUpdateOpportunityInvestment,
  useUpdateOpportunityInvestorIRR,
  useUpdateOpportunityIRR,
  useUpdateOpportunityLicense,
  useUpdateOpportunityLicenseStage,
  useUpdateOpportunityLocation,
  useUpdateOpportunityLTC,
  useUpdateOpportunityLTV,
  useUpdateOpportunityMOIC,
  useUpdateOpportunityNBeds,
  useUpdateOpportunityNOI,
  useUpdateOpportunityNRoomsLastYear,
  useUpdateOpportunityOccupancyLastYear,
  useUpdateOpportunityOccupancyRate,
  useUpdateOpportunityPrice,
  useUpdateOpportunityProfit,
  useUpdateOpportunityProfitOnCost,
  useUpdateOpportunityProjectIRR,
  useUpdateOpportunityPromoteStructure,
  useUpdateOpportunityRent,
  useUpdateOpportunityRentPerSqm,
  useUpdateOpportunitySale,
  useUpdateOpportunitySalePerSqm,
  useUpdateOpportunitySellPerSqm,
  useUpdateOpportunitySofCosts,
  useUpdateOpportunitySponsorPresentation,
  useUpdateOpportunitySubRent,
  useUpdateOpportunitySubYield,
  useUpdateOpportunityTotalEquityRequired,
  useUpdateOpportunityTotalInvestment,
  useUpdateOpportunityVacancyRate,
  useUpdateOpportunityValue,
  useUpdateOpportunityWALT,
  useUpdateOpportunityWAULT,
  useUpdateOpportunityYield,
  useUpdateOpportunityYieldOnCost,
} from "@/features/opportunities/hooks/use-real-estate-opportunities";
import {
  RealEstateAssetType,
  RealEstateInvestmentType,
} from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";

export const EditorLoading = () => {
  const t = useScopedI18n("backoffice.realEstateOpportunityPage");
  return <LoadingView message={t("loadingMessage")} />;
};

export const EditorError = () => {
  const t = useScopedI18n("backoffice.realEstateOpportunityPage");
  return <ErrorView message={t("errorMessage")} />;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex component
export const Editor = ({ opportunityId }: { opportunityId: string }) => {
  const t = useScopedI18n("backoffice.realEstateOpportunityPage");
  const locale = useCurrentLocale();
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);

  const getAssetOptions = () =>
    Object.entries(RealEstateAssetType).map(([_, value]) => ({
      label: t(`preNDACard.asset.values.${value}`),
      value,
    }));

  const getInvestmentOptions = () =>
    Object.entries(RealEstateInvestmentType).map(([_, value]) => ({
      label: t(`preNDACard.investment.values.${value}`),
      value,
    }));

  const getDisplayAsset = (value: string | null | undefined) => {
    if (!value) {
      return "N/A";
    }
    return t(`preNDACard.asset.values.${value}` as Parameters<typeof t>[0]);
  };

  const getDisplayInvestment = (value: string | null | undefined) => {
    if (!value) {
      return "N/A";
    }
    return t(
      `preNDACard.investment.values.${value}` as Parameters<typeof t>[0]
    );
  };

  // Update operations
  const updateDescription = useUpdateOpportunityDescription();
  const updateImages = useUpdateOpportunityImages();
  const removeImage = useRemoveOpportunityImage();

  // Pre-NDA fields
  const updateAsset = useUpdateOpportunityAsset();
  const updateNRoomsLastYear = useUpdateOpportunityNRoomsLastYear();
  const updateNOI = useUpdateOpportunityNOI();
  const updateOccupancyLastYear = useUpdateOpportunityOccupancyLastYear();
  const updateWALT = useUpdateOpportunityWALT();
  const updateNBeds = useUpdateOpportunityNBeds();
  const updateInvestment = useUpdateOpportunityInvestment();
  const updateSubRent = useUpdateOpportunitySubRent();
  const updateRentPerSqm = useUpdateOpportunityRentPerSqm();
  const updateSubYield = useUpdateOpportunitySubYield();
  const updateCapex = useUpdateOpportunityCapex();
  const updateCapexPerSqm = useUpdateOpportunityCapexPerSqm();
  const updateSale = useUpdateOpportunitySale();
  const updateSalePerSqm = useUpdateOpportunitySalePerSqm();
  const updateLocation = useUpdateOpportunityLocation();
  const updateArea = useUpdateOpportunityArea();
  const updateValue = useUpdateOpportunityValue();
  const updateYield = useUpdateOpportunityYield();
  const updateRent = useUpdateOpportunityRent();
  const updateGCAAboveGround = useUpdateOpportunityGCAAboveGround();
  const updateGCABelowGround = useUpdateOpportunityGCABelowGround();

  // Remove operations - Pre-NDA fields
  const removeAsset = useRemoveOpportunityAsset();
  const removeNRoomsLastYear = useRemoveOpportunityNRoomsLastYear();
  const removeNOI = useRemoveOpportunityNOI();
  const removeOccupancyLastYear = useRemoveOpportunityOccupancyLastYear();
  const removeWALT = useRemoveOpportunityWALT();
  const removeNBeds = useRemoveOpportunityNBeds();
  const removeInvestment = useRemoveOpportunityInvestment();
  const removeSubRent = useRemoveOpportunitySubRent();
  const removeRentPerSqm = useRemoveOpportunityRentPerSqm();
  const removeSubYield = useRemoveOpportunitySubYield();
  const removeCapex = useRemoveOpportunityCapex();
  const removeCapexPerSqm = useRemoveOpportunityCapexPerSqm();
  const removeSale = useRemoveOpportunitySale();
  const removeSalePerSqm = useRemoveOpportunitySalePerSqm();
  const removeLocation = useRemoveOpportunityLocation();
  const removeArea = useRemoveOpportunityArea();
  const removeValue = useRemoveOpportunityValue();
  const removeYield = useRemoveOpportunityYield();
  const removeRent = useRemoveOpportunityRent();
  const removeGCAAboveGround = useRemoveOpportunityGCAAboveGround();
  const removeGCABelowGround = useRemoveOpportunityGCABelowGround();

  // Post-NDA fields
  const updateLicense = useUpdateOpportunityLicense();
  const updateLicenseStage = useUpdateOpportunityLicenseStage();
  const updateIRR = useUpdateOpportunityIRR();
  const updateCOC = useUpdateOpportunityCOC();
  const updateHoldingPeriod = useUpdateOpportunityHoldingPeriod();
  const updateBreakEvenOccupancy = useUpdateOpportunityBreakEvenOccupancy();
  const updateVacancyRate = useUpdateOpportunityVacancyRate();
  const updateEstimatedRentValue = useUpdateOpportunityEstimatedRentValue();
  const updateOccupancyRate = useUpdateOpportunityOccupancyRate();
  const updateMOIC = useUpdateOpportunityMOIC();
  const updatePrice = useUpdateOpportunityPrice();
  const updateTotalInvestment = useUpdateOpportunityTotalInvestment();
  const updateProfitOnCost = useUpdateOpportunityProfitOnCost();
  const updateProfit = useUpdateOpportunityProfit();
  const updateSofCosts = useUpdateOpportunitySofCosts();
  const updateSellPerSqm = useUpdateOpportunitySellPerSqm();
  const updateGDV = useUpdateOpportunityGDV();
  const updateWAULT = useUpdateOpportunityWAULT();
  const updateDebtServiceCoverageRatio =
    useUpdateOpportunityDebtServiceCoverageRatio();
  const updateExpectedExitYield = useUpdateOpportunityExpectedExitYield();
  const updateLTV = useUpdateOpportunityLTV();
  const updateLTC = useUpdateOpportunityLTC();
  const updateYieldOnCost = useUpdateOpportunityYieldOnCost();

  // Limited Partner fields
  const updateCoInvestment = useUpdateOpportunityCoInvestment();
  const updateGPEquityValue = useUpdateOpportunityGPEquityValue();
  const updateGPEquityPercentage = useUpdateOpportunityGPEquityPercentage();
  const updateTotalEquityRequired = useUpdateOpportunityTotalEquityRequired();
  const updateProjectIRR = useUpdateOpportunityProjectIRR();
  const updateInvestorIRR = useUpdateOpportunityInvestorIRR();
  const updateCoInvestmentHoldPeriod =
    useUpdateOpportunityCoInvestmentHoldPeriod();
  const updateCoInvestmentBreakEvenOccupancy =
    useUpdateOpportunityCoInvestmentBreakEvenOccupancy();
  const updateSponsorPresentation = useUpdateOpportunitySponsorPresentation();
  const updatePromoteStructure = useUpdateOpportunityPromoteStructure();

  const getCoInvestmentStatus = (value: boolean | null | undefined) => {
    if (value === true) {
      return t("limitedPartnerCard.coInvestment.yes");
    }
    if (value === false) {
      return t("limitedPartnerCard.coInvestment.no");
    }
    return "N/A";
  };

  const getCoInvestmentSelectValue = (value: boolean | null | undefined) => {
    if (value === true) {
      return "true";
    }
    if (value === false) {
      return "false";
    }
    return "";
  };

  // Remove operations - Post-NDA fields
  const removeLicense = useRemoveOpportunityLicense();
  const removeLicenseStage = useRemoveOpportunityLicenseStage();
  const removeIRR = useRemoveOpportunityIRR();
  const removeCOC = useRemoveOpportunityCOC();
  const removeHoldingPeriod = useRemoveOpportunityHoldingPeriod();
  const removeBreakEvenOccupancy = useRemoveOpportunityBreakEvenOccupancy();
  const removeVacancyRate = useRemoveOpportunityVacancyRate();
  const removeEstimatedRentValue = useRemoveOpportunityEstimatedRentValue();
  const removeOccupancyRate = useRemoveOpportunityOccupancyRate();
  const removeMOIC = useRemoveOpportunityMOIC();
  const removePrice = useRemoveOpportunityPrice();
  const removeTotalInvestment = useRemoveOpportunityTotalInvestment();
  const removeProfitOnCost = useRemoveOpportunityProfitOnCost();
  const removeProfit = useRemoveOpportunityProfit();
  const removeSofCosts = useRemoveOpportunitySofCosts();
  const removeSellPerSqm = useRemoveOpportunitySellPerSqm();
  const removeGDV = useRemoveOpportunityGDV();
  const removeWAULT = useRemoveOpportunityWAULT();
  const removeDebtServiceCoverageRatio =
    useRemoveOpportunityDebtServiceCoverageRatio();
  const removeExpectedExitYield = useRemoveOpportunityExpectedExitYield();
  const removeLTV = useRemoveOpportunityLTV();
  const removeLTC = useRemoveOpportunityLTC();
  const removeYieldOnCost = useRemoveOpportunityYieldOnCost();

  // Remove operations - Limited Partner fields
  const removeCoInvestment = useRemoveOpportunityCoInvestment();
  const removeGPEquityValue = useRemoveOpportunityGPEquityValue();
  const removeGPEquityPercentage = useRemoveOpportunityGPEquityPercentage();
  const removeTotalEquityRequired = useRemoveOpportunityTotalEquityRequired();
  const removeProjectIRR = useRemoveOpportunityProjectIRR();
  const removeInvestorIRR = useRemoveOpportunityInvestorIRR();
  const removeCoInvestmentHoldPeriod =
    useRemoveOpportunityCoInvestmentHoldPeriod();
  const removeCoInvestmentBreakEvenOccupancy =
    useRemoveOpportunityCoInvestmentBreakEvenOccupancy();
  const removeSponsorPresentation = useRemoveOpportunitySponsorPresentation();
  const removePromoteStructure = useRemoveOpportunityPromoteStructure();

  return (
    <main className="flex max-w-screen-xs flex-1 flex-col space-y-6 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
      <h1 className="font-bold text-2xl md:text-4xl">{opportunity.name}</h1>

      {opportunity.status === "CONCLUDED" && opportunity.analytics && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">
              Concluded Deal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Final Amount</p>
              <p className="text-2xl font-bold">
                {opportunity.analytics.final_amount ? new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(opportunity.analytics.final_amount) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Closing Date</p>
              <p className="text-lg">
                {opportunity.analytics.closed_at ? new Date(opportunity.analytics.closed_at).toLocaleDateString(locale) : "N/A"}
              </p>
            </div>
            {opportunity.analytics.invested_person && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invested Person</p>
                <p className="text-base">
                  {opportunity.analytics.invested_person.name} ({opportunity.analytics.invested_person.email})
                </p>
              </div>
            )}
            {opportunity.analytics.followup_person && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Follow-up Person</p>
                <p className="text-base">
                  {opportunity.analytics.followup_person.name} ({opportunity.analytics.followup_person.email})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(opportunity.clientAcquisitioner ||
        (opportunity.accountManagers &&
          opportunity.accountManagers.length > 0)) && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("teamAssignmentCard.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {opportunity.clientAcquisitioner && (
                <div>
                  <h3 className="mb-1 font-medium text-muted-foreground text-sm">
                    {t("teamAssignmentCard.clientAcquisitioner.label")}
                  </h3>
                  <p className="text-base">
                    {opportunity.clientAcquisitioner.name} ({opportunity.clientAcquisitioner.email})
                  </p>
                </div>
              )}
              {opportunity.accountManagers &&
                opportunity.accountManagers.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-muted-foreground text-sm">
                      {t("teamAssignmentCard.accountManagers.label")}
                    </h3>
                    <ul className="space-y-1">
                      {opportunity.accountManagers.map((manager) => (
                        <li className="text-base" key={manager.id}>
                          {manager.name} ({manager.email})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>
        </section>
      )}

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

                if (totalImages > 10) {
                  toast.error(t("imagesCard.maxImagesError"));
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
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              {t("preNDACard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("preNDACard.table.header.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("preNDACard.table.header.value")}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    {t("preNDACard.table.header.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key="asset">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.asset.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getDisplayAsset(opportunity.asset)}
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
                            currentValue={opportunity.asset ?? ""}
                            description={t("preNDACard.asset.description")}
                            fieldName="asset"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateAsset.mutateAsync({
                                id: opportunityId,
                                asset: value as RealEstateAssetType,
                              });
                            }}
                            options={getAssetOptions()}
                            placeholder={t("preNDACard.asset.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.asset.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.asset === null ||
                              removeAsset.isPending
                            }
                            onClick={async () => {
                              await removeAsset.mutateAsync({
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

                <TableRow key="nRoomsLastYear">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.nRoomsLastYear.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.nRoomsLastYear ?? "N/A"}
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
                              opportunity.nRoomsLastYear?.toString() || ""
                            }
                            description={t(
                              "preNDACard.nRoomsLastYear.description"
                            )}
                            fieldName="nRoomsLastYear"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateNRoomsLastYear.mutateAsync({
                                id: opportunityId,
                                nRoomsLastYear: Number(value),
                              });
                            }}
                            placeholder={t(
                              "preNDACard.nRoomsLastYear.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.nRoomsLastYear.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.nRoomsLastYear === null ||
                              removeNRoomsLastYear.isPending
                            }
                            onClick={async () => {
                              await removeNRoomsLastYear.mutateAsync({
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

                <TableRow key="noi">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.noi.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.noi != null
                      ? t("preNDACard.noi.prefix") +
                        opportunity.noi +
                        t("preNDACard.noi.units")
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
                            currentValue={opportunity.noi?.toString() || ""}
                            description={t("preNDACard.noi.description")}
                            fieldName="noi"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateNOI.mutateAsync({
                                id: opportunityId,
                                noi: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.noi.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.noi.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.noi === null || removeNOI.isPending
                            }
                            onClick={async () => {
                              await removeNOI.mutateAsync({
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

                <TableRow key="occupancyLastYear">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.occupancyLastYear.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.occupancyLastYear
                      ? opportunity.occupancyLastYear +
                        t("preNDACard.occupancyLastYear.units")
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
                              opportunity.occupancyLastYear?.toString() || ""
                            }
                            description={t(
                              "preNDACard.occupancyLastYear.description"
                            )}
                            fieldName="occupancyLastYear"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateOccupancyLastYear.mutateAsync({
                                id: opportunityId,
                                occupancyLastYear: Number(value),
                              });
                            }}
                            placeholder={t(
                              "preNDACard.occupancyLastYear.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.occupancyLastYear.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.occupancyLastYear === null ||
                              removeOccupancyLastYear.isPending
                            }
                            onClick={async () => {
                              await removeOccupancyLastYear.mutateAsync({
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

                <TableRow key="walt">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.walt.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.walt
                      ? opportunity.walt + t("preNDACard.walt.units")
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
                            currentValue={opportunity.walt?.toString() || ""}
                            description={t("preNDACard.walt.description")}
                            fieldName="walt"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateWALT.mutateAsync({
                                id: opportunityId,
                                walt: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.walt.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.walt.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.walt === null || removeWALT.isPending
                            }
                            onClick={async () => {
                              await removeWALT.mutateAsync({
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

                <TableRow key="nbeds">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.nBeds.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.nBeds ?? "N/A"}
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
                            currentValue={opportunity.nBeds?.toString() || ""}
                            description={t("preNDACard.nBeds.description")}
                            fieldName="nBeds"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateNBeds.mutateAsync({
                                id: opportunityId,
                                nBeds: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.nBeds.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.nBeds.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.nBeds === null ||
                              removeNBeds.isPending
                            }
                            onClick={async () => {
                              await removeNBeds.mutateAsync({
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

                <TableRow key="investment">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.investment.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getDisplayInvestment(opportunity.investment)}
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
                            currentValue={opportunity.investment ?? ""}
                            description={t("preNDACard.investment.description")}
                            fieldName="investment"
                            inputType="select"
                            onSaveAction={async (value) => {
                              await updateInvestment.mutateAsync({
                                id: opportunityId,
                                investment: value as RealEstateInvestmentType,
                              });
                            }}
                            options={getInvestmentOptions()}
                            placeholder={t("preNDACard.investment.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.investment.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.investment === null ||
                              removeInvestment.isPending
                            }
                            onClick={async () => {
                              await removeInvestment.mutateAsync({
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

                <TableRow key="subRent">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.subRent.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.subRent != null
                      ? t("preNDACard.subRent.prefix") +
                        opportunity.subRent +
                        t("preNDACard.subRent.units")
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
                            currentValue={opportunity.subRent?.toString() || ""}
                            description={t("preNDACard.subRent.description")}
                            fieldName="subRent"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateSubRent.mutateAsync({
                                id: opportunityId,
                                subRent: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.subRent.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.subRent.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.subRent === null ||
                              removeSubRent.isPending
                            }
                            onClick={async () => {
                              await removeSubRent.mutateAsync({
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

                <TableRow key="rentPerSqm">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.rentPerSqm.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.rentPerSqm != null
                      ? t("preNDACard.rentPerSqm.prefix") +
                        opportunity.rentPerSqm +
                        t("preNDACard.rentPerSqm.units")
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
                              opportunity.rentPerSqm?.toString() || ""
                            }
                            description={t("preNDACard.rentPerSqm.description")}
                            fieldName="rentPerSqm"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateRentPerSqm.mutateAsync({
                                id: opportunityId,
                                rentPerSqm: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.rentPerSqm.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.rentPerSqm.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.rentPerSqm === null ||
                              removeRentPerSqm.isPending
                            }
                            onClick={async () => {
                              await removeRentPerSqm.mutateAsync({
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

                <TableRow key="subYield">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.subYield.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.subYield
                      ? opportunity.subYield + t("preNDACard.subYield.units")
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
                              opportunity.subYield?.toString() || ""
                            }
                            description={t("preNDACard.subYield.description")}
                            fieldName="subYield"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateSubYield.mutateAsync({
                                id: opportunityId,
                                subYield: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.subYield.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.subYield.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.subYield === null ||
                              removeSubYield.isPending
                            }
                            onClick={async () => {
                              await removeSubYield.mutateAsync({
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

                <TableRow key="capex">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.capex.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capex != null
                      ? t("preNDACard.capex.prefix") +
                        opportunity.capex +
                        t("preNDACard.capex.units")
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
                            currentValue={opportunity.capex?.toString() || ""}
                            description={t("preNDACard.capex.description")}
                            fieldName="capex"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateCapex.mutateAsync({
                                id: opportunityId,
                                capex: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.capex.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.capex.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.capex === null ||
                              removeCapex.isPending
                            }
                            onClick={async () => {
                              await removeCapex.mutateAsync({
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

                <TableRow key="capexPerSqm">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.capexPerSqm.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexPerSqm != null
                      ? t("preNDACard.capexPerSqm.prefix") +
                        opportunity.capexPerSqm +
                        t("preNDACard.capexPerSqm.units")
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
                              opportunity.capexPerSqm?.toString() || ""
                            }
                            description={t(
                              "preNDACard.capexPerSqm.description"
                            )}
                            fieldName="capexPerSqm"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateCapexPerSqm.mutateAsync({
                                id: opportunityId,
                                capexPerSqm: Number(value),
                              });
                            }}
                            placeholder={t(
                              "preNDACard.capexPerSqm.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.capexPerSqm.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.capexPerSqm === null ||
                              removeCapexPerSqm.isPending
                            }
                            onClick={async () => {
                              await removeCapexPerSqm.mutateAsync({
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

                <TableRow key="sale">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.sale.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sale != null
                      ? t("preNDACard.sale.prefix") +
                        opportunity.sale +
                        t("preNDACard.sale.units")
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
                            currentValue={opportunity.sale?.toString() || ""}
                            description={t("preNDACard.sale.description")}
                            fieldName="sale"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateSale.mutateAsync({
                                id: opportunityId,
                                sale: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.sale.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.sale.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.sale === null || removeSale.isPending
                            }
                            onClick={async () => {
                              await removeSale.mutateAsync({
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

                <TableRow key="salePerSqm">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.salePerSqm.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.salePerSqm != null
                      ? t("preNDACard.salePerSqm.prefix") +
                        opportunity.salePerSqm +
                        t("preNDACard.salePerSqm.units")
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
                              opportunity.salePerSqm?.toString() || ""
                            }
                            description={t("preNDACard.salePerSqm.description")}
                            fieldName="salePerSqm"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateSalePerSqm.mutateAsync({
                                id: opportunityId,
                                salePerSqm: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.salePerSqm.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.salePerSqm.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.salePerSqm === null ||
                              removeSalePerSqm.isPending
                            }
                            onClick={async () => {
                              await removeSalePerSqm.mutateAsync({
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

                <TableRow key="location">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.location.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.location ?? "N/A"}
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
                            currentValue={opportunity.location || ""}
                            description={t("preNDACard.location.description")}
                            fieldName="location"
                            inputType="text"
                            onSaveAction={async (value) => {
                              await updateLocation.mutateAsync({
                                id: opportunityId,
                                location: value,
                              });
                            }}
                            placeholder={t("preNDACard.location.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.location.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.location === null ||
                              removeLocation.isPending
                            }
                            onClick={async () => {
                              await removeLocation.mutateAsync({
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

                <TableRow key="area">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.area.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.area != null
                      ? opportunity.area + t("preNDACard.area.units")
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
                            currentValue={opportunity.area?.toString() || ""}
                            description={t("preNDACard.area.description")}
                            fieldName="area"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateArea.mutateAsync({
                                id: opportunityId,
                                area: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.area.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.area.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.area === null || removeArea.isPending
                            }
                            onClick={async () => {
                              await removeArea.mutateAsync({
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

                <TableRow key="value">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.value.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.value != null
                      ? t("preNDACard.value.prefix") +
                        opportunity.value +
                        t("preNDACard.value.units")
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
                            currentValue={opportunity.value?.toString() || ""}
                            description={t("preNDACard.value.description")}
                            fieldName="value"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateValue.mutateAsync({
                                id: opportunityId,
                                value: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.value.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.value.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.value === null ||
                              removeValue.isPending
                            }
                            onClick={async () => {
                              await removeValue.mutateAsync({
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

                <TableRow key="yield">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.yield.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.yield
                      ? opportunity.yield + t("preNDACard.yield.units")
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
                            currentValue={opportunity.yield?.toString() || ""}
                            description={t("preNDACard.yield.description")}
                            fieldName="yield"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateYield.mutateAsync({
                                id: opportunityId,
                                yield: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.yield.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.yield.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.yield === null ||
                              removeYield.isPending
                            }
                            onClick={async () => {
                              await removeYield.mutateAsync({
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

                <TableRow key="rent">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.rent.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.rent != null
                      ? t("preNDACard.rent.prefix") +
                        opportunity.rent +
                        t("preNDACard.rent.units")
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
                            currentValue={opportunity.rent?.toString() || ""}
                            description={t("preNDACard.rent.description")}
                            fieldName="rent"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateRent.mutateAsync({
                                id: opportunityId,
                                rent: Number(value),
                              });
                            }}
                            placeholder={t("preNDACard.rent.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.rent.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.rent === null || removeRent.isPending
                            }
                            onClick={async () => {
                              await removeRent.mutateAsync({
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

                <TableRow key="gcaAboveGround">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.gcaAboveGround.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gcaAboveGround != null
                      ? opportunity.gcaAboveGround +
                        t("preNDACard.gcaAboveGround.units")
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
                              opportunity.gcaAboveGround?.toString() || ""
                            }
                            description={t(
                              "preNDACard.gcaAboveGround.description"
                            )}
                            fieldName="gcaAboveGround"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateGCAAboveGround.mutateAsync({
                                id: opportunityId,
                                gcaAboveGround: Number(value),
                              });
                            }}
                            placeholder={t(
                              "preNDACard.gcaAboveGround.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.gcaAboveGround.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.gcaAboveGround === null ||
                              removeGCAAboveGround.isPending
                            }
                            onClick={async () => {
                              await removeGCAAboveGround.mutateAsync({
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

                <TableRow key="gcaBelowGround">
                  <TableCell className="px-6 py-4">
                    {t("preNDACard.gcaBelowGround.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gcaBelowGround != null
                      ? opportunity.gcaBelowGround +
                        t("preNDACard.gcaBelowGround.units")
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
                              opportunity.gcaBelowGround?.toString() || ""
                            }
                            description={t(
                              "preNDACard.gcaBelowGround.description"
                            )}
                            fieldName="gcaBelowGround"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateGCABelowGround.mutateAsync({
                                id: opportunityId,
                                gcaBelowGround: Number(value),
                              });
                            }}
                            placeholder={t(
                              "preNDACard.gcaBelowGround.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("preNDACard.gcaBelowGround.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.gcaBelowGround === null ||
                              removeGCABelowGround.isPending
                            }
                            onClick={async () => {
                              await removeGCABelowGround.mutateAsync({
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
          <CardHeader>
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
                <TableRow key="license">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.license.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.license || "N/A"}
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
                            currentValue={opportunity.license ?? ""}
                            description={t("postNDACard.license.description")}
                            fieldName="license"
                            inputType="text"
                            onSaveAction={async (value) => {
                              await updateLicense.mutateAsync({
                                id: opportunityId,
                                license: value,
                              });
                            }}
                            placeholder={t("postNDACard.license.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.license.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.license === null ||
                              removeLicense.isPending
                            }
                            onClick={async () => {
                              await removeLicense.mutateAsync({
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

                <TableRow key="licenseStage">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.licenseStage.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.licenseStage || "N/A"}
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
                            currentValue={opportunity.licenseStage ?? ""}
                            description={t(
                              "postNDACard.licenseStage.description"
                            )}
                            fieldName="licenseStage"
                            inputType="text"
                            onSaveAction={async (value) => {
                              await updateLicenseStage.mutateAsync({
                                id: opportunityId,
                                licenseStage: value,
                              });
                            }}
                            placeholder={t(
                              "postNDACard.licenseStage.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.licenseStage.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.licenseStage === null ||
                              removeLicenseStage.isPending
                            }
                            onClick={async () => {
                              await removeLicenseStage.mutateAsync({
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

                <TableRow key="irr">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.irr.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.irr
                      ? opportunity.irr + t("postNDACard.irr.units")
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
                            currentValue={opportunity.irr?.toString() || ""}
                            description={t("postNDACard.irr.description")}
                            fieldName="irr"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateIRR.mutateAsync({
                                id: opportunityId,
                                irr: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.irr.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.irr.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.irr === null || removeIRR.isPending
                            }
                            onClick={async () => {
                              await removeIRR.mutateAsync({
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

                <TableRow key="coc">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.coc.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coc
                      ? opportunity.coc + t("postNDACard.coc.units")
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
                            currentValue={opportunity.coc?.toString() || ""}
                            description={t("postNDACard.coc.description")}
                            fieldName="coc"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateCOC.mutateAsync({
                                id: opportunityId,
                                coc: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.coc.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.coc.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.coc === null || removeCOC.isPending
                            }
                            onClick={async () => {
                              await removeCOC.mutateAsync({
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

                <TableRow key="holdingPeriod">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.holdingPeriod.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.holdingPeriod
                      ? opportunity.holdingPeriod +
                        t("postNDACard.holdingPeriod.units")
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
                              opportunity.holdingPeriod?.toString() || ""
                            }
                            description={t(
                              "postNDACard.holdingPeriod.description"
                            )}
                            fieldName="holdingPeriod"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateHoldingPeriod.mutateAsync({
                                id: opportunityId,
                                holdingPeriod: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.holdingPeriod.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.holdingPeriod.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.holdingPeriod === null ||
                              removeHoldingPeriod.isPending
                            }
                            onClick={async () => {
                              await removeHoldingPeriod.mutateAsync({
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

                <TableRow key="breakEvenOccupancy">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.breakEvenOccupancy.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.breakEvenOccupancy
                      ? opportunity.breakEvenOccupancy +
                        t("postNDACard.breakEvenOccupancy.units")
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
                              opportunity.breakEvenOccupancy?.toString() || ""
                            }
                            description={t(
                              "postNDACard.breakEvenOccupancy.description"
                            )}
                            fieldName="breakEvenOccupancy"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateBreakEvenOccupancy.mutateAsync({
                                id: opportunityId,
                                breakEvenOccupancy: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.breakEvenOccupancy.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.breakEvenOccupancy.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.breakEvenOccupancy === null ||
                              removeBreakEvenOccupancy.isPending
                            }
                            onClick={async () => {
                              await removeBreakEvenOccupancy.mutateAsync({
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

                <TableRow key="vacancyRate">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.vacancyRate.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.vacancyRate
                      ? opportunity.vacancyRate +
                        t("postNDACard.vacancyRate.units")
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
                              opportunity.vacancyRate?.toString() || ""
                            }
                            description={t(
                              "postNDACard.vacancyRate.description"
                            )}
                            fieldName="vacancyRate"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateVacancyRate.mutateAsync({
                                id: opportunityId,
                                vacancyRate: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.vacancyRate.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.vacancyRate.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.vacancyRate === null ||
                              removeVacancyRate.isPending
                            }
                            onClick={async () => {
                              await removeVacancyRate.mutateAsync({
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

                <TableRow key="estimatedRentValue">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.estimatedRentValue.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.estimatedRentValue != null
                      ? t("postNDACard.estimatedRentValue.prefix") +
                        opportunity.estimatedRentValue +
                        t("postNDACard.estimatedRentValue.units")
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
                              opportunity.estimatedRentValue?.toString() || ""
                            }
                            description={t(
                              "postNDACard.estimatedRentValue.description"
                            )}
                            fieldName="estimatedRentValue"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateEstimatedRentValue.mutateAsync({
                                id: opportunityId,
                                estimatedRentValue: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.estimatedRentValue.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.estimatedRentValue.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.estimatedRentValue === null ||
                              removeEstimatedRentValue.isPending
                            }
                            onClick={async () => {
                              await removeEstimatedRentValue.mutateAsync({
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

                <TableRow key="occupancyRate">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.occupancyRate.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.occupancyRate
                      ? opportunity.occupancyRate +
                        t("postNDACard.occupancyRate.units")
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
                              opportunity.occupancyRate?.toString() || ""
                            }
                            description={t(
                              "postNDACard.occupancyRate.description"
                            )}
                            fieldName="occupancyRate"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateOccupancyRate.mutateAsync({
                                id: opportunityId,
                                occupancyRate: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.occupancyRate.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.occupancyRate.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.occupancyRate === null ||
                              removeOccupancyRate.isPending
                            }
                            onClick={async () => {
                              await removeOccupancyRate.mutateAsync({
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

                <TableRow key="moic">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.moic.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.moic
                      ? opportunity.moic + t("postNDACard.moic.units")
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
                            description={t("postNDACard.moic.description")}
                            fieldName="moic"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateMOIC.mutateAsync({
                                id: opportunityId,
                                moic: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.moic.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.moic.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.moic === null || removeMOIC.isPending
                            }
                            onClick={async () => {
                              await removeMOIC.mutateAsync({
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

                <TableRow key="price">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.price.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.price != null
                      ? t("postNDACard.price.prefix") +
                        opportunity.price +
                        t("postNDACard.price.units")
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
                            currentValue={opportunity.price?.toString() || ""}
                            description={t("postNDACard.price.description")}
                            fieldName="price"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updatePrice.mutateAsync({
                                id: opportunityId,
                                price: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.price.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.price.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.price === null ||
                              removePrice.isPending
                            }
                            onClick={async () => {
                              await removePrice.mutateAsync({
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

                <TableRow key="totalInvestment">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.totalInvestment.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.totalInvestment != null
                      ? t("postNDACard.totalInvestment.prefix") +
                        opportunity.totalInvestment +
                        t("postNDACard.totalInvestment.units")
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
                              opportunity.totalInvestment?.toString() || ""
                            }
                            description={t(
                              "postNDACard.totalInvestment.description"
                            )}
                            fieldName="totalInvestment"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateTotalInvestment.mutateAsync({
                                id: opportunityId,
                                totalInvestment: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.totalInvestment.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.totalInvestment.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.totalInvestment === null ||
                              removeTotalInvestment.isPending
                            }
                            onClick={async () => {
                              await removeTotalInvestment.mutateAsync({
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

                <TableRow key="profitOnCost">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.profitOnCost.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.profitOnCost
                      ? opportunity.profitOnCost +
                        t("postNDACard.profitOnCost.units")
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
                              opportunity.profitOnCost?.toString() || ""
                            }
                            description={t(
                              "postNDACard.profitOnCost.description"
                            )}
                            fieldName="profitOnCost"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateProfitOnCost.mutateAsync({
                                id: opportunityId,
                                profitOnCost: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.profitOnCost.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.profitOnCost.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.profitOnCost === null ||
                              removeProfitOnCost.isPending
                            }
                            onClick={async () => {
                              await removeProfitOnCost.mutateAsync({
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

                <TableRow key="profit">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.profit.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.profit != null
                      ? t("postNDACard.profit.prefix") +
                        opportunity.profit +
                        t("postNDACard.profit.units")
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
                            currentValue={opportunity.profit?.toString() || ""}
                            description={t("postNDACard.profit.description")}
                            fieldName="profit"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateProfit.mutateAsync({
                                id: opportunityId,
                                profit: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.profit.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.profit.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.profit === null ||
                              removeProfit.isPending
                            }
                            onClick={async () => {
                              await removeProfit.mutateAsync({
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

                <TableRow key="sofCosts">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.sofCosts.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sofCosts != null
                      ? t("postNDACard.sofCosts.prefix") +
                        opportunity.sofCosts +
                        t("postNDACard.sofCosts.units")
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
                              opportunity.sofCosts?.toString() || ""
                            }
                            description={t("postNDACard.sofCosts.description")}
                            fieldName="sofCosts"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateSofCosts.mutateAsync({
                                id: opportunityId,
                                sofCosts: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.sofCosts.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.sofCosts.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.sofCosts === null ||
                              removeSofCosts.isPending
                            }
                            onClick={async () => {
                              await removeSofCosts.mutateAsync({
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

                <TableRow key="sellPerSqm">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.sellPerSqm.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sellPerSqm != null
                      ? t("postNDACard.sellPerSqm.prefix") +
                        opportunity.sellPerSqm +
                        t("postNDACard.sellPerSqm.units")
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
                              opportunity.sellPerSqm?.toString() || ""
                            }
                            description={t(
                              "postNDACard.sellPerSqm.description"
                            )}
                            fieldName="sellPerSqm"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateSellPerSqm.mutateAsync({
                                id: opportunityId,
                                sellPerSqm: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.sellPerSqm.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.sellPerSqm.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.sellPerSqm === null ||
                              removeSellPerSqm.isPending
                            }
                            onClick={async () => {
                              await removeSellPerSqm.mutateAsync({
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

                <TableRow key="gdv">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.gdv.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gdv != null
                      ? t("postNDACard.gdv.prefix") +
                        opportunity.gdv +
                        t("postNDACard.gdv.units")
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
                            currentValue={opportunity.gdv?.toString() || ""}
                            description={t("postNDACard.gdv.description")}
                            fieldName="gdv"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateGDV.mutateAsync({
                                id: opportunityId,
                                gdv: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.gdv.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.gdv.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.gdv === null || removeGDV.isPending
                            }
                            onClick={async () => {
                              await removeGDV.mutateAsync({
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

                <TableRow key="wault">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.wault.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.wault
                      ? opportunity.wault + t("postNDACard.wault.units")
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
                            currentValue={opportunity.wault?.toString() || ""}
                            description={t("postNDACard.wault.description")}
                            fieldName="wault"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateWAULT.mutateAsync({
                                id: opportunityId,
                                wault: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.wault.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.wault.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.wault === null ||
                              removeWAULT.isPending
                            }
                            onClick={async () => {
                              await removeWAULT.mutateAsync({
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

                <TableRow key="debtServiceCoverageRatio">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.debtServiceCoverageRatio.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.debtServiceCoverageRatio
                      ? opportunity.debtServiceCoverageRatio +
                        t("postNDACard.debtServiceCoverageRatio.units")
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
                              opportunity.debtServiceCoverageRatio?.toString() ||
                              ""
                            }
                            description={t(
                              "postNDACard.debtServiceCoverageRatio.description"
                            )}
                            fieldName="debtServiceCoverageRatio"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateDebtServiceCoverageRatio.mutateAsync({
                                id: opportunityId,
                                debtServiceCoverageRatio: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.debtServiceCoverageRatio.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "postNDACard.debtServiceCoverageRatio.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.debtServiceCoverageRatio === null ||
                              removeDebtServiceCoverageRatio.isPending
                            }
                            onClick={async () => {
                              await removeDebtServiceCoverageRatio.mutateAsync({
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

                <TableRow key="expectedExitYield">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.expectedExitYield.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.expectedExitYield
                      ? opportunity.expectedExitYield +
                        t("postNDACard.expectedExitYield.units")
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
                              opportunity.expectedExitYield?.toString() || ""
                            }
                            description={t(
                              "postNDACard.expectedExitYield.description"
                            )}
                            fieldName="expectedExitYield"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateExpectedExitYield.mutateAsync({
                                id: opportunityId,
                                expectedExitYield: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.expectedExitYield.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.expectedExitYield.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.expectedExitYield === null ||
                              removeExpectedExitYield.isPending
                            }
                            onClick={async () => {
                              await removeExpectedExitYield.mutateAsync({
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

                <TableRow key="ltv">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.ltv.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ltv
                      ? opportunity.ltv + t("postNDACard.ltv.units")
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
                            currentValue={opportunity.ltv?.toString() || ""}
                            description={t("postNDACard.ltv.description")}
                            fieldName="ltv"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateLTV.mutateAsync({
                                id: opportunityId,
                                ltv: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.ltv.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.ltv.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.ltv === null || removeLTV.isPending
                            }
                            onClick={async () => {
                              await removeLTV.mutateAsync({
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

                <TableRow key="ltc">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.ltc.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ltc
                      ? opportunity.ltc + t("postNDACard.ltc.units")
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
                            currentValue={opportunity.ltc?.toString() || ""}
                            description={t("postNDACard.ltc.description")}
                            fieldName="ltc"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateLTC.mutateAsync({
                                id: opportunityId,
                                ltc: Number(value),
                              });
                            }}
                            placeholder={t("postNDACard.ltc.placeholder")}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.ltc.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.ltc === null || removeLTC.isPending
                            }
                            onClick={async () => {
                              await removeLTC.mutateAsync({
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

                <TableRow key="yieldOnCost">
                  <TableCell className="px-6 py-4">
                    {t("postNDACard.yieldOnCost.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.yieldOnCost
                      ? opportunity.yieldOnCost +
                        t("postNDACard.yieldOnCost.units")
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
                              opportunity.yieldOnCost?.toString() || ""
                            }
                            description={t(
                              "postNDACard.yieldOnCost.description"
                            )}
                            fieldName="yieldOnCost"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateYieldOnCost.mutateAsync({
                                id: opportunityId,
                                yieldOnCost: Number(value),
                              });
                            }}
                            placeholder={t(
                              "postNDACard.yieldOnCost.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("postNDACard.yieldOnCost.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.yieldOnCost === null ||
                              removeYieldOnCost.isPending
                            }
                            onClick={async () => {
                              await removeYieldOnCost.mutateAsync({
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
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              {t("limitedPartnerCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("limitedPartnerCard.table.header.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("limitedPartnerCard.table.header.value")}
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    {t("limitedPartnerCard.table.header.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key="coInvestment">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.coInvestment.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getCoInvestmentStatus(opportunity.coInvestment)}
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
                            currentValue={getCoInvestmentSelectValue(
                              opportunity.coInvestment
                            )}
                            description={t(
                              "limitedPartnerCard.coInvestment.description"
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
                                label: t("limitedPartnerCard.coInvestment.yes"),
                                value: "true",
                              },
                              {
                                label: t("limitedPartnerCard.coInvestment.no"),
                                value: "false",
                              },
                            ]}
                            placeholder={t(
                              "limitedPartnerCard.coInvestment.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("limitedPartnerCard.coInvestment.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.coInvestment === null ||
                              removeCoInvestment.isPending
                            }
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

                <TableRow key="gpEquityValue">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.gpEquityValue.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gpEquityValue != null
                      ? t("limitedPartnerCard.gpEquityValue.prefix") +
                        opportunity.gpEquityValue +
                        t("limitedPartnerCard.gpEquityValue.units")
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
                              opportunity.gpEquityValue?.toString() || ""
                            }
                            description={t(
                              "limitedPartnerCard.gpEquityValue.description"
                            )}
                            fieldName="gpEquityValue"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateGPEquityValue.mutateAsync({
                                id: opportunityId,
                                gpEquityValue: Number(value),
                              });
                            }}
                            placeholder={t(
                              "limitedPartnerCard.gpEquityValue.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("limitedPartnerCard.gpEquityValue.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.gpEquityValue === null ||
                              removeGPEquityValue.isPending
                            }
                            onClick={async () => {
                              await removeGPEquityValue.mutateAsync({
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

                <TableRow key="gpEquityPercentage">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.gpEquityPercentage.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gpEquityPercentage
                      ? opportunity.gpEquityPercentage +
                        t("limitedPartnerCard.gpEquityPercentage.units")
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
                              opportunity.gpEquityPercentage?.toString() || ""
                            }
                            description={t(
                              "limitedPartnerCard.gpEquityPercentage.description"
                            )}
                            fieldName="gpEquityPercentage"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateGPEquityPercentage.mutateAsync({
                                id: opportunityId,
                                gpEquityPercentage: Number(value),
                              });
                            }}
                            placeholder={t(
                              "limitedPartnerCard.gpEquityPercentage.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "limitedPartnerCard.gpEquityPercentage.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.gpEquityPercentage === null ||
                              removeGPEquityPercentage.isPending
                            }
                            onClick={async () => {
                              await removeGPEquityPercentage.mutateAsync({
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

                <TableRow key="totalEquityRequired">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.totalEquityRequired.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.totalEquityRequired != null
                      ? t("limitedPartnerCard.totalEquityRequired.prefix") +
                        opportunity.totalEquityRequired +
                        t("limitedPartnerCard.totalEquityRequired.units")
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
                              opportunity.totalEquityRequired?.toString() || ""
                            }
                            description={t(
                              "limitedPartnerCard.totalEquityRequired.description"
                            )}
                            fieldName="totalEquityRequired"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateTotalEquityRequired.mutateAsync({
                                id: opportunityId,
                                totalEquityRequired: Number(value),
                              });
                            }}
                            placeholder={t(
                              "limitedPartnerCard.totalEquityRequired.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "limitedPartnerCard.totalEquityRequired.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.totalEquityRequired === null ||
                              removeTotalEquityRequired.isPending
                            }
                            onClick={async () => {
                              await removeTotalEquityRequired.mutateAsync({
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

                <TableRow key="projectIRR">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.projectIRR.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.projectIRR
                      ? opportunity.projectIRR +
                        t("limitedPartnerCard.projectIRR.units")
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
                              opportunity.projectIRR?.toString() || ""
                            }
                            description={t(
                              "limitedPartnerCard.projectIRR.description"
                            )}
                            fieldName="projectIRR"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateProjectIRR.mutateAsync({
                                id: opportunityId,
                                projectIRR: Number(value),
                              });
                            }}
                            placeholder={t(
                              "limitedPartnerCard.projectIRR.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("limitedPartnerCard.projectIRR.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.projectIRR === null ||
                              removeProjectIRR.isPending
                            }
                            onClick={async () => {
                              await removeProjectIRR.mutateAsync({
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

                <TableRow key="investorIRR">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.investorIRR.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.investorIRR
                      ? opportunity.investorIRR +
                        t("limitedPartnerCard.investorIRR.units")
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
                              opportunity.investorIRR?.toString() || ""
                            }
                            description={t(
                              "limitedPartnerCard.investorIRR.description"
                            )}
                            fieldName="investorIRR"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateInvestorIRR.mutateAsync({
                                id: opportunityId,
                                investorIRR: Number(value),
                              });
                            }}
                            placeholder={t(
                              "limitedPartnerCard.investorIRR.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t("limitedPartnerCard.investorIRR.label")}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.investorIRR === null ||
                              removeInvestorIRR.isPending
                            }
                            onClick={async () => {
                              await removeInvestorIRR.mutateAsync({
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

                <TableRow key="coInvestmentHoldPeriod">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.coInvestmentHoldPeriod.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coInvestmentHoldPeriod
                      ? opportunity.coInvestmentHoldPeriod +
                        t("limitedPartnerCard.coInvestmentHoldPeriod.units")
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
                              opportunity.coInvestmentHoldPeriod?.toString() ||
                              ""
                            }
                            description={t(
                              "limitedPartnerCard.coInvestmentHoldPeriod.description"
                            )}
                            fieldName="coInvestmentHoldPeriod"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateCoInvestmentHoldPeriod.mutateAsync({
                                id: opportunityId,
                                coInvestmentHoldPeriod: Number(value),
                              });
                            }}
                            placeholder={t(
                              "limitedPartnerCard.coInvestmentHoldPeriod.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "limitedPartnerCard.coInvestmentHoldPeriod.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.coInvestmentHoldPeriod === null ||
                              removeCoInvestmentHoldPeriod.isPending
                            }
                            onClick={async () => {
                              await removeCoInvestmentHoldPeriod.mutateAsync({
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

                <TableRow key="coInvestmentBreakEvenOccupancy">
                  <TableCell className="px-6 py-4">
                    {t(
                      "limitedPartnerCard.coInvestmentBreakEvenOccupancy.label"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coInvestmentBreakEvenOccupancy
                      ? opportunity.coInvestmentBreakEvenOccupancy +
                        t(
                          "limitedPartnerCard.coInvestmentBreakEvenOccupancy.units"
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
                              opportunity.coInvestmentBreakEvenOccupancy?.toString() ||
                              ""
                            }
                            description={t(
                              "limitedPartnerCard.coInvestmentBreakEvenOccupancy.description"
                            )}
                            fieldName="coInvestmentBreakEvenOccupancy"
                            inputType="number"
                            onSaveAction={async (value) => {
                              await updateCoInvestmentBreakEvenOccupancy.mutateAsync(
                                {
                                  id: opportunityId,
                                  coInvestmentBreakEvenOccupancy: Number(value),
                                }
                              );
                            }}
                            placeholder={t(
                              "limitedPartnerCard.coInvestmentBreakEvenOccupancy.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "limitedPartnerCard.coInvestmentBreakEvenOccupancy.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.coInvestmentBreakEvenOccupancy ===
                                null ||
                              removeCoInvestmentBreakEvenOccupancy.isPending
                            }
                            onClick={async () => {
                              await removeCoInvestmentBreakEvenOccupancy.mutateAsync(
                                {
                                  id: opportunityId,
                                }
                              );
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

                <TableRow key="sponsorPresentation">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.sponsorPresentation.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sponsorPresentation || "N/A"}
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
                            currentValue={opportunity.sponsorPresentation || ""}
                            description={t(
                              "limitedPartnerCard.sponsorPresentation.description"
                            )}
                            fieldName="sponsorPresentation"
                            inputType="text"
                            onSaveAction={async (value) => {
                              await updateSponsorPresentation.mutateAsync({
                                id: opportunityId,
                                sponsorPresentation: value,
                              });
                            }}
                            placeholder={t(
                              "limitedPartnerCard.sponsorPresentation.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "limitedPartnerCard.sponsorPresentation.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.sponsorPresentation === null ||
                              removeSponsorPresentation.isPending
                            }
                            onClick={async () => {
                              await removeSponsorPresentation.mutateAsync({
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

                <TableRow key="promoteStructure">
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerCard.promoteStructure.label")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.promoteStructure || "N/A"}
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
                            currentValue={opportunity.promoteStructure || ""}
                            description={t(
                              "limitedPartnerCard.promoteStructure.description"
                            )}
                            fieldName="promoteStructure"
                            inputType="text"
                            onSaveAction={async (value) => {
                              await updatePromoteStructure.mutateAsync({
                                id: opportunityId,
                                promoteStructure: value,
                              });
                            }}
                            placeholder={t(
                              "limitedPartnerCard.promoteStructure.placeholder"
                            )}
                            saveButtonText={t("saveButtonText")}
                            title={t(
                              "limitedPartnerCard.promoteStructure.label"
                            )}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            disabled={
                              opportunity.promoteStructure === null ||
                              removePromoteStructure.isPending
                            }
                            onClick={async () => {
                              await removePromoteStructure.mutateAsync({
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
