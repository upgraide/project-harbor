import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  OpportunitiesContainer,
  OpportunitiesError,
  OpportunitiesList,
  OpportunitiesLoading,
} from "@/features/opportunities/components/m&a-opportunities";
import { opportunityParamsLoader } from "@/features/opportunities/server/params-loader";
import { prefetchMAOpportunities } from "@/features/opportunities/server/prefetch";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireTeam();

  const params = await opportunityParamsLoader(searchParams);
  prefetchMAOpportunities(params);

  return (
    <OpportunitiesContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<OpportunitiesError />}>
          <Suspense fallback={<OpportunitiesLoading />}>
            <OpportunitiesList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </OpportunitiesContainer>
  );
};

export default Page;
