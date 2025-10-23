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

/**
 * Hook to update a user's avatar
 */
export const useUpdateProfileAvatar = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(
    trpc.users.updateAvatar.mutationOptions({
      onSuccess: () => {
        router.refresh();
        queryClient.invalidateQueries(trpc.users.getMany.queryOptions({}));
      },
      onError: () => {
        toast.error("Failed to update avatar");
      },
    })
  );
};

/**
 * Hook to delete an uploaded file from uploadthing
 */
export const useDeleteUploadedFile = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.users.deleteUploadedFile.mutationOptions({
      onError: () => {
        toast.error("Failed to delete file");
      },
    })
  );
};
