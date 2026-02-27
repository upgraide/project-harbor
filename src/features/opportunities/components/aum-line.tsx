"use client";

import { useTheme } from "next-themes";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAumByMonth } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

export const AumLineChart = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data, isLoading } = useAumByMonth();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("graphs.aum.title")}</CardTitle>
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
          <CardTitle className="text-base">{t("graphs.aum.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    month: item.month,
    count: item.count,
  }));

  const chartConfig = {
    count: {
      label: t("graphs.aum.yLabel"),
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("graphs.aum.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px] w-full" config={chartConfig}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
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
            <YAxis
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
              tickFormatter={(value) => value.toLocaleString()}
              tickLine={false}
              tickMargin={10}
            />
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
              dataKey="count"
              dot={{ fill: isDark ? "#FFFFFF" : "#000000", r: 4 }}
              stroke={
                chartData.length >= 2
                  ? isDark
                    ? "#FFFFFF"
                    : "#000000"
                  : "transparent"
              }
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
