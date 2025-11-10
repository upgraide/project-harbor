"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useAddInvestorNote = (userId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.investors.addNote.mutationOptions({
      onSuccess: () => {
        toast.success("Note added successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.investors.getNotes.queryOptions({ userId }).queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: trpc.investors.getMany.queryOptions({}).queryKey,
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add note";
        toast.error(errorMessage);
      },
    })
  );
};
