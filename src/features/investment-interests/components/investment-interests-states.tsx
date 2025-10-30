"use client";

import { Spinner } from "@/components/ui/spinner";
import { useScopedI18n } from "@/locales/client";

export const InvestmentInterestsLoading = () => (
  <div className="flex flex-1 items-center justify-center">
    <Spinner />
  </div>
);

export const InvestmentInterestsError = () => {
  const t = useScopedI18n("backoffice.investment-interests");
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-destructive">{t("errorMessage")}</p>
    </div>
  );
};
