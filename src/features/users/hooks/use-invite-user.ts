"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useUsersParams } from "./use-users-params";

export const useInviteUser = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [params] = useUsersParams();

  return useMutation(
    trpc.users.invite.mutationOptions({
      onSuccess: (data) => {
        toast.success(`User ${data.user.name} invited successfully!`);
        queryClient.invalidateQueries(trpc.users.getMany.queryOptions(params));
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to invite user";
        toast.error(errorMessage);
      },
    })
  );
};
