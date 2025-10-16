import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.mergerAndAcquisition.getMany>;

/**
 * Prefetch all the Opportunities
 */
export const prefetchOpportunities = (params: Input) =>
  prefetch(trpc.mergerAndAcquisition.getMany.queryOptions(params));

/**
 * Prefetch an Opportunity
 */
export const prefetchOpportunity = (id: string) =>
  prefetch(trpc.mergerAndAcquisition.getOne.queryOptions({ id }));
