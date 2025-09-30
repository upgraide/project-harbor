"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { LoaderIcon, PlusIcon } from "lucide-react";
import { use } from "react";
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
import Image from "next/image";
import { useScopedI18n } from "@/locales/client";

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

const Page = ({
  params,
}: {
  params: Promise<{ id: Id<"mergersAndAcquisitions"> }>;
}) => {
  const { id } = use(params);
  const t = useScopedI18n("dashboardMergersAndAcquisitionsOpportunityPage");

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
    <>
      <div className="mx-auto md:max-w-screen-lg w-full mt-6 mb-6 space-y-6">
        <h1 className="text-2xl md:text-4xl font-bold mt-6">
          {opportunity.name}
        </h1>

        {opportunity.imagesUrls && opportunity.imagesUrls.length > 0 && (
          <>
            <div className="w-full">
              <Image
                src={opportunity.imagesUrls[3] ?? ""}
                alt="Opportunity Image 1"
                height={4501}
                width={4501}
                className="rounded-lg w-full h-96 object-cover"
              />
            </div>

            {opportunity.imagesUrls.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {opportunity.imagesUrls.slice(0, 3).map((imageUrl, index) => (
                  <div key={index + 1}>
                    <Image
                      src={imageUrl ?? ""}
                      alt={`Opportunity Image ${index + 2}`}
                      height={200}
                      width={300}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t("description")}
            </CardTitle>
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
                  tickFormatter={(value) => value.slice(0, 5)}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t("financialInformationCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("financialInformationCard.table.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("financialInformationCard.table.value")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunity.type ? (
                  <TableRow key={"type"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.type")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.type}
                    </TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.typeDetails ? (
                  <TableRow key={"typeDetails"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.typeDetails")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.typeDetails}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.industry ? (
                  <TableRow key={"industry"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.industry")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.industry}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.industrySubsector ? (
                  <TableRow key={"industrySubsector"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.industrySubsector")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.industrySubsector}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.sales ||
                opportunity.ebitda ||
                opportunity.ebitdaNormalized ||
                opportunity.netDebt ? (
                  <TableRow key={"dimension"}>
                    <TableCell className="px-6 py-4 font-medium bg-muted">
                      {t("financialInformationCard.table.dimension")}
                    </TableCell>
                    <TableCell className="px-6 py-4 bg-muted"></TableCell>
                    <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.sales ? (
                  <TableRow key={"sales"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.sales")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`€${opportunity.sales}M`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitda ? (
                  <TableRow key={"ebitda"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.ebitda")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`€${opportunity.ebitda}M`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitdaNormalized ? (
                  <TableRow key={"ebitdaNormalized"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.ebitdaNormalized")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.ebitdaNormalized}x`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.netDebt ? (
                  <TableRow key={"netDebt"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.netDebt")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`€${opportunity.netDebt}M`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.salesCAGR || opportunity.ebitdaCAGR ? (
                  <TableRow key={"CAGR"}>
                    <TableCell className="px-6 py-4 font-medium bg-muted">
                      {t("financialInformationCard.table.cagr")}
                    </TableCell>
                    <TableCell className="px-6 py-4 bg-muted"></TableCell>
                    <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.salesCAGR ? (
                  <TableRow key={"salesCAGR"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.salesCAGR")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.salesCAGR}%`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitdaCAGR ? (
                  <TableRow key={"ebitdaCAGR"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.ebitdaCAGR")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.ebitdaCAGR}%`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.assetIncluded ||
                opportunity.estimatedAssetValue ? (
                  <TableRow key={"Asset"}>
                    <TableCell className="px-6 py-4 font-medium bg-muted">
                      {t("financialInformationCard.table.asset")}
                    </TableCell>
                    <TableCell className="px-6 py-4 bg-muted"></TableCell>
                    <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
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
                    <TableCell className="text-right px-6 py-4"></TableCell>
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
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Further Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Metric</TableHead>
                  <TableHead className="px-6 py-4">Value</TableHead>
                  <TableHead className="text-right px-6 py-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunity.im ? (
                  <TableRow key={"im"}>
                    <TableCell className="px-6 py-4">IM</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.im}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                <TableRow key={"entrepriseValue"}>
                  <TableCell className="px-6 py-4">Entreprise Value</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entrepriseValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"equityValue"}>
                  <TableCell className="px-6 py-4">Equity Value</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"evDashEbitdaEntry"}>
                  <TableCell className="px-6 py-4">EV/EBITDA Entry</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaEntry ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"evDashEbitdaExit"}>
                  <TableCell className="px-6 py-4">EV/EBITDA Exit</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaExit ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitdaMargin"}>
                  <TableCell className="px-6 py-4">EBITDA Margin</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaMargin ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"fcf"}>
                  <TableCell className="px-6 py-4">FCF</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.fcf ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"netDebtDashEbitda"}>
                  <TableCell className="px-6 py-4">Net Debt/EBITDA</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netDebtDashEbitda ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"capexItensity"}>
                  <TableCell className="px-6 py-4">Capex Intensity</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexItensity ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"workingCapitalNeeds"}>
                  <TableCell className="px-6 py-4">
                    Working Capital Needs
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
              Shareholder Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {opportunity.shareholderStructureUrls?.map((imageUrl, index) => (
              <div className="w-full" key={index}>
                <Image
                  src={imageUrl ?? ""}
                  alt={`Opportunity Image ${index + 1}`}
                  height={4501}
                  width={4501}
                  className="rounded-lg w-full h-96"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semid">
              Co-Investment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Metric</TableHead>
                  <TableHead className="px-6 py-4">Value</TableHead>
                  <TableHead className="text-right px-6 py-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"equityContribution"}>
                  <TableCell className="px-6 py-4">
                    Equity Contribution
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityContribution ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"grossIRR"}>
                  <TableCell className="px-6 py-4">Gross IRR</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.grossIRR ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"netIRR"}>
                  <TableCell className="px-6 py-4">Net IRR</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netIRR ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"moic"}>
                  <TableCell className="px-6 py-4">MOIC</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.moic ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"cashOnCashReturn"}>
                  <TableCell className="px-6 py-4">
                    Cash On Cash Return
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashOnCashReturn ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"cashConvertion"}>
                  <TableCell className="px-6 py-4">Cash Convertion</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.cashConvertion ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"entryMultiple"}>
                  <TableCell className="px-6 py-4">Entry Multiple</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entryMultiple ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"exitExpectedMultiple"}>
                  <TableCell className="px-6 py-4">
                    Exit Expected Multiple
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.exitExpectedMultiple ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                {opportunity.holdPeriod ? (
                  <TableRow key={"holdPeriod"}>
                    <TableCell className="px-6 py-4">Hold Period</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.holdPeriod} years
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="w-full flex items-center gap-4">
          <Button size={"lg"}>Interest to Invest</Button>
          {opportunity.coInvestment === true ? (
            <Button size={"lg"} variant={"outline"}>
              Co-Invest
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Page;
