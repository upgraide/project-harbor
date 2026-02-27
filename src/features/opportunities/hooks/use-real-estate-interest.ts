import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to get user's interest status for a Real Estate opportunity
 */
export const useGetRealEstateInterest = (opportunityId: string) => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();

  return useQuery({
    ...trpc.userInterest.getRealEstateInterest.queryOptions({ opportunityId }),
    enabled: !!session?.user?.id,
  });
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
 * Hook to start NDA signing flow for a Real Estate opportunity.
 * Redirects to PandaDocs for signing on success.
 */
export const useSignRealEstateNDA = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.userInterest.signRealEstateNDA.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data.signingUrl;
      },
      onError: (error) => {
        toast.error(`Failed to start NDA signing: ${error.message}`);
      },
    })
  );
};
