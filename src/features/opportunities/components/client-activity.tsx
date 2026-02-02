"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientActivityFiltered } from "@/features/opportunities/hooks/use-performance";
import { useScopedI18n } from "@/locales/client";
import { formatDistanceToNow } from "date-fns";

export const ClientActivityCard = () => {
  const t = useScopedI18n("backoffice.analytics");
  const { data, isLoading } = useClientActivityFiltered();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("graphs.clientActivity.title")}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {t("graphs.clientActivity.description")}
          </p>
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
            {t("graphs.clientActivity.title")}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {t("graphs.clientActivity.description")}
          </p>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  const noContactPercentage =
    data.noRecentContact + data.recentContact > 0
      ? (data.noRecentContact / (data.noRecentContact + data.recentContact)) *
        100
      : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t("graphs.clientActivity.noContact")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-bold text-3xl tabular-nums leading-none" style={{ color: "#9C3E11" }}>
                {data.noRecentContact}
              </div>
              <div className="text-muted-foreground text-sm">
                ({noContactPercentage.toFixed(1)}%)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t("graphs.clientActivity.recentContact")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-bold text-3xl tabular-nums leading-none" style={{ color: "#679A85" }}>
                {data.recentContact}
              </div>
              <div className="text-muted-foreground text-sm">
                ({(100 - noContactPercentage).toFixed(1)}%)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data.detailedList && data.detailedList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t("graphs.clientActivity.detailedList")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {data.detailedList.map((client) => (
                <div
                  key={client.id}
                  className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-muted-foreground text-xs">{client.email}</p>
                    {client.leadResponsible && (
                      <p className="text-muted-foreground text-xs mt-1">
                        {t("graphs.clientActivity.leadResponsible")}: {client.leadResponsible}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {client.lastContactDate
                      ? formatDistanceToNow(new Date(client.lastContactDate), {
                          addSuffix: true,
                        })
                      : "Never followed up"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.recentContactList && data.recentContactList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t("graphs.clientActivity.recentContactList")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {data.recentContactList.map((client) => (
                <div
                  key={client.id}
                  className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-muted-foreground text-xs">{client.email}</p>
                    {client.leadResponsible && (
                      <p className="text-muted-foreground text-xs mt-1">
                        {t("graphs.clientActivity.leadResponsible")}: {client.leadResponsible}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {client.lastContactDate
                      ? formatDistanceToNow(new Date(client.lastContactDate), {
                          addSuffix: true,
                        })
                      : "Never followed up"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
