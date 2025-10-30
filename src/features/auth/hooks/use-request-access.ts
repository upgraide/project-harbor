"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useRequestAccess = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.accessRequest.create.mutationOptions({
      onSuccess: () => {
        toast.success("Access request submitted successfully!");
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit access request";
        toast.error(errorMessage);
      },
    })
  );
};
