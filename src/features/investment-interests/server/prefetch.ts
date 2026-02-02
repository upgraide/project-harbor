import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.investmentInterests.getMany>;

/**
 * Prefetch all the Investment Interests with infinite scroll support
 */
export const prefetchInvestmentInterests = (params: Omit<Input, "cursor">) =>
  prefetch(
    trpc.investmentInterests.getMany.infiniteQueryOptions(params, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
  );
