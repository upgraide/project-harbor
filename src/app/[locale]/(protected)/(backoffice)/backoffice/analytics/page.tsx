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
  ClientActivityCard,
  AdvisorPerformanceChart,
  AnalyticsFilters,
  ClientInsightsFilters,
  ClientInsights,
} from "@/features/opportunities/components/analytics";
import {
  AnalyticsFiltersProvider,
} from "@/features/opportunities/context/analytics-filters";
import {
  ClientInsightsFiltersProvider,
} from "@/features/opportunities/context/client-insights-filters";
import { requireTeam } from "@/lib/auth-utils";
import { getScopedI18n } from "@/locales/server";
import { HydrateClient } from "@/trpc/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  await requireTeam();
  const t = await getScopedI18n("backoffice.analytics");
  const tInsights = await getScopedI18n("backoffice.analytics.clientInsights");
  
  return (
    <AnalyticsContainer>
      <HydrateClient>
        <div className="space-y-6">
          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Charts & Metrics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="client-insights">{tInsights("tabTitle")}</TabsTrigger>
              <TabsTrigger value="top-viewed">Top Viewed</TabsTrigger>
            </TabsList>

            {/* Overview Tab - KPIs */}
            <TabsContent value="overview" className="space-y-6">
              <AnalyticsFiltersProvider>
                <AnalyticsFilters />
                <ErrorBoundary fallback={<AnalyticsError />}>
                  <Suspense fallback={<AnalyticsLoading />}>
                    <AnalyticsOverview />
                  </Suspense>
                </ErrorBoundary>
              </AnalyticsFiltersProvider>
            </TabsContent>

            {/* Charts Tab */}
            <TabsContent value="charts" className="space-y-6">
              <AnalyticsFiltersProvider>
                <AnalyticsFilters />
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
              </AnalyticsFiltersProvider>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <ErrorBoundary fallback={<AnalyticsError />}>
                <Suspense fallback={<AnalyticsLoading />}>
                  <ClientActivityCard />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary fallback={<AnalyticsError />}>
                <Suspense fallback={<AnalyticsLoading />}>
                  <AdvisorPerformanceChart />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            {/* Client Insights Tab */}
            <TabsContent value="client-insights" className="space-y-6">
              <ClientInsightsFiltersProvider>
                <ClientInsightsFilters />
                <ErrorBoundary fallback={<AnalyticsError />}>
                  <Suspense fallback={<AnalyticsLoading />}>
                    <ClientInsights />
                  </Suspense>
                </ErrorBoundary>
              </ClientInsightsFiltersProvider>
            </TabsContent>

            {/* Top Viewed Tab */}
            <TabsContent value="top-viewed" className="space-y-6">
              <ErrorBoundary fallback={<AnalyticsError />}>
                <Suspense fallback={<AnalyticsLoading />}>
                  <AnalyticsList />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </HydrateClient>
    </AnalyticsContainer>
  );
};

export default Page;
