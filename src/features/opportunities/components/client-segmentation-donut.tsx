"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useClientSegmentation } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

const COLORS = [
  "#1D5C9B", // blue from schema
  "#679A85", // teal from schema
  "#9C3E11", // orange from schema
  "#113152", // navy from schema
  "#BECED7", // light blue from schema
];

const formatNumber = (value: number): string => value.toLocaleString("en-US");

const formatInvestorType = (type: string): string => {
  if (type === "LESS_THAN_10M") {
    return "<€10M";
  }
  if (type === "BETWEEN_10M_100M") {
    return "€10M-€100M";
  }
  if (type === "GREATER_THAN_100M") {
    return ">€100M";
  }
  return type;
};

export const ClientSegmentationDonutChart = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { data, isLoading } = useClientSegmentation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("graphs.segmentation.title")}
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
            {t("graphs.segmentation.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item, index) => ({
    name: formatInvestorType(item.label),
    value: item.count,
    fill: COLORS[index % COLORS.length],
  }));

  const chartConfig = {
    value: {
      label: t("graphs.segmentation.valueLabel"),
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("graphs.segmentation.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px] w-full" config={chartConfig}>
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={chartData}
              dataKey="value"
              innerRadius={60}
              nameKey="name"
              outerRadius={100}
            >
              {chartData.map((entry) => (
                <Cell fill={entry.fill} key={entry.name} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    formatNumber(Number(value)),
                    t("graphs.segmentation.valueLabel"),
                  ]}
                />
              }
            />
          </PieChart>
        </ChartContainer>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.map((item) => (
            <div className="flex items-center gap-2" key={item.name}>
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground text-sm">
                {item.name}: {formatNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
