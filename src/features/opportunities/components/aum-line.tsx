"use client";

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
              stroke="var(--color-count)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
