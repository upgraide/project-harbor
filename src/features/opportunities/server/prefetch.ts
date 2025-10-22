import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type MAInput = inferInput<typeof trpc.mergerAndAcquisition.getMany>;
type DashboardInput = inferInput<typeof trpc.opportunities.getAll>;
type RealEstateInput = inferInput<typeof trpc.realEstate.getMany>;

/**
 * Prefetch all the M&A Opportunities
 */
export const prefetchMAOpportunities = (params: MAInput) =>
  prefetch(trpc.mergerAndAcquisition.getMany.queryOptions(params));

/**
 * Prefetch an M&A Opportunity
 */
export const prefetchMAOpportunity = (id: string) =>
  prefetch(trpc.mergerAndAcquisition.getOne.queryOptions({ id }));

/**
 * Prefetch all the Real Estate Opportunities
 */
export const prefetchRealEstateOpportunities = (params: RealEstateInput) =>
  prefetch(trpc.realEstate.getMany.queryOptions(params));

/**
 * Prefetch a Real Estate Opportunity
 */
export const prefetchRealEstateOpportunity = (id: string) =>
  prefetch(trpc.realEstate.getOne.queryOptions({ id }));

/**
 * Prefetch the Dashboard data
 */
export const prefetchDashboard = (params: DashboardInput) =>
  prefetch(trpc.opportunities.getAll.queryOptions(params));
