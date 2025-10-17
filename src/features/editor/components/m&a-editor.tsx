/** biome-ignore-all lint/style/noNestedTernary: This is a complex component */
"use client";

import { EditIcon, EllipsisVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
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
import {
  useRemoveOpportunityAssetIncluded,
  useRemoveOpportunityEbitda,
  useRemoveOpportunityEbitdaCAGR,
  useRemoveOpportunityEbitdaNormalized,
  useRemoveOpportunityEstimatedAssetValue,
  useRemoveOpportunityIndustry,
  useRemoveOpportunityIndustrySubsector,
  useRemoveOpportunityNetDebt,
  useRemoveOpportunitySales,
  useRemoveOpportunitySalesCAGR,
  useRemoveOpportunityType,
  useRemoveOpportunityTypeDetails,
  useSuspenseOpportunity,
  useUpdateOpportunityAssetIncluded,
  useUpdateOpportunityDescription,
  useUpdateOpportunityEbitda,
  useUpdateOpportunityEbitdaCAGR,
  useUpdateOpportunityEbitdaNormalized,
  useUpdateOpportunityEstimatedAssetValue,
  useUpdateOpportunityIndustry,
  useUpdateOpportunityIndustrySubsector,
  useUpdateOpportunityNetDebt,
  useUpdateOpportunitySales,
  useUpdateOpportunitySalesCAGR,
  useUpdateOpportunityType,
  useUpdateOpportunityTypeDetails,
} from "@/features/opportunities/hooks/use-m&a-opportunities";
import {
  EbitdaRange,
  Industry,
  IndustrySubsector,
  SalesRange,
  Type,
  TypeDetails,
} from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";

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
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);

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

  return (
    <>
      <p>{JSON.stringify(opportunity, null, 2)}</p>
      <main className="m-4 flex max-w-screen-xs flex-1 flex-col space-y-6 md:mx-auto md:max-w-screen-xl">
        <h1 className="font-bold text-2xl md:text-4xl">{opportunity.name}</h1>

        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-bold text-lg">
                {t("description")}
              </CardTitle>
              <EditorEditButton
                cancelButtonText={t("cancelButtonText")}
                currentValue={opportunity.description || ""}
                fieldName="description"
                inputType="textarea"
                onSaveAction={async (value) => {
                  await updateDescription.mutateAsync({
                    id: opportunityId,
                    description: value,
                  });
                }}
                saveButtonText={t("saveButtonText")}
                title={t("editDescription")}
              />
            </CardHeader>
            <CardContent>
              <p className="text-balance text-base">
                {opportunity.description}
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
                              <TrashIcon className="size-4 text-destructive" />
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow key={"typeDetails"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.body.typeDetails.label"
                      )}
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
                              <TrashIcon className="size-4 text-destructive" />
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
                                  value: TypeDetails.MINORITARIO,
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
                              <TrashIcon className="size-4 text-destructive" />
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
                                  value:
                                    IndustrySubsector.CONSTRUCTION_MATERIALS,
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
                              <TrashIcon className="size-4 text-destructive" />
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
                              <TrashIcon className="size-4 text-destructive" />
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
                              <TrashIcon className="size-4 text-destructive" />
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
                              <TrashIcon className="size-4 text-destructive" />
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
                              currentValue={
                                opportunity.netDebt?.toString() || ""
                              }
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
                              <TrashIcon className="size-4 text-destructive" />
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
                          t(
                            "financialInformationCard.table.body.salesCAGR.units"
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
                              <TrashIcon className="size-4 text-destructive" />
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow key={"ebitdaCAGR"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.body.ebitdaCAGR.label"
                      )}
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
                              <TrashIcon className="size-4 text-destructive" />
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
                              <TrashIcon className="size-4 text-destructive" />
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
                                opportunity.estimatedAssetValue?.toString() ||
                                ""
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
                              disabled={
                                opportunity.estimatedAssetValue === null
                              }
                              onClick={async () => {
                                await removeEstimatedAssetValue.mutateAsync({
                                  id: opportunityId,
                                });
                              }}
                              size="icon"
                              variant="destructive"
                            >
                              <TrashIcon className="size-4 text-destructive" />
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
    </>
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
