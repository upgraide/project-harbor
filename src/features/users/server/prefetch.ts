import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.users.getMany>;

/**
 * Prefetch all the Users
 */
export const prefetchUsers = (params: Input) =>
  prefetch(trpc.users.getMany.queryOptions(params));
