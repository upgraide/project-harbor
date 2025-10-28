/** biome-ignore-all lint/style/noNestedTernary: This is a complex component */
/** biome-ignore-all lint/style/noMagicNumbers: Ignored */
"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorView, LoadingView } from "@/components/entity-components";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  useGetMergerAndAcquisitionInterest,
  useMarkMergerAndAcquisitionInterest,
  useMarkMergerAndAcquisitionNoInterest,
  useSignMergerAndAcquisitionNDA,
  useSuspenseOpportunity,
} from "@/features/opportunities/hooks/use-m&a-opportunities";
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

const chartConfig = (t: ReturnType<typeof useScopedI18n>, isDark: boolean) =>
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

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex component
export const Viewer = ({ opportunityId }: { opportunityId: string }) => {
  const t = useScopedI18n("dashboard.mAndAViewer");
  const locale = useCurrentLocale();
  const { theme, resolvedTheme } = useTheme();
  const isDark =
    resolvedTheme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);

  const { data: preloadedInterest } =
    useGetMergerAndAcquisitionInterest(opportunityId);

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

  const hasCoInvestmentData = () => {
    if (!opportunity.coInvestment) {
      return null;
    }
    return (
      opportunity.coInvestment != null ||
      opportunity.equityContribution != null ||
      opportunity.grossIRR != null ||
      opportunity.netIRR != null ||
      opportunity.moic != null ||
      opportunity.cashOnCashReturn != null ||
      opportunity.cashConvertion != null ||
      opportunity.entryMultiple != null ||
      opportunity.exitExpectedMultiple != null ||
      opportunity.holdPeriod != null
    );
  };

  const hasPostNDAData = () =>
    opportunity.im != null ||
    opportunity.entrepriseValue != null ||
    opportunity.equityValue != null ||
    opportunity.evDashEbitdaEntry != null ||
    opportunity.evDashEbitdaExit != null ||
    opportunity.ebitdaMargin != null ||
    opportunity.fcf != null ||
    opportunity.netDebtDashEbitda != null ||
    opportunity.capexItensity != null ||
    opportunity.workingCapitalNeeds != null;

  const hasShareholderStructure = () =>
    opportunity.shareholderStructure != null &&
    opportunity.shareholderStructure.length > 0;

  const [showNotInterestedDialog, setShowNotInterestedDialog] = useState(false);
  const [notInterestedReason, setNotInterestedReason] = useState("");
  const [userInterest, setUserInterest] = useState<{
    interested: boolean;
    ndaSigned: boolean;
  }>({
    interested: preloadedInterest?.interested ?? false,
    ndaSigned: preloadedInterest?.ndaSigned ?? false,
  });

  const handleMarkInterest = useMarkMergerAndAcquisitionInterest(() =>
    setUserInterest((prev) => ({ ...prev, interested: true }))
  );
  const handleMarkNoInterest = useMarkMergerAndAcquisitionNoInterest(() =>
    setUserInterest((prev) => ({ ...prev, interested: false }))
  );
  const handleSignNDA = useSignMergerAndAcquisitionNDA(() =>
    setUserInterest((prev) => ({ ...prev, ndaSigned: true }))
  );

  useEffect(() => {
    setUserInterest((prev) => ({
      ...prev,
      interested: preloadedInterest?.interested ?? false,
      ndaSigned: preloadedInterest?.ndaSigned ?? false,
    }));
  }, [preloadedInterest]);

  return (
    <main className="m-4 flex max-w-screen-xs flex-1 flex-col space-y-6 md:mx-auto md:max-w-screen-xl">
      <h1 className="font-bold text-2xl md:text-4xl">{opportunity.name}</h1>

      {hasImages() && (
        <section>
          <Card className="mx-24 border-none bg-transparent shadow-none">
            <CardContent>
              {opportunity.images && opportunity.images.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {opportunity.images.length === 1 ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted md:aspect-video">
                      <Image
                        alt="Opportunity image"
                        className="object-cover"
                        fill
                        src={opportunity.images[0]}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted md:aspect-video">
                        <Image
                          alt="Opportunity image"
                          className="object-cover"
                          fill
                          src={opportunity.images[0]}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {opportunity.images.slice(1).map((imageUrl) => (
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
                    </>
                  )}
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
          <div className="min-h-64 w-full flex-1 md:min-h-96">
            <Card className="h-full border-none bg-transparent shadow-none">
              <CardContent className="h-full p-2 md:p-4">
                <ChartContainer
                  className="h-full w-full"
                  config={chartConfig(t, isDark)}
                >
                  <ComposedChart
                    accessibilityLayer
                    data={opportunity.graphRows ?? []}
                    margin={{
                      left: 30,
                      right: 30,
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
          </div>
        )}
      </div>

      {hasPostNDAData() && userInterest?.ndaSigned === true && (
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunity.im != null && (
                    <TableRow key="im">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.im.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.im}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.entrepriseValue != null && (
                    <TableRow key="enterpriseValue">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.enterpriseValue.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.enterpriseValue.prefix") +
                          opportunity.entrepriseValue +
                          t("postNDACard.table.body.enterpriseValue.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.equityValue != null && (
                    <TableRow key="equityValue">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.equityValue.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.equityValue.prefix") +
                          opportunity.equityValue +
                          t("postNDACard.table.body.equityValue.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.evDashEbitdaEntry != null && (
                    <TableRow key="evDashEbitdaEntry">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.evDashEbitdaEntry.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.evDashEbitdaEntry +
                          t("postNDACard.table.body.evDashEbitdaEntry.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.evDashEbitdaExit != null && (
                    <TableRow key="evDashEbitdaExit">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.evDashEbitdaExit.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.evDashEbitdaExit +
                          t("postNDACard.table.body.evDashEbitdaExit.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.ebitdaMargin != null && (
                    <TableRow key="ebitdaMargin">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.ebitdaMargin.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.ebitdaMargin +
                          t("postNDACard.table.body.ebitdaMargin.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.fcf != null && (
                    <TableRow key="fcf">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.fcf.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.fcf.prefix") +
                          opportunity.fcf +
                          t("postNDACard.table.body.fcf.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.netDebtDashEbitda != null && (
                    <TableRow key="netDebtDashEbitda">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.netDebtDashEbitda.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.netDebtDashEbitda +
                          t("postNDACard.table.body.netDebtDashEbitda.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.capexItensity != null && (
                    <TableRow key="capexItensity">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.capexItensity.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.capexItensity +
                          t("postNDACard.table.body.capexItensity.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.workingCapitalNeeds != null && (
                    <TableRow key="workingCapitalNeeds">
                      <TableCell className="px-6 py-4">
                        {t("postNDACard.table.body.workingCapitalNeeds.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.workingCapitalNeeds +
                          t("postNDACard.table.body.workingCapitalNeeds.units")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {hasShareholderStructure() && userInterest?.ndaSigned === true && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("shareholderStructureCard.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.shareholderStructure &&
              opportunity.shareholderStructure.length > 0 ? (
                <div className="mx-24 flex flex-col gap-4">
                  {opportunity.shareholderStructure.map((imageUrl) => (
                    <div
                      className="relative aspect-square overflow-hidden rounded-lg bg-muted md:aspect-video"
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
                    {t("shareholderStructureCard.noImages")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {hasCoInvestmentData() && userInterest?.ndaSigned === true && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunity.equityContribution != null && (
                    <TableRow key="equityContribution">
                      <TableCell className="px-6 py-4">
                        {t(
                          "coInvestmentCard.table.body.equityContribution.label"
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.equityContribution +
                          t(
                            "coInvestmentCard.table.body.equityContribution.units"
                          )}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.grossIRR != null && (
                    <TableRow key="grossIRR">
                      <TableCell className="px-6 py-4">
                        {t("coInvestmentCard.table.body.grossIRR.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.grossIRR +
                          t("coInvestmentCard.table.body.grossIRR.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.netIRR != null && (
                    <TableRow key="netIRR">
                      <TableCell className="px-6 py-4">
                        {t("coInvestmentCard.table.body.netIRR.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.netIRR +
                          t("coInvestmentCard.table.body.netIRR.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.moic != null && (
                    <TableRow key="moic">
                      <TableCell className="px-6 py-4">
                        {t("coInvestmentCard.table.body.moic.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.moic +
                          t("coInvestmentCard.table.body.moic.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.cashOnCashReturn != null && (
                    <TableRow key="cashOnCashReturn">
                      <TableCell className="px-6 py-4">
                        {t(
                          "coInvestmentCard.table.body.cashOnCashReturn.label"
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.cashOnCashReturn +
                          t(
                            "coInvestmentCard.table.body.cashOnCashReturn.units"
                          )}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.cashConvertion != null && (
                    <TableRow key="cashConvertion">
                      <TableCell className="px-6 py-4">
                        {t("coInvestmentCard.table.body.cashConvertion.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.cashConvertion +
                          t("coInvestmentCard.table.body.cashConvertion.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.entryMultiple != null && (
                    <TableRow key="entryMultiple">
                      <TableCell className="px-6 py-4">
                        {t("coInvestmentCard.table.body.entryMultiple.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.entryMultiple +
                          t("coInvestmentCard.table.body.entryMultiple.units")}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.exitExpectedMultiple != null && (
                    <TableRow key="exitExpectedMultiple">
                      <TableCell className="px-6 py-4">
                        {t(
                          "coInvestmentCard.table.body.exitExpectedMultiple.label"
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.exitExpectedMultiple +
                          t(
                            "coInvestmentCard.table.body.exitExpectedMultiple.units"
                          )}
                      </TableCell>
                    </TableRow>
                  )}
                  {opportunity.holdPeriod != null && (
                    <TableRow key="holdPeriod">
                      <TableCell className="px-6 py-4">
                        {t("coInvestmentCard.table.body.holdPeriod.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.holdPeriod +
                          " " +
                          t("coInvestmentCard.table.body.holdPeriod.units")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <Button
          className="w-full sm:w-auto"
          disabled={
            handleMarkInterest.isPending || userInterest?.interested === true
          }
          onClick={() => handleMarkInterest.mutate({ opportunityId })}
          type="button"
          variant={userInterest?.interested ? "default" : "outline"}
        >
          {handleMarkInterest.isPending ? (
            <Spinner className="mr-2" />
          ) : userInterest?.interested ? (
            t("buttons.markInterestedDone")
          ) : (
            t("buttons.markInterested")
          )}
        </Button>
        <Button
          className="w-full sm:w-auto"
          disabled={
            handleMarkNoInterest.isPending ||
            (userInterest?.interested === false && !userInterest?.ndaSigned)
          }
          onClick={() => setShowNotInterestedDialog(true)}
          type="button"
          variant={
            userInterest?.interested === false && !userInterest?.ndaSigned
              ? "destructive"
              : "outline"
          }
        >
          {handleMarkNoInterest.isPending ? (
            <Spinner className="mr-2" />
          ) : userInterest?.interested === false && !userInterest?.ndaSigned ? (
            t("buttons.notInterestedDone")
          ) : (
            t("buttons.notInterested")
          )}
        </Button>
        <Button
          className="w-full sm:w-auto"
          disabled={handleSignNDA.isPending || userInterest?.ndaSigned === true}
          onClick={() => handleSignNDA.mutate({ opportunityId })}
          type="button"
          variant={userInterest?.ndaSigned ? "default" : "secondary"}
        >
          {handleSignNDA.isPending ? (
            <Spinner className="mr-2" />
          ) : userInterest?.ndaSigned ? (
            t("buttons.signNDADone")
          ) : (
            t("buttons.signNDA")
          )}
        </Button>
      </section>

      <AlertDialog
        onOpenChange={setShowNotInterestedDialog}
        open={showNotInterestedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("notInterestedDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("notInterestedDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            className="min-h-24"
            onChange={(e) => setNotInterestedReason(e.target.value)}
            placeholder={t("notInterestedDialog.placeholder")}
            value={notInterestedReason}
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel className="w-full sm:w-auto">
              {t("buttons.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto"
              onClick={() => {
                handleMarkNoInterest.mutate({
                  opportunityId,
                  reason: notInterestedReason || undefined,
                });
                setShowNotInterestedDialog(false);
                setNotInterestedReason("");
              }}
            >
              {t("buttons.submit")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
