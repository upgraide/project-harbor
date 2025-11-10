"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";

export const useCurrentUserRole = () => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();

  return useQuery({
    ...trpc.users.getRole.queryOptions({
      id: session?.user?.id ?? "",
    }),
    enabled: !!session?.user?.id,
  });
};
