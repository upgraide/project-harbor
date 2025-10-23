"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to update a user's name
 */
export const useUpdateProfileName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(
    trpc.users.updateProfile.mutationOptions({
      onSuccess: () => {
        router.refresh();
        queryClient.invalidateQueries(trpc.users.getMany.queryOptions({}));
      },
      onError: () => {
        toast.error("Failed to update user");
      },
    })
  );
};
