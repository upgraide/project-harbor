import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useUsersParams } from "./use-users-params";

/**
 * Hook to fetch all users using suspense
 */
export const useSuspenseUsers = () => {
  const trpc = useTRPC();
  const [params] = useUsersParams();

  return useSuspenseQuery(trpc.users.getMany.queryOptions(params));
};
