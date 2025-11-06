import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  AnalyticsContainer,
  AnalyticsError,
  AnalyticsList,
  AnalyticsLoading,
  AnalyticsOverview,
  AssetsTransactedLineChart,
  AumLineChart,
  ClientSegmentationDonutChart,
  PipelineFunnelChart,
  SectorBreakdownBarChart,
} from "@/features/opportunities/components/analytics";
import { requireTeam } from "@/lib/auth-utils";
import { getScopedI18n } from "@/locales/server";
import { HydrateClient } from "@/trpc/server";

const Page = async () => {
  await requireTeam();
  const t = await getScopedI18n("backoffice.analytics");
  return (
    <AnalyticsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<AnalyticsError />}>
          <Suspense fallback={<AnalyticsLoading />}>
            <AnalyticsOverview />
          </Suspense>
        </ErrorBoundary>
        <div className="mt-8 space-y-6">
          <h2 className="font-semibold text-lg md:text-xl">
            {t("graphs.sectionTitle")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ErrorBoundary fallback={<AnalyticsError />}>
              <Suspense fallback={<AnalyticsLoading />}>
                <AssetsTransactedLineChart />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<AnalyticsError />}>
              <Suspense fallback={<AnalyticsLoading />}>
                <AumLineChart />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<AnalyticsError />}>
              <Suspense fallback={<AnalyticsLoading />}>
                <PipelineFunnelChart />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<AnalyticsError />}>
              <Suspense fallback={<AnalyticsLoading />}>
                <ClientSegmentationDonutChart />
              </Suspense>
            </ErrorBoundary>
          </div>
          <ErrorBoundary fallback={<AnalyticsError />}>
            <Suspense fallback={<AnalyticsLoading />}>
              <SectorBreakdownBarChart />
            </Suspense>
          </ErrorBoundary>
        </div>
        <ErrorBoundary fallback={<AnalyticsError />}>
          <Suspense fallback={<AnalyticsLoading />}>
            <AnalyticsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </AnalyticsContainer>
  );
};

export default Page;
