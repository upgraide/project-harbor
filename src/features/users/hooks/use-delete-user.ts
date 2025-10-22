import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useUsersParams } from "./use-users-params";

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [params] = useUsersParams();

  return useMutation(
    trpc.users.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success(`User ${data.name} deleted`);
        queryClient.invalidateQueries(trpc.users.getMany.queryOptions(params));
      },
      onError: () => {
        toast.error("Failed to delete user");
      },
    })
  );
};
