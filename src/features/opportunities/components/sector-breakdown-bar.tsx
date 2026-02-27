"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSectorBreakdown } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

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

const formatSectorLabel = (sector: string): string => {
  // If it's a Real Estate sector (starts with "RE: "), remove the prefix and format the asset type
  if (sector.startsWith("RE: ")) {
    const assetType = sector.replace("RE: ", "");
    return assetType.replace(/_/g, " ");
  }
  // Format M&A industry by replacing underscores with spaces
  return sector.replace(/_/g, " ");
};

export const SectorBreakdownBarChart = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { data, isLoading } = useSectorBreakdown();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("graphs.sector.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{t("loadingMessage")}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("graphs.sector.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  // Sort by count descending
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const chartData = sortedData.map((item, index) => ({
    sector: formatSectorLabel(item.sector),
    count: item.count,
    fill: COLORS[index % COLORS.length],
  }));

  const chartConfig = {
    count: {
      label: t("graphs.sector.yLabel"),
      color: "#1D5C9B",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("graphs.sector.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
              right: 12,
            }}
          >
            <YAxis
              dataKey="sector"
              fontSize={12}
              tickLine={false}
              tickMargin={10}
              type="category"
              width={150}
            />
            <XAxis hide type="number" />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <Bar dataKey="count" layout="vertical" radius={4}>
              {chartData.map((entry, index) => (
                <Cell fill={entry.fill} key={`cell-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
