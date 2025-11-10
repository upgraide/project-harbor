"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useInvestorsParams } from "./use-investors-params";

export const useUpdateInvestor = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [params] = useInvestorsParams();

  return useMutation(
    trpc.investors.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Investor ${data.name} updated successfully!`);
        queryClient.invalidateQueries({
          queryKey: trpc.investors.getMany.queryOptions(params).queryKey,
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update investor";
        toast.error(errorMessage);
      },
    })
  );
};
