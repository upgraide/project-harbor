import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AnalyticsContainer,
  AnalyticsError,
  AnalyticsFilters,
  AnalyticsLoading,
  AnalyticsOverview,
  AssetsTransactedLineChart,
  AumLineChart,
  ClientActivityCard,
  ClientInsights,
  ClientInsightsFilters,
  ClientSegmentationDonutChart,
  PerformanceFilters,
  PipelineFunnelChart,
  SectorBreakdownBarChart,
} from "@/features/opportunities/components/analytics";
import { AnalyticsFiltersProvider } from "@/features/opportunities/context/analytics-filters";
import { ClientInsightsFiltersProvider } from "@/features/opportunities/context/client-insights-filters";
import { PerformanceFiltersProvider } from "@/features/opportunities/context/performance-filters";
import { requireTeam } from "@/lib/auth-utils";
import { getScopedI18n } from "@/locales/server";
import { HydrateClient } from "@/trpc/server";

const Page = async () => {
  await requireTeam();
  const t = await getScopedI18n("backoffice.analytics");
  const tInsights = await getScopedI18n("backoffice.analytics.clientInsights");

  return (
    <AnalyticsContainer>
      <HydrateClient>
        <div className="space-y-6">
          {/* Tabs Navigation */}
          <AnalyticsFiltersProvider>
            <PerformanceFiltersProvider>
              <ClientInsightsFiltersProvider>
                <Tabs className="space-y-6" defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="charts">Charts & Metrics</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="advisor-performance">
                      Advisor Performance
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab - KPIs */}
                  <TabsContent className="space-y-6" value="overview">
                    <AnalyticsFilters />
                    <ErrorBoundary fallback={<AnalyticsError />}>
                      <Suspense fallback={<AnalyticsLoading />}>
                        <AnalyticsOverview />
                      </Suspense>
                    </ErrorBoundary>
                  </TabsContent>

                  {/* Charts Tab */}
                  <TabsContent className="space-y-6" value="charts">
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
                  </TabsContent>

                  {/* Performance Tab */}
                  <TabsContent className="space-y-6" value="performance">
                    <PerformanceFilters />
                    <ErrorBoundary fallback={<AnalyticsError />}>
                      <Suspense fallback={<AnalyticsLoading />}>
                        <ClientActivityCard />
                      </Suspense>
                    </ErrorBoundary>
                  </TabsContent>

                  {/* Advisor Performance Tab (formerly Client Insights) */}
                  <TabsContent
                    className="space-y-6"
                    value="advisor-performance"
                  >
                    <ClientInsightsFilters />
                    <ErrorBoundary fallback={<AnalyticsError />}>
                      <Suspense fallback={<AnalyticsLoading />}>
                        <ClientInsights />
                      </Suspense>
                    </ErrorBoundary>
                  </TabsContent>
                </Tabs>
              </ClientInsightsFiltersProvider>
            </PerformanceFiltersProvider>
          </AnalyticsFiltersProvider>
        </div>
      </HydrateClient>
    </AnalyticsContainer>
  );
};

export default Page;
