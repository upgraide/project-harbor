import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to fetch users with USER role (investors/clients).
 * Used for selecting "Pessoa investidora" - the user who invested in a deal.
 * This is NOT a commission role - just for record/display purposes.
 */
export const useInvestorUsers = () => {
  const trpc = useTRPC();

  return useQuery(trpc.users.getInvestorUsers.queryOptions());
};
