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
              <TabsTrigger value="advisor-performance">Advisor Performance</TabsTrigger>
            </TabsList>

            {/* Shared Analytics Filters Provider for Overview and Charts */}
            <AnalyticsFiltersProvider>
              {/* Overview Tab - KPIs */}
              <TabsContent value="overview" className="space-y-6">
                <AnalyticsFilters />
                <ErrorBoundary fallback={<AnalyticsError />}>
                  <Suspense fallback={<AnalyticsLoading />}>
                    <AnalyticsOverview />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts" className="space-y-6">
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
            </AnalyticsFiltersProvider>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <ErrorBoundary fallback={<AnalyticsError />}>
                <Suspense fallback={<AnalyticsLoading />}>
                  <ClientActivityCard />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            {/* Advisor Performance Tab (formerly Client Insights) */}
            <TabsContent value="advisor-performance" className="space-y-6">
              <ClientInsightsFiltersProvider>
                <ClientInsightsFilters />
                <ErrorBoundary fallback={<AnalyticsError />}>
                  <Suspense fallback={<AnalyticsLoading />}>
                    <ClientInsights />
                  </Suspense>
                </ErrorBoundary>
              </ClientInsightsFiltersProvider>
            </TabsContent>
          </Tabs>
        </div>
      </HydrateClient>
    </AnalyticsContainer>
  );
};

export default Page;
