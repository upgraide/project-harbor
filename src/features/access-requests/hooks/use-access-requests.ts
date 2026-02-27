"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

export const useAccessRequests = () => {
  const trpc = useTRPC();

  return useQuery(
    trpc.accessRequest.getMany.queryOptions({ status: "PENDING" })
  );
};

export const useApproveAccessRequest = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useScopedI18n("backoffice.accessRequests");

  return useMutation(
    trpc.accessRequest.approve.mutationOptions({
      onSuccess: () => {
        toast.success(t("approveSuccess"));
        queryClient.invalidateQueries({
          queryKey: trpc.accessRequest.getMany.queryOptions({
            status: "PENDING",
          }).queryKey,
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : t("errorMessage");
        toast.error(errorMessage);
      },
    })
  );
};

export const useRejectAccessRequest = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useScopedI18n("backoffice.accessRequests");

  return useMutation(
    trpc.accessRequest.reject.mutationOptions({
      onSuccess: () => {
        toast.success(t("rejectSuccess"));
        queryClient.invalidateQueries({
          queryKey: trpc.accessRequest.getMany.queryOptions({
            status: "PENDING",
          }).queryKey,
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : t("errorMessage");
        toast.error(errorMessage);
      },
    })
  );
};
