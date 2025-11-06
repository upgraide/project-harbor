"use client";

import { Funnel, FunnelChart, LabelList, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { usePipelineFunnel } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

const formatNumber = (value: number): string => value.toLocaleString("en-US");

export const PipelineFunnelChart = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { data, isLoading } = usePipelineFunnel();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("graphs.pipeline.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{t("loadingMessage")}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("graphs.pipeline.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      key: "leads",
      label: t("graphs.pipeline.stages.leads"),
      value: data.leads,
      fill: "#5468FF",
    },
    {
      key: "dueDiligence",
      label: t("graphs.pipeline.stages.dueDiligence"),
      value: data.dueDiligence,
      fill: "#8B5CF6",
    },
    {
      key: "negotiation",
      label: t("graphs.pipeline.stages.negotiation"),
      value: data.negotiation,
      fill: "#EC4899",
    },
    {
      key: "closed",
      label: t("graphs.pipeline.stages.closed"),
      value: data.closed,
      fill: "#F59E0B",
    },
  ];

  const chartConfig = {
    leads: { color: "#F59E0B" },
    dueDiligence: { color: "#8B5CF6" },
    negotiation: { color: "#EC4899" },
    closed: { color: "#F59E0B" },
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("graphs.pipeline.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[320px] w-full" config={chartConfig}>
          <FunnelChart margin={{ top: 8, bottom: 8 }}>
            {/* Native Recharts tooltip for funnel, wrapped for consistent styles */}
            <Tooltip
              content={
                <ChartTooltipContent
                  formatter={(
                    value,
                    _name,
                    item: { payload?: { label?: string } }
                  ) => [
                    formatNumber(Number(value)),
                    item?.payload?.label ?? "",
                  ]}
                />
              }
            />
            <Funnel
              data={chartData}
              dataKey="value"
              isAnimationActive={false}
              nameKey="label"
            >
              <LabelList className="text-sm" dataKey="label" position="right" />
              <LabelList
                className="tabular-nums"
                dataKey="value"
                formatter={(v: number) => formatNumber(Number(v))}
                position="inside"
              />
            </Funnel>
          </FunnelChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
