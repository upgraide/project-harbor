import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useInvestmentInterestsParams } from "./use-investment-interests-params";

/**
 * Hook to fetch all investment interests using suspense
 */
export const useSuspenseInvestmentInterests = () => {
  const trpc = useTRPC();
  const [params] = useInvestmentInterestsParams();

  return useSuspenseQuery(
    trpc.investmentInterests.getMany.queryOptions(params)
  );
};
