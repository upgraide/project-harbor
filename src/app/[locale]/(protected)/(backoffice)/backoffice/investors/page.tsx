import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InvestorsContainer } from "@/features/investors/components/investors-container";
import { InvestorsList } from "@/features/investors/components/investors-list";
import {
  InvestorsError,
  InvestorsLoading,
} from "@/features/investors/components/investors-states";
import { investorsParamsLoader } from "@/features/investors/server/params-loader";
import { prefetchInvestors } from "@/features/investors/server/prefetch";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireTeam();
  const params = await investorsParamsLoader(searchParams);
  prefetchInvestors(params);
  return (
    <InvestorsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<InvestorsError />}>
          <Suspense fallback={<InvestorsLoading />}>
            <InvestorsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </InvestorsContainer>
  );
};

export default Page;
