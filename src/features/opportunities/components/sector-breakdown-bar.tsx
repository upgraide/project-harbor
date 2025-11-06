"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSectorBreakdown } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

const formatSectorLabel = (sector: string): string => {
  // If it's a Real Estate sector (starts with "RE: "), format the asset type
  if (sector.startsWith("RE: ")) {
    const assetType = sector.replace("RE: ", "");
    return `RE: ${assetType.replace(/_/g, " ")}`;
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
  const chartData = sortedData.map((item) => ({
    sector: formatSectorLabel(item.sector),
    count: item.count,
  }));

  const chartConfig = {
    count: {
      label: t("graphs.sector.yLabel"),
      color: "hsl(var(--chart-1))",
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
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              layout="vertical"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
