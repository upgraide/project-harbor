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
      fill: "#1D5C9B",
    },
    {
      key: "dueDiligence",
      label: t("graphs.pipeline.stages.dueDiligence"),
      value: data.dueDiligence,
      fill: "#679A85",
    },
    {
      key: "negotiation",
      label: t("graphs.pipeline.stages.negotiation"),
      value: data.negotiation,
      fill: "#9C3E11",
    },
    {
      key: "closed",
      label: t("graphs.pipeline.stages.closed"),
      value: data.closed,
      fill: "#113152",
    },
  ];

  const chartConfig = {
    leads: { color: "#1D5C9B" },
    dueDiligence: { color: "#679A85" },
    negotiation: { color: "#9C3E11" },
    closed: { color: "#113152" },
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("graphs.pipeline.title")}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {t("graphs.pipeline.description")}
        </p>
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
