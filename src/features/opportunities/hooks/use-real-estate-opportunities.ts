import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useOpportunitiesParams } from "./use-opportunities-params";

/**
 * hook to fetch all opportunities using suspense
 */
export const useSuspenseOpportunities = () => {
  const trpc = useTRPC();
  const [params] = useOpportunitiesParams();

  return useSuspenseQuery(trpc.realEstate.getMany.queryOptions(params));
};

/**
 * Hook to create a new real estate opportunity
 */
export const useCreateRealEstateOpportunity = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} created`);
        queryClient.invalidateQueries(trpc.realEstate.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create opportunity: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to delete an opportunity
 */
export const useDeleteOpportunity = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} deleted`);
        queryClient.invalidateQueries(trpc.realEstate.getMany.queryOptions({}));
      },
    })
  );
};
