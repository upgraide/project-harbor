import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useInvestmentInterestsParams } from "./use-investment-interests-params";

/**
 * Hook to fetch all investment interests using suspense with infinite scroll
 */
export const useSuspenseInvestmentInterests = () => {
  const trpc = useTRPC();
  const [params] = useInvestmentInterestsParams();

  return useSuspenseInfiniteQuery(
    trpc.investmentInterests.getMany.infiniteQueryOptions(
      {
        type: params.type,
        status: params.status,
        search: params.search,
        limit: params.limit,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );
};
