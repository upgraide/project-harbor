"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useInvestorsParams } from "./use-investors-params";

export const useDeleteInvestor = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [params] = useInvestorsParams();

  return useMutation(
    trpc.investors.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Investor ${data.name} deleted successfully!`);
        queryClient.invalidateQueries({
          queryKey: trpc.investors.getMany.queryOptions(params).queryKey,
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete investor";
        toast.error(errorMessage);
      },
    })
  );
};
