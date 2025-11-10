"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useInvestorNotes = (userId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.investors.getNotes.queryOptions({ userId }));
};
