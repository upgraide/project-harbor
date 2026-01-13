import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useActivateUser = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.users.activate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [["users"]] });
        toast.success("User activated successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to activate user");
      },
    })
  );
};
