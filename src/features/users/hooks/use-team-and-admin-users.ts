import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to fetch users with TEAM or ADMIN role
 */
export const useTeamAndAdminUsers = () => {
  const trpc = useTRPC();

  return useQuery(trpc.users.getTeamAndAdminUsers.queryOptions());
};
