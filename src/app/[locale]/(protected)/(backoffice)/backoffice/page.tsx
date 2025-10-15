import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner } from "@/components/ui/spinner";
import {
  OpportunitiesContainer,
  OpportunitiesList,
} from "@/features/opportunities/components/opportunities";
import { opportunityParamsLoader } from "@/features/opportunities/server/params-loader";
import { prefetchOpportunities } from "@/features/opportunities/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await opportunityParamsLoader(searchParams);
  prefetchOpportunities(params);

  return (
    <OpportunitiesContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Error!</p>}>
          <Suspense fallback={<Spinner />}>
            <OpportunitiesList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </OpportunitiesContainer>
  );
};

export default Page;
