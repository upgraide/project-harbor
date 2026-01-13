import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to get user's interest status for a Real Estate opportunity
 */
export const useGetRealEstateInterest = (opportunityId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.userInterest.getRealEstateInterest.queryOptions({ opportunityId })
  );
};

/**
 * Hook to mark a user as interested in a Real Estate opportunity
 */
export const useMarkRealEstateInterest = (onSuccess?: () => void) => {
  const trpc = useTRPC();

  return useMutation(
    trpc.userInterest.markRealEstateInterest.mutationOptions({
      onSuccess: () => {
        toast.success("Interest recorded");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Failed to record interest: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to mark a user as not interested in a Real Estate opportunity
 */
export const useMarkRealEstateNoInterest = (onSuccess?: () => void) => {
  const trpc = useTRPC();

  return useMutation(
    trpc.userInterest.markRealEstateNoInterest.mutationOptions({
      onSuccess: () => {
        toast.success("No interest recorded");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Failed to record no interest: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to mark NDA as signed for a Real Estate opportunity
 */
export const useSignRealEstateNDA = (onSuccess?: () => void) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.userInterest.signRealEstateNDA.mutationOptions({
      onSuccess: (_data, variables) => {
        toast.success("NDA signed");
        // Invalidate both queries to refetch and show post-NDA data
        queryClient.invalidateQueries(
          trpc.realEstate.getOne.queryOptions({
            id: variables.opportunityId,
          })
        );
        queryClient.invalidateQueries(
          trpc.userInterest.getRealEstateInterest.queryOptions({
            opportunityId: variables.opportunityId,
          })
        );
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Failed to sign NDA: ${error.message}`);
      },
    })
  );
};
