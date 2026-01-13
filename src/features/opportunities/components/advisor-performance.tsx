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
      color: "#3b82f6", // blue
    },
    aumManaged: {
      label: t("graphs.advisorPerformance.aumManaged"),
      color: "#10b981", // green
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
            <YAxis tickFormatter={(value) => formatNumber(value)} tickLine={false} tickMargin={10} />
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
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-semibold">
                    {t("graphs.advisorPerformance.advisor")}
                  </th>
                  <th className="text-center py-2 px-2 font-semibold">
                    {t("graphs.advisorPerformance.closed")}
                  </th>
                  <th className="text-center py-2 px-2 font-semibold">
                    {t("graphs.advisorPerformance.aum")}
                  </th>
                  <th className="text-center py-2 px-2 font-semibold">
                    {t("graphs.advisorPerformance.rate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((advisor) => advisor !== null)
                  .map((advisor) => (
                    <tr
                      key={advisor.advisorId}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-2 px-2">{advisor.advisorName}</td>
                      <td className="text-center py-2 px-2 font-mono">
                        {advisor.dealsClosed}
                      </td>
                      <td className="text-center py-2 px-2 font-mono">
                        {advisor.aumManaged}
                      </td>
                      <td className="text-center py-2 px-2 font-mono">
                        <span
                          className={
                            advisor.closureRate > 50
                              ? "text-green-600"
                              : advisor.closureRate > 25
                                ? "text-yellow-600"
                                : "text-red-600"
                          }
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
