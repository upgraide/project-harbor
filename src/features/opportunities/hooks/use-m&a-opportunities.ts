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

/**
 * Hook to update an opportunity type
 */
export const useUpdateOpportunityType = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateType.mutationOptions({
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
          `Failed to update the type of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity type
 */
export const useRemoveOpportunityType = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeType.mutationOptions({
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
          `Failed to remove the type of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity type details
 */
export const useUpdateOpportunityTypeDetails = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateTypeDetails.mutationOptions({
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
          `Failed to update the type details of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity type details
 */
export const useRemoveOpportunityTypeDetails = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeTypeDetails.mutationOptions({
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
          `Failed to remove the type details of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity industry
 */
export const useUpdateOpportunityIndustry = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateIndustry.mutationOptions({
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
          `Failed to update the industry of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity industry
 */
export const useRemoveOpportunityIndustry = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeIndustry.mutationOptions({
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
          `Failed to remove the industry of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity industry subsector
 */
export const useUpdateOpportunityIndustrySubsector = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateIndustrySubsector.mutationOptions({
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
          `Failed to update the industry subsector of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity industry subsector
 */
export const useRemoveOpportunityIndustrySubsector = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeIndustrySubsector.mutationOptions({
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
          `Failed to remove the industry subsector of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity sales
 */
export const useUpdateOpportunitySales = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateSales.mutationOptions({
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
          `Failed to update the sales of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity sales
 */
export const useRemoveOpportunitySales = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeSales.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity ebitda
 */
export const useUpdateOpportunityEbitda = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEbitda.mutationOptions({
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
          `Failed to update the ebitda of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity ebitda
 */
export const useRemoveOpportunityEbitda = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEbitda.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity ebitda normalized
 */
export const useUpdateOpportunityEbitdaNormalized = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEbitdaNormalized.mutationOptions({
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
          `Failed to update the ebitda normalized of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity ebitda normalized
 */
export const useRemoveOpportunityEbitdaNormalized = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEbitdaNormalized.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity net debt
 */
export const useUpdateOpportunityNetDebt = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateNetDebt.mutationOptions({
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
          `Failed to update the net debt of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity net debt
 */
export const useRemoveOpportunityNetDebt = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeNetDebt.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity sales cagr
 */
export const useUpdateOpportunitySalesCAGR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateSalesCAGR.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity sales cagr
 */
export const useRemoveOpportunitySalesCAGR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeSalesCAGR.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity ebitda cagr
 */
export const useUpdateOpportunityEbitdaCAGR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEbitdaCAGR.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity ebitda cagr
 */
export const useRemoveOpportunityEbitdaCAGR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEbitdaCAGR.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity asset included
 */
export const useUpdateOpportunityAssetIncluded = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateAssetIncluded.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity asset included
 */
export const useRemoveOpportunityAssetIncluded = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeAssetIncluded.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity estimated asset value
 */
export const useUpdateOpportunityEstimatedAssetValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEstimatedAssetValue.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity estimated asset value
 */
export const useRemoveOpportunityEstimatedAssetValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEstimatedAssetValue.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
    })
  );
};
