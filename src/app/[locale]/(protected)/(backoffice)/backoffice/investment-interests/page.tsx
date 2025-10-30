import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InvestmentInterestsContainer } from "@/features/investment-interests/components/investment-interests-container";
import { InvestmentInterestsList } from "@/features/investment-interests/components/investment-interests-list";
import {
  InvestmentInterestsError,
  InvestmentInterestsLoading,
} from "@/features/investment-interests/components/investment-interests-states";
import { investmentInterestsParamsLoader } from "@/features/investment-interests/server/params-loader";
import { prefetchInvestmentInterests } from "@/features/investment-interests/server/prefetch";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireTeam();
  const params = await investmentInterestsParamsLoader(searchParams);
  prefetchInvestmentInterests(params);
  return (
    <InvestmentInterestsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<InvestmentInterestsError />}>
          <Suspense fallback={<InvestmentInterestsLoading />}>
            <InvestmentInterestsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </InvestmentInterestsContainer>
  );
};

export default Page;
