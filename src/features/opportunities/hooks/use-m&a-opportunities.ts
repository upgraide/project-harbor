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

  return useSuspenseQuery(
    trpc.mergerAndAcquisition.getMany.queryOptions(params)
  );
};

/**
 * Hook to create a new opportunity
 */
export const useCreateOpportunity = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} created`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
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
    trpc.mergerAndAcquisition.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} deleted`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
      },
    })
  );
};

/**
 * hook to fetch an opportunity using suspense
 */
export const useSuspenseOpportunity = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.mergerAndAcquisition.getOne.queryOptions({ id })
  );
};

/**
 * Hook to update an opportunity name
 */
export const useUpdateOpportunityName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to update the name of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity description
 */
export const useUpdateOpportunityDescription = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateDescription.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to update the description of the opportunity: ${error.message}`
        );
      },
    })
  );
};
