import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useDeactivateUser = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.users.deactivate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [["users"]] });
        toast.success("User deactivated successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to deactivate user");
      },
    })
  );
};
