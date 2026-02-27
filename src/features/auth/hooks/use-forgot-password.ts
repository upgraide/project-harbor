"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

export const useForgotPassword = () => {
  const trpc = useTRPC();
  const t = useScopedI18n("auth.forgotPasswordForm");

  return useMutation(
    trpc.password.forgotPassword.mutationOptions({
      onSuccess: () => {
        toast.success(t("successMessage"));
      },
      onError: () => {
        toast.error(t("errorMessage"));
      },
    })
  );
};
