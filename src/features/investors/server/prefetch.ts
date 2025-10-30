import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.investors.getMany>;

/**
 * Prefetch all the Investors
 */
export const prefetchInvestors = (params: Input) =>
  prefetch(trpc.investors.getMany.queryOptions(params));
