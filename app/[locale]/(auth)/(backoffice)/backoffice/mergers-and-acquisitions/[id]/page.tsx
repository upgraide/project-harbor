/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: 26 */
/** biome-ignore-all lint/style/noMagicNumbers: Chart configuration requires magic numbers for domain calculations */
"use client";

import { useQuery } from "convex/react";
import {
  EllipsisVerticalIcon,
  LoaderIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { use, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import type z from "zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { backofficeMergersAndAcquisitionsPath } from "@/lib/paths";
import { useScopedI18n } from "@/locales/client";
import { AddOpportunityGraphRowDialog } from "./_components/add-opportunity-graph-row-dialog";
import { DeleteOpportunityGraphRowDialog } from "./_components/delete-opportunity-graph-row-dialog";
import { DeleteOpportunityIndustryDialog } from "./_components/delete-opportunity-industry-dialog";
import { DeleteOpportunityTypeDetailsDialog } from "./_components/delete-opportunity-type-details-dialog";
import { DeleteOpportunityTypeDialog } from "./_components/delete-opportunity-type-dialog";
import { EditOpportunityDescriptionDialog } from "./_components/edit-opportunity-description-dialog";
import {
  EditOpportunityGraphRowDialog,
  type editOpportunityGraphRowSchema,
} from "./_components/edit-opportunity-graph-row-dialog";
import { EditOpportunityIndustryDialog } from "./_components/edit-opportunity-industry-dialog";
import { EditOpportunityTypeDetailsDialog } from "./_components/edit-opportunity-type-details";
import { EditOpportunityTypeDialog } from "./_components/edit-opportunity-type-dialog";

const chartConfig = {
  revenue: {
    label: "Revenue (k€)",
    color: "#113152",
  },
  ebitda: {
    label: "EBITDA (M€)",
    color: "#4F565A",
  },
  ebitdaMargin: {
    label: "EBITDA Margin (%)",
    color: "#9C3E11",
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
  const [editOpportunityIndustry, setEditOpportunityIndustry] =
    useState<MergersAndAcquisitions | null>(null);
  const [deleteOpportunityIndustry, setDeleteOpportunityIndustry] =
    useState<MergersAndAcquisitions | null>(null);

  const opportunity = useQuery(api.mergersAndAcquisitions.getById, {
    id,
  });

  if (!opportunity) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderIcon className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarInset className="bg-muted">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mr-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
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

      <div className="mx-auto mt-6 mb-6 w-full space-y-6 md:max-w-screen-md">
        <h1 className="mt-6 font-bold text-2xl md:text-4xl">
          {opportunity.name}
        </h1>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
              {t("imagesCard.title")}
            </CardTitle>
            <Button variant="outline">
              <PlusIcon className="size-4" />
              {t("imagesCard.buttons.add")}
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2">
            {opportunity.imagesUrls?.map((imageUrl, index) => (
              <div key={index}>
                <Image
                  alt={`Opportunity Image ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                  height={4501}
                  src={imageUrl ?? ""}
                  width={4501}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
              {t("descriptionCard.title")}
            </CardTitle>
            <Button
              onClick={() =>
                setOpportunityDescriptionToEdit({
                  ...opportunity,
                  createdBy: opportunity.createdBy?._id ?? "",
                })
              }
              variant="outline"
            >
              <PencilIcon className="size-4" />
              {t("descriptionCard.buttons.edit")}
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {opportunity.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="font-semibold text-xl">
              {t("financialPerformanceCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
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
                  tickFormatter={(value) => value.slice(0, 5)}
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
                  domain={[
                    (dataMax: number) => {
                      const padding = dataMax * 0.3;
                      return Math.ceil(dataMax + padding);
                    },
                    0,
                  ]}
                  hide={true}
                  orientation="right"
                  reversed={true}
                  stroke="#9C3E11"
                  yAxisId="margin"
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                  cursor={false}
                />
                <Bar
                  dataKey="revenue"
                  fill="#113152"
                  label={{ position: "top", fontSize: 12 }}
                  radius={[4, 4, 0, 0]}
                  yAxisId="left"
                />
                <Line
                  dataKey="ebitda"
                  dot={false}
                  stroke="#AEAEAE"
                  strokeWidth={2}
                  type="monotone"
                  yAxisId="right"
                />
                <Line
                  dataKey="ebitdaMargin"
                  dot={{ fill: "#9C3E11", r: 4 }}
                  label={{
                    position: "top",
                    formatter: (value: number) => `${value}%`,
                    fontSize: 12,
                  }}
                  stroke="#9C3E11"
                  strokeWidth={0}
                  type="monotone"
                  yAxisId="margin"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </ComposedChart>
            </ChartContainer>

            <Card className="mt-4">
              <CardHeader className="flex items-center justify-between border-b">
                <CardTitle className="font-semibold text-xl">
                  {t("financialPerformanceCard.graphRowsCard.title")}
                </CardTitle>
                <Button
                  onClick={() =>
                    setAddOpportunityGraphRow({
                      ...opportunity,
                      createdBy: opportunity.createdBy?._id ?? "",
                    })
                  }
                  variant="outline"
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
                          "financialPerformanceCard.graphRowsCard.table.revenue"
                        )}
                      </TableHead>
                      <TableHead>
                        {t(
                          "financialPerformanceCard.graphRowsCard.table.ebitda"
                        )}
                      </TableHead>
                      <TableHead className="text-right" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunity.graphRows?.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell>{row.revenue}</TableCell>
                        <TableCell>{row.ebitda}</TableCell>
                        <TableCell>{row.ebitdaMargin}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
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
                                  "financialPerformanceCard.graphRowsCard.table.buttons.edit"
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
                                  "financialPerformanceCard.graphRowsCard.table.buttons.delete"
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
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
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
                  <TableHead className="px-6 py-4 text-right">
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
                        <Button size="icon" variant="ghost">
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
                        <Button size="icon" variant="ghost">
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditOpportunityIndustry({
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
                              setDeleteOpportunityIndustry({
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
                <TableRow key={"industrySubsector"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.industrySubsector")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.industrySubsector ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"dimension"}>
                  <TableCell className="bg-muted px-6 py-4 font-medium">
                    {t("preNDAInformationCard.table.dimension")}
                  </TableCell>
                  <TableCell className="bg-muted px-6 py-4" />
                  <TableCell className="bg-muted px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"sales"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.sales")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    €{opportunity.sales ?? "N/A"}M
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"ebitda"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.ebitda")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    €{opportunity.ebitda ?? "N/A"}M
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"ebitdaNormalized"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.ebitdaNormalized")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaNormalized ?? "N/A"}x
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"netDebt"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.netDebt")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    €{opportunity.netDebt ?? "N/A"}M
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"CAGR"}>
                  <TableCell className="bg-muted px-6 py-4 font-medium">
                    {t("preNDAInformationCard.table.cagr")}
                  </TableCell>
                  <TableCell className="bg-muted px-6 py-4" />
                  <TableCell className="bg-muted px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"salesCAGR"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.salesCAGR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.salesCAGR ?? "N/A"}%
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"ebitdaCAGR"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.ebitdaCAGR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaCAGR ?? "N/A"}%
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"Asset"}>
                  <TableCell className="bg-muted px-6 py-4 font-medium">
                    {t("preNDAInformationCard.table.asset")}
                  </TableCell>
                  <TableCell className="bg-muted px-6 py-4" />
                  <TableCell className="bg-muted px-6 py-4 text-right" />
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
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"estimatedAssetValue"}>
                  <TableCell className="px-6 py-4">
                    {t("preNDAInformationCard.table.estimatedAssetValue")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.estimatedAssetValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
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
                  <TableHead className="px-6 py-4 text-right">
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
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"entrepriseValue"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.entrepriseValue")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entrepriseValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"equityValue"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.equityValue")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"evDashEbitdaEntry"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.evDashEbitdaEntry")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaEntry ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"evDashEbitdaExit"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.evDashEbitdaExit")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaExit ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"ebitdaMargin"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.ebitdaMargin")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaMargin ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"fcf"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.fcf")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.fcf ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"netDebtDashEbitda"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.netDebtDashEbitda")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netDebtDashEbitda ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"capexItensity"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.capexIntensity")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexItensity ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"workingCapitalNeeds"}>
                  <TableCell className="px-6 py-4">
                    {t("postNDAInformationCard.table.workingCapitalNeeds")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.workingCapitalNeeds ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
              {t("shareholderInformationCard.title")}
            </CardTitle>
            <Button variant="outline">
              <PlusIcon className="size-4" />
              {t("shareholderInformationCard.buttons.add")}
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2">
            {opportunity.shareholderStructureUrls?.map((imageUrl, index) => (
              <div key={index}>
                <Image
                  alt={`Opportunity Image ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                  height={4501}
                  src={imageUrl ?? ""}
                  width={4501}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semid text-xl">
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
                  <TableHead className="px-6 py-4 text-right">
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
                      "limitedPartnerInformationCard.table.equityContribution"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityContribution ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"grossIRR"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.grossIRR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.grossIRR ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"netIRR"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.netIRR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netIRR ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"moic"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.moic")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.moic ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"cashOnCashReturn"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.cashOnCashReturn")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashOnCashReturn ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"cashConvertion"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.cashConvertion")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashConvertion ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"entryMultiple"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.entryMultiple")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entryMultiple ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"exitExpectedMultiple"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "limitedPartnerInformationCard.table.exitExpectedMultiple"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.exitExpectedMultiple ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
                <TableRow key={"holdPeriod"}>
                  <TableCell className="px-6 py-4">
                    {t("limitedPartnerInformationCard.table.holdPeriod")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.holdPeriod ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
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
        graphRow={editOpportunityGraphRowGraphRow}
        opportunity={editOpportunityGraphRow}
        setGraphRow={setEditOpportunityGraphRowGraphRow}
        setOpportunity={setEditOpportunityGraphRow}
      />
      <DeleteOpportunityGraphRowDialog
        graphRow={deleteOpportunityGraphRowGraphRow}
        opportunity={deleteOpportunityGraphRow}
        setGraphRow={setDeleteOpportunityGraphRowGraphRow}
        setOpportunity={setDeleteOpportunityGraphRow}
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
      <EditOpportunityIndustryDialog
        opportunity={editOpportunityIndustry}
        setOpportunity={setEditOpportunityIndustry}
      />
      <DeleteOpportunityIndustryDialog
        opportunity={deleteOpportunityIndustry}
        setOpportunity={setDeleteOpportunityIndustry}
      />
    </SidebarInset>
  );
};

export default Page;
