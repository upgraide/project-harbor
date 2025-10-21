/** biome-ignore-all lint/style/noNestedTernary: This is a complex component */
/** biome-ignore-all lint/style/noMagicNumbers: Ignored */
"use client";

import Image from "next/image";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorView, LoadingView } from "@/components/entity-components";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuspenseOpportunity } from "@/features/opportunities/hooks/use-m&a-opportunities";
import { cn } from "@/lib/utils";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";

export const ViewerLoading = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return <LoadingView message={t("loadingMessage")} />;
};

export const ViewerError = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return <ErrorView message={t("errorMessage")} />;
};

const chartConfig = (t: ReturnType<typeof useScopedI18n>) =>
  ({
    revenue: {
      label: t("graphCard.table.header.revenue"),
      color: "#113152",
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

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex component
export const Viewer = ({ opportunityId }: { opportunityId: string }) => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  const locale = useCurrentLocale();
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);

  const hasDescription = () => {
    const desc =
      locale === "en"
        ? opportunity.englishDescription
        : opportunity.description;
    return desc != null && desc !== "";
  };

  const hasImages = () =>
    opportunity.images != null && opportunity.images.length > 0;

  const hasFinancialData = () =>
    opportunity.type != null ||
    opportunity.typeDetails != null ||
    opportunity.industry != null ||
    opportunity.industrySubsector != null ||
    opportunity.sales != null ||
    opportunity.ebitda != null ||
    opportunity.ebitdaNormalized != null ||
    opportunity.netDebt != null ||
    opportunity.salesCAGR != null ||
    opportunity.ebitdaCAGR != null ||
    opportunity.assetIncluded != null ||
    opportunity.estimatedAssetValue != null;

  const showDimension = () =>
    opportunity.sales != null ||
    opportunity.ebitda != null ||
    opportunity.ebitdaNormalized != null ||
    opportunity.netDebt != null;

  const showCAGRs = () =>
    opportunity.salesCAGR != null || opportunity.ebitdaCAGR != null;

  const showAsset = () =>
    opportunity.assetIncluded != null ||
    opportunity.estimatedAssetValue != null;

  const hasGraphData = () =>
    opportunity.graphRows != null && opportunity.graphRows.length > 0;

  return (
    <main className="m-4 flex max-w-screen-xs flex-1 flex-col space-y-6 md:mx-auto md:max-w-screen-xl">
      <h1 className="font-bold text-2xl md:text-4xl">{opportunity.name}</h1>

      {hasImages() && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("imagesCard.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.images && opportunity.images.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {opportunity.images.map((imageUrl) => (
                    <div
                      className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                      key={imageUrl}
                    >
                      <Image
                        alt="Opportunity image"
                        className="object-cover"
                        fill
                        src={imageUrl}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-muted-foreground/50 border-dashed py-12">
                  <p className="text-balance text-muted-foreground text-sm">
                    {t("imagesCard.noImages")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {hasDescription() && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("description")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasDescription() && (
                <p className="text-balance text-base">
                  {locale === "en"
                    ? opportunity.englishDescription
                    : opportunity.description}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      <div
        className={cn(
          "flex flex-col gap-6",
          hasFinancialData() &&
            hasGraphData() &&
            "md:flex-row md:items-center md:justify-center"
        )}
      >
        {hasFinancialData() && (
          <div className="flex-1">
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunity.type != null && (
                      <TableRow key="type">
                        <TableCell className="px-6 py-4">
                          {t("financialInformationCard.table.body.type.label")}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            `financialInformationCard.table.body.type.values.${opportunity.type}`
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {opportunity.typeDetails != null && (
                      <TableRow key="typeDetails">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.typeDetails.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            `financialInformationCard.table.body.typeDetails.values.${opportunity.typeDetails}`
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {opportunity.industry != null && (
                      <TableRow key="industry">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.industry.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            `financialInformationCard.table.body.industry.values.${opportunity.industry}`
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {opportunity.industrySubsector != null && (
                      <TableRow key="industrySubsector">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.industrySubsector.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            `financialInformationCard.table.body.industrySubsector.values.${opportunity.industrySubsector}`
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {showDimension() && (
                      <TableRow key="dimension">
                        <TableCell className="bg-muted px-6 py-4 font-medium">
                          {t(
                            "financialInformationCard.table.body.dimension.label"
                          )}
                        </TableCell>
                        <TableCell className="bg-muted px-6 py-4" />
                      </TableRow>
                    )}
                    {opportunity.sales != null && (
                      <TableRow key="sales">
                        <TableCell className="px-6 py-4">
                          {t("financialInformationCard.table.body.sales.label")}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            `financialInformationCard.table.body.sales.values.${opportunity.sales}`
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {opportunity.ebitda != null && (
                      <TableRow key="ebitda">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.ebitda.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            `financialInformationCard.table.body.ebitda.values.${opportunity.ebitda}`
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {opportunity.ebitdaNormalized != null && (
                      <TableRow key="ebitdaNormalized">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.ebitdaNormalized.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {opportunity.ebitdaNormalized +
                            t(
                              "financialInformationCard.table.body.ebitdaNormalized.units"
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                    {opportunity.netDebt != null && (
                      <TableRow key="netDebt">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.netDebt.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.netDebt.prefix"
                          ) +
                            opportunity.netDebt +
                            t(
                              "financialInformationCard.table.body.netDebt.units"
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                    {showCAGRs() && (
                      <TableRow key={"CAGRs"}>
                        <TableCell className="bg-muted px-6 py-4 font-medium">
                          {t("financialInformationCard.table.body.CAGRs.label")}
                        </TableCell>
                        <TableCell className="bg-muted px-6 py-4" />
                      </TableRow>
                    )}
                    {opportunity.salesCAGR != null && (
                      <TableRow key="salesCAGR">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.salesCAGR.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {opportunity.salesCAGR +
                            t(
                              "financialInformationCard.table.body.salesCAGR.units"
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                    {opportunity.ebitdaCAGR != null && (
                      <TableRow key="ebitdaCAGR">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.ebitdaCAGR.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {opportunity.ebitdaCAGR +
                            t(
                              "financialInformationCard.table.body.ebitdaCAGR.units"
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                    {showAsset() && (
                      <TableRow key="asset">
                        <TableCell className="bg-muted px-6 py-4 font-medium">
                          {t("financialInformationCard.table.body.asset.label")}
                        </TableCell>
                        <TableCell className="bg-muted px-6 py-4" />
                      </TableRow>
                    )}
                    {opportunity.assetIncluded != null && (
                      <TableRow key="assetIncluded">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.assetIncluded.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            `financialInformationCard.table.body.assetIncluded.${opportunity.assetIncluded ? "yes" : "no"}`
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {opportunity.estimatedAssetValue != null && (
                      <TableRow key="estimatedAssetValue">
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.estimatedAssetValue.label"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {t(
                            "financialInformationCard.table.body.estimatedAssetValue.prefix"
                          ) +
                            opportunity.estimatedAssetValue +
                            t(
                              "financialInformationCard.table.body.estimatedAssetValue.units"
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {hasGraphData() && (
          <div className="min-h-96 w-full flex-1">
            <Card className="h-full border-none bg-transparent shadow-none">
              <CardContent className="h-full">
                <ChartContainer
                  className="h-full w-full"
                  config={chartConfig(t)}
                >
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
                      domain={[
                        0,
                        (dataMax: number) => Math.ceil(dataMax * 1.3),
                      ]}
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
        )}
      </div>
    </main>
  );
};
