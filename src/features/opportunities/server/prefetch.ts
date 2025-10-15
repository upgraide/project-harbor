import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.opportunities.getMany>;

/**
 * Prefetch all the Opportunities
 */
export const prefetchOpportunities = (params: Input) =>
  prefetch(trpc.opportunities.getMany.queryOptions(params));

/**
 * Prefetch an Opportunity
 */
export const prefetchOpportunity = (id: string) =>
  prefetch(trpc.opportunities.getOne.queryOptions({ id }));
