"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useUpdatePersonalNotes = (userId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.investors.updatePersonalNotes.mutationOptions({
      onSuccess: () => {
        toast.success("Personal notes updated successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.investors.getOne.queryOptions({ id: userId }).queryKey,
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update personal notes";
        toast.error(errorMessage);
      },
    })
  );
};
