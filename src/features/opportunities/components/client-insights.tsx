"use client";

import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  useClientInsightsStats,
  useClientsByRegion,
  useClientAcquisitionTrend,
  useClientsByInvestmentRange,
  useClientsPerAdvisor,
  useClientTypeDistribution,
} from "@/features/opportunities/hooks/use-client-insights";
import { useScopedI18n } from "@/locales/client";
import { TrendingUp, TrendingDown } from "lucide-react";

const COLORS = [
  "#1D5C9B", // blue from schema
  "#679A85", // teal from schema
  "#9C3E11", // orange from schema
  "#113152", // navy from schema
  "#BECED7", // light blue from schema
  "#404040", // dark gray from schema
  "#1D5C9B", // blue (repeat)
  "#679A85", // teal (repeat)
  "#9C3E11", // orange (repeat)
  "#113152", // navy (repeat)
];

const formatNumber = (value: number): string => value.toLocaleString("en-US");

const formatInvestmentRange = (range: string): string => {
  if (range === "LESS_THAN_10M") return "<€10M";
  if (range === "BETWEEN_10M_100M") return "€10M-€100M";
  if (range === "GREATER_THAN_100M") return ">€100M";
  return range.replace(/_/g, " ");
};

const formatClientType = (type: string): string => {
  return type.replace(/_/g, " ");
};

export const ClientInsights = () => {
  const t = useScopedI18n("backoffice.analytics");
  const tInsights = useScopedI18n("backoffice.analytics.clientInsights");

  const { data: stats, isLoading: isLoadingStats } = useClientInsightsStats();
  const { data: regionData, isLoading: isLoadingRegion } = useClientsByRegion();
  const { data: acquisitionData, isLoading: isLoadingAcquisition } =
    useClientAcquisitionTrend();
  const { data: investmentRangeData, isLoading: isLoadingInvestmentRange } =
    useClientsByInvestmentRange();
  const { data: advisorData, isLoading: isLoadingAdvisor } = useClientsPerAdvisor();
  const { data: clientTypeData, isLoading: isLoadingClientType } =
    useClientTypeDistribution();

  // Stats KPI Cards
  const kpiCards = [
    {
      title: tInsights("stats.totalClients"),
      value: stats?.totalClients ?? 0,
      trend: 0,
    },
    {
      title: tInsights("stats.activeClients"),
      value: stats?.activeClients ?? 0,
      trend: 0,
    },
    {
      title: tInsights("stats.retentionRate"),
      value: `${(stats?.retentionRate ?? 0).toFixed(1)}%`,
      trend: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "-" : kpi.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {tInsights("charts.geographicDistribution.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRegion ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">{t("loadingMessage")}</p>
              </div>
            ) : !regionData || regionData.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">{t("noData")}</p>
              </div>
            ) : (
              <ChartContainer
                className="h-[300px] w-full"
                config={{
                  count: {
                    label: tInsights("charts.geographicDistribution.clients"),
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <BarChart
                  data={regionData.slice(0, 10)}
                  layout="vertical"
                  margin={{ left: 20, right: 12 }}
                >
                  <YAxis
                    dataKey="region"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    width={120}
                    fontSize={12}
                  />
                  <XAxis hide type="number" />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Client Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {tInsights("charts.clientTypeDistribution.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingClientType ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">{t("loadingMessage")}</p>
              </div>
            ) : !clientTypeData || clientTypeData.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">{t("noData")}</p>
              </div>
            ) : (
              <ChartContainer
                className="h-[300px] w-full"
                config={{
                  count: {
                    label: tInsights("charts.clientTypeDistribution.clients"),
                  },
                }}
              >
                <PieChart>
                  <Pie
                    data={clientTypeData.map((item, index) => ({
                      name: formatClientType(item.type),
                      value: item.count,
                      fill: COLORS[index % COLORS.length],
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                  >
                    {clientTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Client Acquisition Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {tInsights("charts.acquisitionTrend.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAcquisition ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">{t("loadingMessage")}</p>
              </div>
            ) : !acquisitionData || acquisitionData.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">{t("noData")}</p>
              </div>
            ) : (
              <ChartContainer
                className="h-[300px] w-full"
                config={{
                  newClients: {
                    label: tInsights("charts.acquisitionTrend.newClients"),
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <LineChart data={acquisitionData} margin={{ left: 12, right: 12 }}>
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const date = new Date(`${value}-01`);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        year: "2-digit",
                      });
                    }}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <YAxis tickLine={false} tickMargin={10} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          const date = new Date(`${value}-01`);
                          return date.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Line
                    dataKey="newClients"
                    stroke="var(--color-newClients)"
                    strokeWidth={2}
                    type="monotone"
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Investment Range Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {tInsights("charts.investmentRangeBreakdown.title")}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {tInsights("charts.investmentRangeBreakdown.description")}
            </p>
          </CardHeader>
          <CardContent>
            {isLoadingInvestmentRange ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">{t("loadingMessage")}</p>
              </div>
            ) : !investmentRangeData || investmentRangeData.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">{t("noData")}</p>
              </div>
            ) : (
              <ChartContainer
                className="h-[300px] w-full"
                config={{
                  count: {
                    label: tInsights("charts.investmentRangeBreakdown.count"),
                    color: "#1D5C9B",
                  },
                }}
              >
                <BarChart data={investmentRangeData.map((item, index) => ({
                  range: formatInvestmentRange(item.range),
                  count: item.count,
                  fill: ["#1D5C9B", "#679A85", "#9C3E11"][index] || "#1D5C9B",
                }))}>
                  <XAxis
                    dataKey="range"
                    tickLine={false}
                    tickMargin={10}
                    fontSize={12}
                  />
                  <YAxis tickLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="count" radius={4}>
                    {investmentRangeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={["#1D5C9B", "#679A85", "#9C3E11"][index] || "#1D5C9B"} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
