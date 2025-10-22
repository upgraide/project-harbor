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

/**
 * hook to fetch an opportunity using suspense
 */
export const useSuspenseOpportunity = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.realEstate.getOne.queryOptions({ id }));
};

/**
 * Hook to update an opportunity name
 */
export const useUpdateOpportunityName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(trpc.realEstate.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
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
    trpc.realEstate.updateDescription.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Opportunity ${data.name} updated`);
        queryClient.invalidateQueries(trpc.realEstate.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
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
 * Hook to update opportunity images
 */
export const useUpdateOpportunityImages = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateImages.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.realEstate.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
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
    trpc.realEstate.removeImage.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.realEstate.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
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

// Pre-NDA Fields Update Hooks

/**
 * Hook to update opportunity asset
 */
export const useUpdateOpportunityAsset = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateAsset.mutationOptions({
      onSuccess: (data) => {
        toast.success("Asset updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update asset: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity nRoomsLastYear
 */
export const useUpdateOpportunityNRoomsLastYear = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateNRoomsLastYear.mutationOptions({
      onSuccess: (data) => {
        toast.success("Number of rooms updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update number of rooms: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity NOI
 */
export const useUpdateOpportunityNOI = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateNOI.mutationOptions({
      onSuccess: (data) => {
        toast.success("NOI updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update NOI: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity occupancy last year
 */
export const useUpdateOpportunityOccupancyLastYear = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateOccupancyLastYear.mutationOptions({
      onSuccess: (data) => {
        toast.success("Occupancy updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update occupancy: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity WALT
 */
export const useUpdateOpportunityWALT = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateWALT.mutationOptions({
      onSuccess: (data) => {
        toast.success("WALT updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update WALT: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity number of beds
 */
export const useUpdateOpportunityNBeds = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateNBeds.mutationOptions({
      onSuccess: (data) => {
        toast.success("Number of beds updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update number of beds: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity investment type
 */
export const useUpdateOpportunityInvestment = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateInvestment.mutationOptions({
      onSuccess: (data) => {
        toast.success("Investment type updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update investment type: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity subRent
 */
export const useUpdateOpportunitySubRent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateSubRent.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sub rent updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update sub rent: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity rentPerSqm
 */
export const useUpdateOpportunityRentPerSqm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateRentPerSqm.mutationOptions({
      onSuccess: (data) => {
        toast.success("Rent per sqm updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update rent per sqm: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity subYield
 */
export const useUpdateOpportunitySubYield = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateSubYield.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sub yield updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update sub yield: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity capex
 */
export const useUpdateOpportunityCapex = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateCapex.mutationOptions({
      onSuccess: (data) => {
        toast.success("Capex updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update capex: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity capexPerSqm
 */
export const useUpdateOpportunityCapexPerSqm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateCapexPerSqm.mutationOptions({
      onSuccess: (data) => {
        toast.success("Capex per sqm updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update capex per sqm: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity sale
 */
export const useUpdateOpportunitySale = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateSale.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sale updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update sale: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity salePerSqm
 */
export const useUpdateOpportunitySalePerSqm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateSalePerSqm.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sale per sqm updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update sale per sqm: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity location
 */
export const useUpdateOpportunityLocation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateLocation.mutationOptions({
      onSuccess: (data) => {
        toast.success("Location updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update location: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity area
 */
export const useUpdateOpportunityArea = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateArea.mutationOptions({
      onSuccess: (data) => {
        toast.success("Area updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update area: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity value
 */
export const useUpdateOpportunityValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateValue.mutationOptions({
      onSuccess: (data) => {
        toast.success("Value updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update value: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity yield
 */
export const useUpdateOpportunityYield = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateYield.mutationOptions({
      onSuccess: (data) => {
        toast.success("Yield updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update yield: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity rent
 */
export const useUpdateOpportunityRent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateRent.mutationOptions({
      onSuccess: (data) => {
        toast.success("Rent updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update rent: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity gcaAboveGround
 */
export const useUpdateOpportunityGCAAboveGround = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateGCAAboveGround.mutationOptions({
      onSuccess: (data) => {
        toast.success("GCA above ground updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update GCA above ground: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity gcaBelowGround
 */
export const useUpdateOpportunityGCABelowGround = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateGCABelowGround.mutationOptions({
      onSuccess: (data) => {
        toast.success("GCA below ground updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update GCA below ground: ${error.message}`);
      },
    })
  );
};

