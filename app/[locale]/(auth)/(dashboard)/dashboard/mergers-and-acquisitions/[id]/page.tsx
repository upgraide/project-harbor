/** biome-ignore-all lint/style/noMagicNumbers: Rewriting the page to use the new components */
/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: Rewriting the page  */
"use client";

import { useQuery } from "convex/react";
import { LoaderIcon } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useScopedI18n } from "@/locales/client";

const chartConfig = {
  revenue: {
    label: "Revenue (M€)",
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

const Page = ({
  params,
}: {
  params: Promise<{ id: Id<"mergersAndAcquisitions"> }>;
}) => {
  const { id } = use(params);
  const t = useScopedI18n("dashboardMergersAndAcquisitionsOpportunityPage");
  const [notInterestedReason, setNotInterestedReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <div className="mx-auto mt-6 mb-6 w-full space-y-6 md:max-w-7xl">
      <h1 className="mt-6 font-bold text-2xl md:text-4xl">
        {opportunity.name}
      </h1>

      {opportunity.imagesUrls && opportunity.imagesUrls.length > 0 && (
        <>
          <div className="w-full">
            <Image
              alt="Opportunity Image 1"
              className="h-96 w-full object-cover"
              height={4501}
              src={opportunity.imagesUrls[3] ?? ""}
              width={4501}
            />
          </div>

          {opportunity.imagesUrls.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {opportunity.imagesUrls.slice(0, 3).map((imageUrl, index) => (
                <div key={index + 1}>
                  <Image
                    alt={`Opportunity Image ${index + 2}`}
                    className="h-48 w-full object-cover"
                    height={200}
                    src={imageUrl ?? ""}
                    width={300}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Card className="mx-4 bg-background shadow-none">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="font-semibold text-xl">
            {t("description")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-balance text-muted-foreground text-sm">
            {opportunity.description}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 items-center gap-4 align-middle md:grid-cols-2">
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="font-semibold text-xl">
              {t("financialInformationCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("financialInformationCard.table.header.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("financialInformationCard.table.header.value")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunity.type ? (
                  <TableRow key={"type"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.type")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {(() => {
                        if (opportunity.type === "Buy In") {
                          return t(
                            "financialInformationCard.table.values.buyIn"
                          );
                        }
                        if (opportunity.type === "Buy Out") {
                          return t(
                            "financialInformationCard.table.values.buyOut"
                          );
                        }
                        return t(
                          "financialInformationCard.table.values.buyInBuyOut"
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.typeDetails ? (
                  <TableRow key={"typeDetails"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.typeDetails")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {(() => {
                        if (opportunity.typeDetails === "Maioritário") {
                          return t(
                            "financialInformationCard.table.values.majority"
                          );
                        }
                        if (opportunity.typeDetails === "Minoritário") {
                          return t(
                            "financialInformationCard.table.values.minority"
                          );
                        }
                        return t(
                          "financialInformationCard.table.values.hundredPercent"
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.industry ? (
                  <TableRow key={"industry"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.industry")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {(() => {
                        if (opportunity.industry === "Services") {
                          return t(
                            "financialInformationCard.table.values.services"
                          );
                        }
                        if (
                          opportunity.industry === "Transformation Industry"
                        ) {
                          return t(
                            "financialInformationCard.table.values.transformationindustry"
                          );
                        }
                        if (opportunity.industry === "Trading") {
                          return t(
                            "financialInformationCard.table.values.trading"
                          );
                        }
                        if (
                          opportunity.industry === "Energy & Infrastructure"
                        ) {
                          return t(
                            "financialInformationCard.table.values.energyandinfrastructure"
                          );
                        }
                        if (opportunity.industry === "Fitness") {
                          return t(
                            "financialInformationCard.table.values.fitness"
                          );
                        }
                        if (
                          opportunity.industry ===
                          "Healthcare & Pharmaceuticals"
                        ) {
                          return t(
                            "financialInformationCard.table.values.healthcareandpharmaceuticals"
                          );
                        }
                        if (opportunity.industry === "IT") {
                          return t("financialInformationCard.table.values.it");
                        }
                        if (
                          opportunity.industry ===
                          "TMT (Technology, Media & Telecom)"
                        ) {
                          return t("financialInformationCard.table.values.tmt");
                        }
                        if (opportunity.industry === "Transports") {
                          return t(
                            "financialInformationCard.table.values.transports"
                          );
                        }
                        return opportunity.industry;
                      })()}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.industrySubsector ? (
                  <TableRow key={"industrySubsector"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.metrics.industrySubsector"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {(() => {
                        if (
                          opportunity.industrySubsector === "Business Services"
                        ) {
                          return t(
                            "financialInformationCard.table.values.businessservices"
                          );
                        }
                        if (
                          opportunity.industrySubsector === "Financial Services"
                        ) {
                          return t(
                            "financialInformationCard.table.values.financialservices"
                          );
                        }
                        if (
                          opportunity.industrySubsector ===
                          "Construction & Materials"
                        ) {
                          return t(
                            "financialInformationCard.table.values.constructionandmaterials"
                          );
                        }
                        if (
                          opportunity.industrySubsector === "Food & Beverages"
                        ) {
                          return t(
                            "financialInformationCard.table.values.foodandbeverages"
                          );
                        }
                        if (opportunity.industrySubsector === "Others") {
                          return t(
                            "financialInformationCard.table.values.others"
                          );
                        }
                        return opportunity.industrySubsector;
                      })()}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.sales ||
                opportunity.ebitda ||
                opportunity.ebitdaNormalized ||
                opportunity.netDebt ? (
                  <TableRow key={"dimension"}>
                    <TableCell className="bg-muted px-6 py-4 font-medium">
                      {t("financialInformationCard.table.metrics.dimension")}
                    </TableCell>
                    <TableCell className="bg-muted px-6 py-4" />
                  </TableRow>
                ) : null}
                {opportunity.sales ? (
                  <TableRow key={"sales"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.sales")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`€${opportunity.sales}M`}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitda ? (
                  <TableRow key={"ebitda"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.ebitda")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`€${opportunity.ebitda}M`}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitdaNormalized ? (
                  <TableRow key={"ebitdaNormalized"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.metrics.ebitdaNormalized"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.ebitdaNormalized}x`}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.netDebt ? (
                  <TableRow key={"netDebt"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.netDebt")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`€${opportunity.netDebt}M`}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.salesCAGR || opportunity.ebitdaCAGR ? (
                  <TableRow key={"CAGR"}>
                    <TableCell className="bg-muted px-6 py-4 font-medium">
                      {t("financialInformationCard.table.metrics.cagr")}
                    </TableCell>
                    <TableCell className="bg-muted px-6 py-4" />
                  </TableRow>
                ) : null}
                {opportunity.salesCAGR ? (
                  <TableRow key={"salesCAGR"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.salesCAGR")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.salesCAGR}%`}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitdaCAGR ? (
                  <TableRow key={"ebitdaCAGR"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.ebitdaCAGR")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.ebitdaCAGR}%`}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.assetIncluded ||
                opportunity.estimatedAssetValue ? (
                  <TableRow key={"Asset"}>
                    <TableCell className="bg-muted px-6 py-4 font-medium">
                      {t("financialInformationCard.table.asset")}
                    </TableCell>
                    <TableCell className="bg-muted px-6 py-4" />
                  </TableRow>
                ) : null}
                {opportunity.assetIncluded ? (
                  <TableRow key={"assetIncluded"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.assetIncluded")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.assetIncluded ? t("yes") : t("no")}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.estimatedAssetValue ? (
                  <TableRow key={"estimatedAssetValue"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.estimatedAssetValue")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`€${opportunity.estimatedAssetValue}M`}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none bg-background shadow-none">
          <CardHeader>
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
                  fill="#113152"
                  label={{
                    position: "top",
                    fontSize: 12,
                    fontWeight: 600,
                    fill: "#000000",
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
                  stroke="#AEAEAE"
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
      </div>

      {opportunity.preNDANotes ? (
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="font-semibold text-xl">
              Notas sobre o projeto
            </CardTitle>
          </CardHeader>
          <CardContent>{opportunity.preNDANotes}</CardContent>
        </Card>
      ) : null}

      <Card className="border-none bg-background shadow-none">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="font-semibold text-xl">
            {t("furtherInformationCard.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4">
                  {t("furtherInformationCard.table.header.metric")}
                </TableHead>
                <TableHead className="px-6 py-4">
                  {t("furtherInformationCard.table.header.value")}
                </TableHead>
                <TableHead className="px-6 py-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunity.im ? (
                <TableRow key={"im"}>
                  <TableCell className="px-6 py-4">
                    {t("furtherInformationCard.table.metrics.im")}
                  </TableCell>
                  <TableCell className="px-6 py-4">{opportunity.im}</TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              <TableRow key={"entrepriseValue"}>
                <TableCell className="px-6 py-4">
                  {t("furtherInformationCard.table.metrics.entrepriseValue")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.entrepriseValue ?? "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right" />
              </TableRow>
              <TableRow key={"equityValue"}>
                <TableCell className="px-6 py-4">
                  {t("furtherInformationCard.table.metrics.equityValue")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.equityValue ?? "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right" />
              </TableRow>
              <TableRow key={"evDashEbitdaEntry"}>
                <TableCell className="px-6 py-4">
                  {t("furtherInformationCard.table.metrics.evDashEbitdaEntry")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.evDashEbitdaEntry ?? "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right" />
              </TableRow>
              <TableRow key={"evDashEbitdaExit"}>
                <TableCell className="px-6 py-4">
                  {t("furtherInformationCard.table.metrics.evDashEbitdaExit")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.evDashEbitdaExit ?? "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right" />
              </TableRow>
              <TableRow key={"ebitdaMargin"}>
                <TableCell className="px-6 py-4">
                  {t("furtherInformationCard.table.metrics.ebitdaMargin")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.ebitdaMargin ?? "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right" />
              </TableRow>
              <TableRow key={"fcf"}>
                <TableCell className="px-6 py-4">
                  {t("furtherInformationCard.table.metrics.freeCashFlow")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.fcf ?? "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right" />
              </TableRow>
              <TableRow key={"netDebtDashEbitda"}>
                <TableCell className="px-6 py-4">
                  {t("furtherInformationCard.table.metrics.netDebtDashEbitda")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.netDebtDashEbitda ?? "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right" />
              </TableRow>
              <TableRow key={"capexItensity"}>
                <TableCell className="px-6 py-4">
                  {t("furtherInformationCard.table.metrics.capexIntensity")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.capexItensity ?? "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right" />
              </TableRow>
              <TableRow key={"workingCapitalNeeds"}>
                <TableCell className="px-6 py-4">
                  {t(
                    "furtherInformationCard.table.metrics.workingCapitalNeeds"
                  )}
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

      <div className="grid grid-cols-1 items-center gap-4 align-middle md:grid-cols-2">
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="font-semid text-xl">
              {t("coInvestmentInformationCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("coInvestmentInformationCard.table.header.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("coInvestmentInformationCard.table.header.value")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"equityContribution"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "coInvestmentInformationCard.table.metrics.equityContribution"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityContribution ?? "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key={"grossIRR"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentInformationCard.table.metrics.grossIRR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.grossIRR ?? "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key={"netIRR"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentInformationCard.table.metrics.netIRR")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netIRR ?? "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key={"moic"}>
                  <TableCell className="px-6 py-4">
                    {t("coInvestmentInformationCard.table.metrics.moic")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.moic ?? "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key={"cashOnCashReturn"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "coInvestmentInformationCard.table.metrics.cashOnCashReturn"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashOnCashReturn ?? "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key={"cashConvertion"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "coInvestmentInformationCard.table.metrics.cashConvertion"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashConvertion ?? "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key={"entryMultiple"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "coInvestmentInformationCard.table.metrics.entryMultiple"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entryMultiple ?? "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key={"exitExpectedMultiple"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "coInvestmentInformationCard.table.metrics.exitExpectedMultiple"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.exitExpectedMultiple ?? "N/A"}
                  </TableCell>
                </TableRow>
                {opportunity.holdPeriod ? (
                  <TableRow key={"holdPeriod"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "coInvestmentInformationCard.table.metrics.holdPeriod"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.holdPeriod}{" "}
                      {t("coInvestmentInformationCard.table.metrics.years")}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none bg-background shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="font-semibold text-xl">
              {t("shareholderInformationCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {opportunity.shareholderStructureUrls?.map((imageUrl, index) => (
              <div className="w-full" key={index}>
                <Image
                  alt={`Opportunity Image ${index + 1}`}
                  className="h-96 w-full"
                  height={4501}
                  src={imageUrl ?? ""}
                  width={4501}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <Button size={"lg"}>{t("actionButtons.interestToInvest")}</Button>
        {opportunity.coInvestment === true ? (
          <Button size={"lg"} variant={"outline"}>
            {t("actionButtons.coInvest")}
          </Button>
        ) : null}
        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button size={"lg"} variant={"destructive"}>
              {t("actionButtons.notInterested")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("notInterestedDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("notInterestedDialog.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                className="min-h-[100px]"
                id="reason"
                onChange={(e) => setNotInterestedReason(e.target.value)}
                placeholder={t("notInterestedDialog.placeholder")}
                value={notInterestedReason}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setIsDialogOpen(false);
                  setNotInterestedReason("");
                }}
                variant="outline"
              >
                {t("notInterestedDialog.buttons.cancel")}
              </Button>
              <Button
                disabled={!notInterestedReason.trim()}
                onClick={() => {
                  // Here you would typically send the reason to your backend
                  // For now, just close the dialog and reset the form
                  setIsDialogOpen(false);
                  setNotInterestedReason("");
                }}
                variant="destructive"
              >
                {t("notInterestedDialog.buttons.submit")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
