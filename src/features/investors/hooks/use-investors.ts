import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useInvestorsParams } from "./use-investors-params";

/**
 * Hook to fetch all investors using suspense
 */
export const useSuspenseInvestors = () => {
  const trpc = useTRPC();
  const [params] = useInvestorsParams();

  return useSuspenseQuery(trpc.investors.getMany.queryOptions(params));
};
