"use client";

import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAdvisorPerformance } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

const formatNumber = (value: number): string => value.toLocaleString("en-US");

export const AdvisorPerformanceChart = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { data, isLoading } = useAdvisorPerformance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("graphs.advisorPerformance.title")}
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
            {t("graphs.advisorPerformance.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data
    .filter((advisor) => advisor !== null)
    .map((advisor) => ({
      name: advisor.advisorName,
      dealsClosed: advisor.dealsClosed,
      aumManaged: advisor.aumManaged,
      closureRate: Math.round(advisor.closureRate),
    }));

  const chartConfig = {
    dealsClosed: {
      label: t("graphs.advisorPerformance.dealsClosed"),
      color: "#1D5C9B", // blue from schema
    },
    aumManaged: {
      label: t("graphs.advisorPerformance.aumManaged"),
      color: "#679A85", // teal from schema
    },
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("graphs.advisorPerformance.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px] w-full" config={chartConfig}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              fontSize={12}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              tickFormatter={(value) => formatNumber(value)}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatNumber(Number(value))}
                />
              }
            />
            <Legend />
            <Bar
              dataKey="dealsClosed"
              fill="var(--color-dealsClosed)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="aumManaged"
              fill="var(--color-aumManaged)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Detailed table */}
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-sm">
            {t("graphs.advisorPerformance.details")}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="px-2 py-2 text-left font-semibold">
                    {t("graphs.advisorPerformance.advisor")}
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    {t("graphs.advisorPerformance.closed")}
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    {t("graphs.advisorPerformance.aum")}
                  </th>
                  <th className="px-2 py-2 text-center font-semibold">
                    {t("graphs.advisorPerformance.rate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((advisor) => advisor !== null)
                  .map((advisor) => (
                    <tr
                      className="border-border border-b hover:bg-muted/50"
                      key={advisor.advisorId}
                    >
                      <td className="px-2 py-2">{advisor.advisorName}</td>
                      <td className="px-2 py-2 text-center font-mono">
                        {advisor.dealsClosed}
                      </td>
                      <td className="px-2 py-2 text-center font-mono">
                        {advisor.aumManaged}
                      </td>
                      <td className="px-2 py-2 text-center font-mono">
                        <span
                          style={{
                            color:
                              advisor.closureRate > 50
                                ? "#679A85"
                                : advisor.closureRate > 25
                                  ? "#9C3E11"
                                  : "#404040",
                          }}
                        >
                          {advisor.closureRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
