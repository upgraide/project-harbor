"use client";

import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumb,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { backofficeMergersAndAcquisitionsPath } from "@/lib/paths";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  LoaderIcon,
  PlusIcon,
  PencilIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "lucide-react";
import { use, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { EditOpportunityDescriptionDialog } from "./_components/edit-opportunity-description-dialog";
import { AddOpportunityGraphRowDialog } from "./_components/add-opportunity-graph-row-dialog";
import {
  EditOpportunityGraphRowDialog,
  editOpportunityGraphRowSchema,
} from "./_components/edit-opportunity-graph-row-dialog";
import z from "zod";
import { DeleteOpportunityGraphRowDialog } from "./_components/delete-opportunity-graph-row-dialog";
import { useScopedI18n } from "@/locales/client";
import { EditOpportunityTypeDialog } from "./_components/edit-opportunity-type-dialog";
import { DeleteOpportunityTypeDialog } from "./_components/delete-opportunity-type-dialog";
import { EditOpportunityTypeDetailsDialog } from "./_components/edit-opportunity-type-details";
import { DeleteOpportunityTypeDetailsDialog } from "./_components/delete-opportunity-type-details-dialog";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  ebitda: {
    label: "EBITDA",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type MergersAndAcquisitions = Doc<"mergersAndAcquisitions">;

const Page = ({
  params,
}: {
  params: Promise<{ id: Id<"mergersAndAcquisitions"> }>;
}) => {
  const { id } = use(params);
  const t = useScopedI18n("backofficeMergersAndAcquisitionsOpportunityPage");
  const [opportunityDescriptionToEdit, setOpportunityDescriptionToEdit] =
    useState<MergersAndAcquisitions | null>(null);
  const [addOpportunityGraphRow, setAddOpportunityGraphRow] =
    useState<MergersAndAcquisitions | null>(null);
  const [editOpportunityGraphRow, setEditOpportunityGraphRow] =
    useState<MergersAndAcquisitions | null>(null);
  const [editOpportunityGraphRowGraphRow, setEditOpportunityGraphRowGraphRow] =
    useState<z.infer<typeof editOpportunityGraphRowSchema> | null>(null);
  const [deleteOpportunityGraphRow, setDeleteOpportunityGraphRow] =
    useState<MergersAndAcquisitions | null>(null);
  const [
    deleteOpportunityGraphRowGraphRow,
    setDeleteOpportunityGraphRowGraphRow,
  ] = useState<z.infer<typeof editOpportunityGraphRowSchema> | null>(null);
  const [editOpportunityType, setEditOpportunityType] =
    useState<MergersAndAcquisitions | null>(null);
  const [deleteOpportunityType, setDeleteOpportunityType] =
    useState<MergersAndAcquisitions | null>(null);
  const [editOpportunityTypeDetails, setEditOpportunityTypeDetails] =
    useState<MergersAndAcquisitions | null>(null);
  const [deleteOpportunityTypeDetails, setDeleteOpportunityTypeDetails] =
    useState<MergersAndAcquisitions | null>(null);

  const opportunity = useQuery(api.mergersAndAcquisitions.getById, {
    id,
  });

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LoaderIcon className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarInset className="bg-muted">
      <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={backofficeMergersAndAcquisitionsPath()}>
                {t("breadcrumbs.mergersAndAcquisitionsOpportunities")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{opportunity.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="mx-auto md:max-w-screen-md w-full mt-6 mb-6 space-y-6">
        <h1 className="text-2xl md:text-4xl font-bold mt-6">
          {opportunity.name}
        </h1>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t("imagesCard.title")}
            </CardTitle>
            <Button variant="outline">
              <PlusIcon className="size-4" />
              {t("imagesCard.buttons.add")}
            </Button>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2">
            {opportunity.imagesUrls?.map((imageUrl, index) => (
              <div key={index}>
                <Image
                  src={imageUrl ?? ""}
                  alt={`Opportunity Image ${index + 1}`}
                  height={4501}
                  width={4501}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t("descriptionCard.title")}
            </CardTitle>
            <Button
              variant="outline"
              onClick={() =>
                setOpportunityDescriptionToEdit({
                  ...opportunity,
                  createdBy: opportunity.createdBy?._id ?? "",
                })
              }
            >
              <PencilIcon className="size-4" />
              {t("descriptionCard.buttons.edit")}
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {opportunity.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">
              {t("financialPerformanceCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={opportunity.graphRows ?? []}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 4)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="var(--color-revenue)"
                  fillOpacity={0.4}
                  stroke="var(--color-revenue)"
                  stackId="a"
                />
                <Area
                  dataKey="ebitda"
                  type="natural"
                  fill="var(--color-ebitda)"
                  fillOpacity={0.4}
                  stroke="var(--color-ebitda)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>

            <Card className="mt-4">
              <CardHeader className="border-b flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  {t("financialPerformanceCard.graphRowsCard.title")}
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() =>
                    setAddOpportunityGraphRow({
                      ...opportunity,
                      createdBy: opportunity.createdBy?._id ?? "",
                    })
                  }
                >
                  <PlusIcon className="size-4" />
                  {t("financialPerformanceCard.graphRowsCard.buttons.add")}
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("financialPerformanceCard.graphRowsCard.table.year")}
                      </TableHead>
                      <TableHead>
                        {t(
                          "financialPerformanceCard.graphRowsCard.table.revenue",
                        )}
                      </TableHead>
                      <TableHead>
                        {t(
                          "financialPerformanceCard.graphRowsCard.table.ebitda",
                        )}
                      </TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunity.graphRows?.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell>{row.revenue}</TableCell>
                        <TableCell>{row.ebitda}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <EllipsisVerticalIcon className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditOpportunityGraphRowGraphRow(row);
                                  setEditOpportunityGraphRow({
                                    ...opportunity,
                                    createdBy: opportunity.createdBy?._id ?? "",
                                  });
                                }}
                              >
                                <PencilIcon className="size-4" />
                                {t(
                                  "financialPerformanceCard.graphRowsCard.table.buttons.edit",
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setDeleteOpportunityGraphRowGraphRow(row);
                                  setDeleteOpportunityGraphRow({
                                    ...opportunity,
                                    createdBy: opportunity.createdBy?._id ?? "",
                                  });
                                }}
                              >
                                <TrashIcon className="size-4 text-destructive" />
                                {t(
                                  "financialPerformanceCard.graphRowsCard.table.buttons.delete",
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t("preNDAInformationCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("preNDAInformationCard.table.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("preNDAInformationCard.table.value")}
                  </TableHead>
                  <TableHead className="text-right px-6 py-4">
                    {t("preNDAInformationCard.table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"type"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.type")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.type ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditOpportunityType({
                              ...opportunity,
                              createdBy: opportunity.createdBy?._id ?? "",
                            });
                          }}
                        >
                          <PencilIcon className="size-4" />
                          {t("preNDAInformationCard.table.buttons.edit")}
                        </DropdownMenuItem>
                        {opportunity.type ? (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setDeleteOpportunityType({
                                ...opportunity,
                                createdBy: opportunity.createdBy?._id ?? "",
                              });
                            }}
                          >
                            <TrashIcon className="size-4 text-destructive" />
                            {t("preNDAInformationCard.table.buttons.delete")}
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"typeDetails"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.typeDetails")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.typeDetails ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditOpportunityTypeDetails({
                              ...opportunity,
                              createdBy: opportunity.createdBy?._id ?? "",
                            });
                          }}
                        >
                          <PencilIcon className="size-4" />
                          {t("preNDAInformationCard.table.buttons.edit")}
                        </DropdownMenuItem>
                        {opportunity.typeDetails ? (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setDeleteOpportunityTypeDetails({
                                ...opportunity,
                                createdBy: opportunity.createdBy?._id ?? "",
                              });
                            }}
                          >
                            <TrashIcon className="size-4 text-destructive" />
                            {t("preNDAInformationCard.table.buttons.delete")}
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow key={"industry"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.industry")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.industry ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"industrySubsector"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.industrySubsector")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.industrySubsector ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"dimension"}>
                  <TableCell className="px-6 py-4 font-medium bg-muted">
                    {t("preNDAInformationCard.table.dimension")}
                  </TableCell>
                  <TableCell className="px-6 py-4 bg-muted"></TableCell>
                  <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                </TableRow>
                <TableRow key={"sales"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.sales")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    €{opportunity.sales ?? "N/A"}M
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitda"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.ebitda")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    €{opportunity.ebitda ?? "N/A"}M
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitdaNormalized"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.ebitdaNormalized")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaNormalized ?? "N/A"}x
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"netDebt"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.netDebt")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    €{opportunity.netDebt ?? "N/A"}M
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"CAGR"}>
                  <TableCell className="px-6 py-4 font-medium bg-muted">
                    {t("preNDAInformationCard.table.cagr")}
                  </TableCell>
                  <TableCell className="px-6 py-4 bg-muted"></TableCell>
                  <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                </TableRow>
                <TableRow key={"salesCAGR"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.salesCAGR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.salesCAGR ?? "N/A"}%
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitdaCAGR"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.ebitdaCAGR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaCAGR ?? "N/A"}%
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"Asset"}>
                  <TableCell className="px-6 py-4 font-medium bg-muted">
                    {t("preNDAInformationCard.table.asset")}
                  </TableCell>
                  <TableCell className="px-6 py-4 bg-muted"></TableCell>
                  <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                </TableRow>
                <TableRow key={"assetIncluded"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.assetIncluded")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.assetIncluded
                      ? t("preNDAInformationCard.table.assetIncludedYes")
                      : t("preNDAInformationCard.table.assetIncludedNo")}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"estimatedAssetValue"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.estimatedAssetValue")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.estimatedAssetValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t("postNDAInformationCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("postNDAInformationCard.table.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("postNDAInformationCard.table.value")}
                  </TableHead>
                  <TableHead className="text-right px-6 py-4">
                    {t("postNDAInformationCard.table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"im"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.im")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.im ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"entrepriseValue"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.entrepriseValue")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entrepriseValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"equityValue"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.equityValue")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"evDashEbitdaEntry"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.evDashEbitdaEntry")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaEntry ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"evDashEbitdaExit"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.evDashEbitdaExit")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaExit ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitdaMargin"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.ebitdaMargin")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaMargin ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"fcf"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.fcf")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.fcf ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"netDebtDashEbitda"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.netDebtDashEbitda")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netDebtDashEbitda ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"capexItensity"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.capexIntensity")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexItensity ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"workingCapitalNeeds"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.workingCapitalNeeds")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.workingCapitalNeeds ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t("shareholderInformationCard.title")}
            </CardTitle>
            <Button variant="outline">
              <PlusIcon className="size-4" />
              {t("shareholderInformationCard.buttons.add")}
            </Button>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2">
            {opportunity.shareholderStructureUrls?.map((imageUrl, index) => (
              <div key={index}>
                <Image
                  src={imageUrl ?? ""}
                  alt={`Opportunity Image ${index + 1}`}
                  height={4501}
                  width={4501}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semid">
              {t("limitedPartnerInformationCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.value")}
                  </TableHead>
                  <TableHead className="text-right px-6 py-4">
                    {t("limitedPartnerInformationCard.table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"coInvestment"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.coInvestment")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coInvestment ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
                <TableRow key={"equityContribution"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "limitedPartnerInformationCard.table.equityContribution",
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityContribution ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"grossIRR"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.grossIRR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.grossIRR ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"netIRR"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.netIRR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netIRR ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"moic"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.moic")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.moic ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"cashOnCashReturn"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.cashOnCashReturn")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashOnCashReturn ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"cashConvertion"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.cashConvertion")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashConvertion ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"entryMultiple"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.entryMultiple")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entryMultiple ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"exitExpectedMultiple"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "limitedPartnerInformationCard.table.exitExpectedMultiple",
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.exitExpectedMultiple ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"holdPeriod"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.holdPeriod")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.holdPeriod ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <EditOpportunityDescriptionDialog
        opportunity={opportunityDescriptionToEdit}
        setOpportunity={setOpportunityDescriptionToEdit}
      />
      <AddOpportunityGraphRowDialog
        opportunity={addOpportunityGraphRow}
        setOpportunity={setAddOpportunityGraphRow}
      />
      <EditOpportunityGraphRowDialog
        opportunity={editOpportunityGraphRow}
        graphRow={editOpportunityGraphRowGraphRow}
        setOpportunity={setEditOpportunityGraphRow}
        setGraphRow={setEditOpportunityGraphRowGraphRow}
      />
      <DeleteOpportunityGraphRowDialog
        opportunity={deleteOpportunityGraphRow}
        graphRow={deleteOpportunityGraphRowGraphRow}
        setOpportunity={setDeleteOpportunityGraphRow}
        setGraphRow={setDeleteOpportunityGraphRowGraphRow}
      />
      <EditOpportunityTypeDialog
        opportunity={editOpportunityType}
        setOpportunity={setEditOpportunityType}
      />
      <DeleteOpportunityTypeDialog
        opportunity={deleteOpportunityType}
        setOpportunity={setDeleteOpportunityType}
      />
      <EditOpportunityTypeDetailsDialog
        opportunity={editOpportunityTypeDetails}
        setOpportunity={setEditOpportunityTypeDetails}
      />
      <DeleteOpportunityTypeDetailsDialog
        opportunity={deleteOpportunityTypeDetails}
        setOpportunity={setDeleteOpportunityTypeDetails}
      />
    </SidebarInset>
  );
};

export default Page;
