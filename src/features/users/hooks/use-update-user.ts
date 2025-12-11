import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useUpdateUser = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.users.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [["users"]] });
        toast.success("User updated successfully");
      },
      onError: () => {
        toast.error("Failed to update user");
      },
    })
  );
};
