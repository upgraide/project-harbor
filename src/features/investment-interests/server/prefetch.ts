import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.investmentInterests.getMany>;

/**
 * Prefetch all the Investment Interests
 */
export const prefetchInvestmentInterests = (params: Input) =>
  prefetch(trpc.investmentInterests.getMany.queryOptions(params));
