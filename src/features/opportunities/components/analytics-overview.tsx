"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useBackofficeKPIsWithTrends } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

const formatNumber = (value: number): string => value.toLocaleString("en-US");
const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

type KPICardProps = {
  label: string;
  value: string | number;
  trend?: number;
  isLoading: boolean;
  isFuture?: boolean;
  isCurrency?: boolean;
};

const KPICard = ({
  label,
  value,
  trend,
  isLoading,
  isFuture,
  isCurrency,
}: KPICardProps) => {
  const isTrendPositive = trend ? trend >= 0 : false;

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 py-6">
        <p className="text-muted-foreground text-sm">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="font-bold text-3xl tabular-nums leading-none">
            {isLoading || isFuture
              ? "-"
              : // biome-ignore lint/style/noNestedTernary: value is string or number
                typeof value === "number"
                ? isCurrency
                  ? formatCurrency(value)
                  : formatNumber(value)
                : value}
          </p>
          {!isFuture && trend !== undefined && trend !== 0 && (
            <div
              className={`flex items-center gap-1 font-medium text-xs ${isTrendPositive ? "text-green-600" : "text-red-600"}`}
            >
              {isTrendPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AnalyticsOverview = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { data: kpis, isLoading } = useBackofficeKPIsWithTrends();

  if (!(kpis || isLoading)) {
    return null;
  }

  const isFuture = kpis?.isFuture ?? false;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          isFuture={isFuture}
          isLoading={isLoading}
          label={t("kpis.aum")}
          trend={kpis?.totalAUMTrend}
          value={kpis?.totalAUM ?? 0}
        />
        <KPICard
          isFuture={isFuture}
          isLoading={isLoading}
          label={t("kpis.assetsTransacted")}
          trend={kpis?.totalAssetsTransactedTrend}
          value={kpis?.totalAssetsTransacted ?? 0}
        />
        <KPICard
          isFuture={isFuture}
          isLoading={isLoading}
          label={t("kpis.mandatesClosedYTD")}
          trend={kpis?.mandatesClosedYTDTrend}
          value={kpis?.mandatesClosedYTD ?? 0}
        />
        <KPICard
          isFuture={isFuture}
          isLoading={isLoading}
          label={t("kpis.activeClients")}
          trend={kpis?.activeClientsTrend}
          value={kpis?.activeClients ?? 0}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          isFuture={isFuture}
          isLoading={isLoading}
          label={t("kpis.newClientsQuarter")}
          trend={kpis?.newClientsQuarterTrend}
          value={kpis?.newClientsQuarter ?? 0}
        />
        <KPICard
          isCurrency
          isFuture={isFuture}
          isLoading={isLoading}
          label={t("kpis.pipelineValue")}
          trend={kpis?.pipelineValueTrend}
          value={kpis?.pipelineValue ?? 0}
        />
        <KPICard
          isCurrency
          isFuture={isFuture}
          isLoading={isLoading}
          label={t("kpis.averageDealSize")}
          trend={kpis?.averageDealSizeTrend}
          value={kpis?.averageDealSize ?? 0}
        />
      </div>
    </div>
  );
};
