import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  OpportunitiesContainer,
  OpportunitiesError,
  OpportunitiesLoading,
} from "@/features/dashboard/components/opportunities-list";
import { opportunityParamsLoader } from "@/features/opportunities/server/params-loader";
import { prefetchDashboard } from "@/features/opportunities/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();
  const params = await opportunityParamsLoader(searchParams);
  prefetchDashboard(params);

  return (
    <OpportunitiesContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<OpportunitiesError />}>
          <Suspense fallback={<OpportunitiesLoading />}>
            <main className="flex-1">
              <h1>Dashboard</h1>
            </main>
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </OpportunitiesContainer>
  );
};

export default Page;
