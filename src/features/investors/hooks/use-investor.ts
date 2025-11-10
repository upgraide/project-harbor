"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useInvestor = (id: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.investors.getOne.queryOptions({ id }));
};
