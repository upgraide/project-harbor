"use client";

import { BriefcaseIcon, BuildingIcon } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  EntityContainer,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTopViewedOpportunities } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

const EMPTY_ARRAY_LENGTH = 0;
const TOP_OPPORTUNITIES_LIMIT = 5;
const DEFAULT_SUM = 0;

type OpportunityWithViews = {
  views: number;
  opportunity: {
    id: string;
    name: string;
    images: string[];
    updatedAt: Date;
  };
  type: "mna" | "realEstate";
};

const hasOpportunity = (item: {
  opportunity: unknown;
}): item is OpportunityWithViews => item.opportunity !== null;

type EntityHeaderProps = {
  title: string;
  description?: string;
};

export const EntityHeader = ({ title, description }: EntityHeaderProps) => (
  <div className="flex flex-row items-center gap-x-4">
    <div className="flex flex-col">
      <h1 className="font-semibold text-lg md:text-xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-xs md:text-sm">
          {description}
        </p>
      )}
    </div>
  </div>
);

export const AnalyticsHeader = () => {
  const t = useScopedI18n("backoffice.analytics");
  return <EntityHeader description={t("description")} title={t("title")} />;
};

export const AnalyticsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <EntityContainer header={<AnalyticsHeader />}>{children}</EntityContainer>
);

export const AnalyticsLoading = () => {
  const t = useScopedI18n("backoffice.analytics");
  return <LoadingView message={t("loadingMessage")} />;
};

export const AnalyticsError = () => {
  const t = useScopedI18n("backoffice.analytics");
  return <ErrorView message={t("errorMessage")} />;
};

// biome-ignore lint/performance/noBarrelFile: export is needed for suspense fallback
export { AnalyticsOverview } from "./analytics-overview";

export const AnalyticsList = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { data: topViewed, isLoading } = useTopViewedOpportunities(
    TOP_OPPORTUNITIES_LIMIT,
    "all"
  );

  if (isLoading) {
    return <AnalyticsLoading />;
  }

  if (!topViewed || topViewed.length === EMPTY_ARRAY_LENGTH) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  const totalViews = topViewed.reduce(
    (sum, item) => sum + item.views,
    DEFAULT_SUM
  );

  const validOpportunities = topViewed.filter(hasOpportunity);

  const chartData = validOpportunities.map((item) => ({
    name: item.opportunity.name,
    views: item.views,
    type: item.type,
    icon: item.type === "mna" ? BriefcaseIcon : BuildingIcon,
  }));

  const chartConfig = {
    views: {
      label: t("chart.views"),
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("chart.title")}</CardTitle>
        <div className="flex items-baseline gap-2">
          <div className="font-bold text-3xl tabular-nums leading-none">
            {totalViews}
          </div>
          <div className="text-muted-foreground text-sm">
            {t("chart.totalViews")}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <YAxis
              dataKey="name"
              fontSize={12}
              tickLine={false}
              tickMargin={10}
              type="category"
              width={120}
            />
            <XAxis hide type="number" />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <Bar
              dataKey="views"
              fill="var(--color-views)"
              layout="vertical"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
