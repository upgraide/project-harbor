import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.mergerAndAcquisition.getMany>;

/**
 * Prefetch all the M&A Opportunities
 */
export const prefetchMAOpportunities = (params: Input) =>
  prefetch(trpc.mergerAndAcquisition.getMany.queryOptions(params));

/**
 * Prefetch an M&A Opportunity
 */
export const prefetchMAOpportunity = (id: string) =>
  prefetch(trpc.mergerAndAcquisition.getOne.queryOptions({ id }));

/**
 * Prefetch all the Real Estate Opportunities
 */
export const prefetchRealEstateOpportunities = (params: Input) =>
  prefetch(trpc.realEstate.getMany.queryOptions(params));

/**
 * Prefetch a Real Estate Opportunity
 */
export const prefetchRealEstateOpportunity = (id: string) =>
  prefetch(trpc.realEstate.getOne.queryOptions({ id }));
