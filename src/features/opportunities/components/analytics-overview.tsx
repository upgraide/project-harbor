"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useBackofficeKPIs } from "@/features/opportunities/hooks/use-analytics";
import { useScopedI18n } from "@/locales/client";

const formatNumber = (value: number): string => value.toLocaleString("en-US");

type KPICardProps = {
  label: string;
  value: string | number;
  isLoading: boolean;
};

const KPICard = ({ label, value, isLoading }: KPICardProps) => (
  <Card>
    <CardContent className="flex flex-col gap-2 py-6">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-bold text-3xl tabular-nums leading-none">
        {isLoading
          ? "-"
          : // biome-ignore lint/style/noNestedTernary: value is string or number
            typeof value === "number"
            ? formatNumber(value)
            : value}
      </p>
    </CardContent>
  </Card>
);

export const AnalyticsOverview = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { data: kpis, isLoading } = useBackofficeKPIs();

  if (!(kpis || isLoading)) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg md:text-xl">Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          isLoading={isLoading}
          label={t("kpis.aum")}
          value={kpis?.totalAUM ?? 0}
        />
        <KPICard
          isLoading={isLoading}
          label={t("kpis.assetsTransacted")}
          value={kpis?.totalAssetsTransacted ?? 0}
        />
        <KPICard
          isLoading={isLoading}
          label={t("kpis.mandatesClosedYTD")}
          value={kpis?.mandatesClosedYTD ?? 0}
        />
        <KPICard
          isLoading={isLoading}
          label={t("kpis.activeClients")}
          value={kpis?.activeClients ?? 0}
        />
        <KPICard
          isLoading={isLoading}
          label={t("kpis.newClientsQuarter")}
          value={kpis?.newClientsQuarter ?? 0}
        />
      </div>
    </div>
  );
};