// Post-NDA Fields Update Hooks

/**
 * Hook to update opportunity license
 */
export const useUpdateOpportunityLicense = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateLicense.mutationOptions({
      onSuccess: (data) => {
        toast.success("License updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update license: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity licenseStage
 */
export const useUpdateOpportunityLicenseStage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateLicenseStage.mutationOptions({
      onSuccess: (data) => {
        toast.success("License stage updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update license stage: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity IRR
 */
export const useUpdateOpportunityIRR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateIRR.mutationOptions({
      onSuccess: (data) => {
        toast.success("IRR updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update IRR: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity CoC
 */
export const useUpdateOpportunityCOC = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateCOC.mutationOptions({
      onSuccess: (data) => {
        toast.success("CoC updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update CoC: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity holdingPeriod
 */
export const useUpdateOpportunityHoldingPeriod = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateHoldingPeriod.mutationOptions({
      onSuccess: (data) => {
        toast.success("Holding period updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update holding period: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity breakEvenOccupancy
 */
export const useUpdateOpportunityBreakEvenOccupancy = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateBreakEvenOccupancy.mutationOptions({
      onSuccess: (data) => {
        toast.success("Break-even occupancy updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update break-even occupancy: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity vacancyRate
 */
export const useUpdateOpportunityVacancyRate = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateVacancyRate.mutationOptions({
      onSuccess: (data) => {
        toast.success("Vacancy rate updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update vacancy rate: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity estimatedRentValue
 */
export const useUpdateOpportunityEstimatedRentValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateEstimatedRentValue.mutationOptions({
      onSuccess: (data) => {
        toast.success("Estimated rent value updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update estimated rent value: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity occupancyRate
 */
export const useUpdateOpportunityOccupancyRate = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateOccupancyRate.mutationOptions({
      onSuccess: (data) => {
        toast.success("Occupancy rate updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update occupancy rate: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity MOIC
 */
export const useUpdateOpportunityMOIC = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateMOIC.mutationOptions({
      onSuccess: (data) => {
        toast.success("MOIC updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update MOIC: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity price
 */
export const useUpdateOpportunityPrice = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updatePrice.mutationOptions({
      onSuccess: (data) => {
        toast.success("Price updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update price: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity totalInvestment
 */
export const useUpdateOpportunityTotalInvestment = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateTotalInvestment.mutationOptions({
      onSuccess: (data) => {
        toast.success("Total investment updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update total investment: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity profitOnCost
 */
export const useUpdateOpportunityProfitOnCost = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateProfitOnCost.mutationOptions({
      onSuccess: (data) => {
        toast.success("Profit on cost updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update profit on cost: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity profit
 */
export const useUpdateOpportunityProfit = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateProfit.mutationOptions({
      onSuccess: (data) => {
        toast.success("Profit updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update profit: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity sofCosts
 */
export const useUpdateOpportunitySofCosts = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateSofCosts.mutationOptions({
      onSuccess: (data) => {
        toast.success("Soft costs updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update soft costs: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity sellPerSqm
 */
export const useUpdateOpportunitySellPerSqm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateSellPerSqm.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sell per sqm updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update sell per sqm: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity GDV
 */
export const useUpdateOpportunityGDV = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateGDV.mutationOptions({
      onSuccess: (data) => {
        toast.success("GDV updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update GDV: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity WAULT
 */
export const useUpdateOpportunityWAULT = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateWAULT.mutationOptions({
      onSuccess: (data) => {
        toast.success("WAULT updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update WAULT: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity debtServiceCoverageRatio
 */
export const useUpdateOpportunityDebtServiceCoverageRatio = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateDebtServiceCoverageRatio.mutationOptions({
      onSuccess: (data) => {
        toast.success("Debt service coverage ratio updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to update debt service coverage ratio: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update opportunity expectedExitYield
 */
export const useUpdateOpportunityExpectedExitYield = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateExpectedExitYield.mutationOptions({
      onSuccess: (data) => {
        toast.success("Expected exit yield updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update expected exit yield: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity LTV
 */
export const useUpdateOpportunityLTV = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateLTV.mutationOptions({
      onSuccess: (data) => {
        toast.success("LTV updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update LTV: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity LTC
 */
export const useUpdateOpportunityLTC = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateLTC.mutationOptions({
      onSuccess: (data) => {
        toast.success("LTC updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update LTC: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity yieldOnCost
 */
export const useUpdateOpportunityYieldOnCost = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateYieldOnCost.mutationOptions({
      onSuccess: (data) => {
        toast.success("Yield on cost updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update yield on cost: ${error.message}`);
      },
    })
  );
};

// Limited Partner Fields Update Hooks

/**
 * Hook to update opportunity coInvestment
 */
export const useUpdateOpportunityCoInvestment = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateCoInvestment.mutationOptions({
      onSuccess: (data) => {
        toast.success("Co-investment updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update co-investment: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity gpEquityValue
 */
export const useUpdateOpportunityGPEquityValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateGPEquityValue.mutationOptions({
      onSuccess: (data) => {
        toast.success("GP equity value updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update GP equity value: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity gpEquityPercentage
 */
export const useUpdateOpportunityGPEquityPercentage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateGPEquityPercentage.mutationOptions({
      onSuccess: (data) => {
        toast.success("GP equity percentage updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update GP equity percentage: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity totalEquityRequired
 */
export const useUpdateOpportunityTotalEquityRequired = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateTotalEquityRequired.mutationOptions({
      onSuccess: (data) => {
        toast.success("Total equity required updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update total equity required: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity projectIRR
 */
export const useUpdateOpportunityProjectIRR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateProjectIRR.mutationOptions({
      onSuccess: (data) => {
        toast.success("Project IRR updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update project IRR: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity investorIRR
 */
export const useUpdateOpportunityInvestorIRR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateInvestorIRR.mutationOptions({
      onSuccess: (data) => {
        toast.success("Investor IRR updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update investor IRR: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity coInvestmentHoldPeriod
 */
export const useUpdateOpportunityCoInvestmentHoldPeriod = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateCoInvestmentHoldPeriod.mutationOptions({
      onSuccess: (data) => {
        toast.success("Co-investment hold period updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to update co-investment hold period: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update opportunity coInvestmentBreakEvenOccupancy
 */
export const useUpdateOpportunityCoInvestmentBreakEvenOccupancy = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateCoInvestmentBreakEvenOccupancy.mutationOptions({
      onSuccess: (data) => {
        toast.success("Co-investment break-even occupancy updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to update co-investment break-even occupancy: ${error.message}`
        );
      },
    })
  );
};

/**
 * Hook to update opportunity sponsorPresentation
 */
export const useUpdateOpportunitySponsorPresentation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updateSponsorPresentation.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sponsor presentation updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update sponsor presentation: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to update opportunity promoteStructure
 */
export const useUpdateOpportunityPromoteStructure = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.updatePromoteStructure.mutationOptions({
      onSuccess: (data) => {
        toast.success("Promote structure updated");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update promote structure: ${error.message}`);
      },
    })
  );
};

// Pre-NDA Remove Hooks
export const useRemoveOpportunityAsset = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeAsset.mutationOptions({
      onSuccess: (data) => {
        toast.success("Asset removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove asset: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityNRoomsLastYear = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeNRoomsLastYear.mutationOptions({
      onSuccess: (data) => {
        toast.success("Number of rooms removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove number of rooms: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityNOI = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeNOI.mutationOptions({
      onSuccess: (data) => {
        toast.success("NOI removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove NOI: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityOccupancyLastYear = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeOccupancyLastYear.mutationOptions({
      onSuccess: (data) => {
        toast.success("Occupancy last year removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove occupancy last year: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityWALT = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeWALT.mutationOptions({
      onSuccess: (data) => {
        toast.success("WALT removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove WALT: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityNBeds = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeNBeds.mutationOptions({
      onSuccess: (data) => {
        toast.success("Number of beds removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove number of beds: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityInvestment = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeInvestment.mutationOptions({
      onSuccess: (data) => {
        toast.success("Investment removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove investment: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunitySubRent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeSubRent.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sub rent removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove sub rent: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityRentPerSqm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeRentPerSqm.mutationOptions({
      onSuccess: (data) => {
        toast.success("Rent per sqm removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove rent per sqm: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunitySubYield = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeSubYield.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sub yield removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove sub yield: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityCapex = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeCapex.mutationOptions({
      onSuccess: (data) => {
        toast.success("Capex removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove capex: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityCapexPerSqm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeCapexPerSqm.mutationOptions({
      onSuccess: (data) => {
        toast.success("Capex per sqm removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove capex per sqm: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunitySale = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeSale.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sale removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove sale: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunitySalePerSqm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeSalePerSqm.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sale per sqm removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove sale per sqm: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityLocation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeLocation.mutationOptions({
      onSuccess: (data) => {
        toast.success("Location removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove location: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityArea = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeArea.mutationOptions({
      onSuccess: (data) => {
        toast.success("Area removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove area: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeValue.mutationOptions({
      onSuccess: (data) => {
        toast.success("Value removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove value: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityYield = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeYield.mutationOptions({
      onSuccess: (data) => {
        toast.success("Yield removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove yield: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityRent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeRent.mutationOptions({
      onSuccess: (data) => {
        toast.success("Rent removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove rent: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityGCAAboveGround = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeGCAAboveGround.mutationOptions({
      onSuccess: (data) => {
        toast.success("GCA above ground removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove GCA above ground: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityGCABelowGround = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeGCABelowGround.mutationOptions({
      onSuccess: (data) => {
        toast.success("GCA below ground removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove GCA below ground: ${error.message}`);
      },
    })
  );
};

// Post-NDA Remove Hooks
export const useRemoveOpportunityLicense = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeLicense.mutationOptions({
      onSuccess: (data) => {
        toast.success("License removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove license: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityLicenseStage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeLicenseStage.mutationOptions({
      onSuccess: (data) => {
        toast.success("License stage removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove license stage: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityIRR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeIRR.mutationOptions({
      onSuccess: (data) => {
        toast.success("IRR removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove IRR: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityCOC = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeCOC.mutationOptions({
      onSuccess: (data) => {
        toast.success("COC removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove COC: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityHoldingPeriod = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeHoldingPeriod.mutationOptions({
      onSuccess: (data) => {
        toast.success("Holding period removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove holding period: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityBreakEvenOccupancy = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeBreakEvenOccupancy.mutationOptions({
      onSuccess: (data) => {
        toast.success("Break-even occupancy removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove break-even occupancy: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityVacancyRate = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeVacancyRate.mutationOptions({
      onSuccess: (data) => {
        toast.success("Vacancy rate removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove vacancy rate: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityEstimatedRentValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeEstimatedRentValue.mutationOptions({
      onSuccess: (data) => {
        toast.success("Estimated rent value removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove estimated rent value: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityOccupancyRate = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeOccupancyRate.mutationOptions({
      onSuccess: (data) => {
        toast.success("Occupancy rate removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove occupancy rate: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityMOIC = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeMOIC.mutationOptions({
      onSuccess: (data) => {
        toast.success("MOIC removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove MOIC: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityPrice = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removePrice.mutationOptions({
      onSuccess: (data) => {
        toast.success("Price removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove price: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityTotalInvestment = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeTotalInvestment.mutationOptions({
      onSuccess: (data) => {
        toast.success("Total investment removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove total investment: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityProfitOnCost = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeProfitOnCost.mutationOptions({
      onSuccess: (data) => {
        toast.success("Profit on cost removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove profit on cost: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityProfit = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeProfit.mutationOptions({
      onSuccess: (data) => {
        toast.success("Profit removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove profit: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunitySofCosts = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeSofCosts.mutationOptions({
      onSuccess: (data) => {
        toast.success("Soft costs removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove soft costs: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunitySellPerSqm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeSellPerSqm.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sell per sqm removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove sell per sqm: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityGDV = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeGDV.mutationOptions({
      onSuccess: (data) => {
        toast.success("GDV removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove GDV: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityWAULT = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeWAULT.mutationOptions({
      onSuccess: (data) => {
        toast.success("WAULT removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove WAULT: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityDebtServiceCoverageRatio = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeDebtServiceCoverageRatio.mutationOptions({
      onSuccess: (data) => {
        toast.success("Debt service coverage ratio removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to remove debt service coverage ratio: ${error.message}`
        );
      },
    })
  );
};

export const useRemoveOpportunityExpectedExitYield = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeExpectedExitYield.mutationOptions({
      onSuccess: (data) => {
        toast.success("Expected exit yield removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove expected exit yield: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityLTV = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeLTV.mutationOptions({
      onSuccess: (data) => {
        toast.success("LTV removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove LTV: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityLTC = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeLTC.mutationOptions({
      onSuccess: (data) => {
        toast.success("LTC removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove LTC: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityYieldOnCost = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeYieldOnCost.mutationOptions({
      onSuccess: (data) => {
        toast.success("Yield on cost removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove yield on cost: ${error.message}`);
      },
    })
  );
};

// Limited Partner Remove Hooks
export const useRemoveOpportunityCoInvestment = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeCoInvestment.mutationOptions({
      onSuccess: (data) => {
        toast.success("Co-investment removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove co-investment: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityGPEquityValue = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeGPEquityValue.mutationOptions({
      onSuccess: (data) => {
        toast.success("GP equity value removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove GP equity value: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityGPEquityPercentage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeGPEquityPercentage.mutationOptions({
      onSuccess: (data) => {
        toast.success("GP equity percentage removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove GP equity percentage: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityTotalEquityRequired = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeTotalEquityRequired.mutationOptions({
      onSuccess: (data) => {
        toast.success("Total equity required removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove total equity required: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityProjectIRR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeProjectIRR.mutationOptions({
      onSuccess: (data) => {
        toast.success("Project IRR removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove project IRR: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityInvestorIRR = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeInvestorIRR.mutationOptions({
      onSuccess: (data) => {
        toast.success("Investor IRR removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove investor IRR: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityCoInvestmentHoldPeriod = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeCoInvestmentHoldPeriod.mutationOptions({
      onSuccess: (data) => {
        toast.success("Co-investment hold period removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to remove co-investment hold period: ${error.message}`
        );
      },
    })
  );
};

export const useRemoveOpportunityCoInvestmentBreakEvenOccupancy = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeCoInvestmentBreakEvenOccupancy.mutationOptions({
      onSuccess: (data) => {
        toast.success("Co-investment break-even occupancy removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(
          `Failed to remove co-investment break-even occupancy: ${error.message}`
        );
      },
    })
  );
};

export const useRemoveOpportunitySponsorPresentation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removeSponsorPresentation.mutationOptions({
      onSuccess: (data) => {
        toast.success("Sponsor presentation removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove sponsor presentation: ${error.message}`);
      },
    })
  );
};

export const useRemoveOpportunityPromoteStructure = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.realEstate.removePromoteStructure.mutationOptions({
      onSuccess: (data) => {
        toast.success("Promote structure removed");
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove promote structure: ${error.message}`);
      },
    })
  );
};
