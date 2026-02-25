import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useToggleProcessed = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.investmentInterests.toggleProcessed.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [["investmentInterests", "getMany"]],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update processed status");
      },
    })
  );
};
