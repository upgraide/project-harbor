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

/**
 * Hook to update graph rows
 */
export const useUpdateGraphRows = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateGraphRows.mutationOptions({
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
          `Failed to update the graph rows of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update opportunity images
 */
export const useUpdateOpportunityImages = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateImages.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to update the images of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an individual image from opportunity
 */
export const useRemoveOpportunityImage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeImage.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to remove the image from the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update an opportunity im
 */
export const useUpdateOpportunityIm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateIm.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to update the images of the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove an opportunity im from opportunity
 */
export const useRemoveOpportunityIm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeIm.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to remove the image from the opportunity: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update opportunity enterpriseValue
 */
export const useUpdateOpportunityEnterpriseValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEnterpriseValue.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update enterprise value: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity enterpriseValue
 */
export const useRemoveOpportunityEnterpriseValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEnterpriseValue.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove enterprise value: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity equityValue
 */
export const useUpdateOpportunityEquityValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEquityValue.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update equity value: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity equityValue
 */
export const useRemoveOpportunityEquityValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEquityValue.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove equity value: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity evDashEbitdaEntry
 */
export const useUpdateOpportunityEvDashEbitdaEntry = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEvDashEbitdaEntry.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update EV/EBITDA Entry: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity evDashEbitdaEntry
 */
export const useRemoveOpportunityEvDashEbitdaEntry = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEvDashEbitdaEntry.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove EV/EBITDA Entry: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity evDashEbitdaExit
 */
export const useUpdateOpportunityEvDashEbitdaExit = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEvDashEbitdaExit.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update EV/EBITDA Exit: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity evDashEbitdaExit
 */
export const useRemoveOpportunityEvDashEbitdaExit = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEvDashEbitdaExit.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove EV/EBITDA Exit: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity ebitdaMargin
 */
export const useUpdateOpportunityEbitdaMargin = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEbitdaMargin.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update EBITDA Margin: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity ebitdaMargin
 */
export const useRemoveOpportunityEbitdaMargin = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEbitdaMargin.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove EBITDA Margin: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity fcf
 */
export const useUpdateOpportunityFcf = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateFcf.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update Free Cash Flow: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity fcf
 */
export const useRemoveOpportunityFcf = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeFcf.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove Free Cash Flow: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity netDebtDashEbitda
 */
export const useUpdateOpportunityNetDebtDashEbitda = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateNetDebtDashEbitda.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update Net Debt/EBITDA: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity netDebtDashEbitda
 */
export const useRemoveOpportunityNetDebtDashEbitda = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeNetDebtDashEbitda.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove Net Debt/EBITDA: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity capexItensity
 */
export const useUpdateOpportunityCapexItensity = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateCapexItensity.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update CapEx Intensity: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity capexItensity
 */
export const useRemoveOpportunityCapexItensity = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeCapexItensity.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove CapEx Intensity: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity workingCapitalNeeds
 */
export const useUpdateOpportunityWorkingCapitalNeeds = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateWorkingCapitalNeeds.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update Working Capital Needs: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity workingCapitalNeeds
 */
export const useRemoveOpportunityWorkingCapitalNeeds = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeWorkingCapitalNeeds.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove Working Capital Needs: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity coInvestment
 */
export const useUpdateOpportunityCoInvestment = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateCoInvestment.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update Co-Investment: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity coInvestment
 */
export const useRemoveOpportunityCoInvestment = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeCoInvestment.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove Co-Investment: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity equityContribution
 */
export const useUpdateOpportunityEquityContribution = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateEquityContribution.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update Equity Contribution: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity equityContribution
 */
export const useRemoveOpportunityEquityContribution = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeEquityContribution.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove Equity Contribution: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity grossIRR
 */
export const useUpdateOpportunityGrossIRR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateGrossIRR.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update Gross IRR: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to remove opportunity grossIRR
 */
export const useRemoveOpportunityGrossIRR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeGrossIRR.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove Gross IRR: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity shareholder structure images
 */
export const useUpdateOpportunityShareholderStructure = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.updateShareholderStructure.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to update shareholder structure images: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to remove a shareholder structure image from opportunity
 */
export const useRemoveOpportunityShareholderStructureImage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.mergerAndAcquisition.removeShareholderStructure.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.mergerAndAcquisition.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to remove shareholder structure image: ${error.message}`
        );
      },
    })
  );
};
