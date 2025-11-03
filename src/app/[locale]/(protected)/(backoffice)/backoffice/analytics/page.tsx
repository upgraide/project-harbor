import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  AnalyticsContainer,
  AnalyticsError,
  AnalyticsList,
  AnalyticsLoading,
  AnalyticsOverview,
} from "@/features/opportunities/components/analytics";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

const Page = async () => {
  await requireTeam();
  return (
    <AnalyticsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<AnalyticsError />}>
          <Suspense fallback={<AnalyticsLoading />}>
            <AnalyticsOverview />
          </Suspense>
        </ErrorBoundary>
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
