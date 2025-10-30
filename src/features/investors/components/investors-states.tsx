"use client";

import { Spinner } from "@/components/ui/spinner";
import { useScopedI18n } from "@/locales/client";

export const InvestorsLoading = () => (
  <div className="flex flex-1 items-center justify-center">
    <Spinner />
  </div>
);

export const InvestorsError = () => {
  const t = useScopedI18n("backoffice.investors");
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-destructive">{t("errorMessage")}</p>
    </div>
  );
};
