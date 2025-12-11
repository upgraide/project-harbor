import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to fetch a single user by ID using suspense
 */
export const useSuspenseUser = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.users.getById.queryOptions({ id }));
};
