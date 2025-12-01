import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  OpportunitiesContainer,
  OpportunitiesContent,
  OpportunitiesError,
  OpportunitiesLoading,
} from "@/features/opportunities/components/real-estate-opportunities";
import { opportunityParamsLoader } from "@/features/opportunities/server/params-loader";
import { prefetchRealEstateOpportunities } from "@/features/opportunities/server/prefetch";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireTeam();
  const params = await opportunityParamsLoader(searchParams);
  prefetchRealEstateOpportunities(params);
  return (
    <OpportunitiesContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<OpportunitiesError />}>
          <Suspense fallback={<OpportunitiesLoading />}>
            <OpportunitiesContent />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </OpportunitiesContainer>
  );
};

export default Page;
