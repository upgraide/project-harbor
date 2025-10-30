"use client";

import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/locales/client";

export const InvestorsHeader = () => {
  const t = useScopedI18n("backoffice.investors");
  return (
    <div className="flex items-center justify-between">
      <h1 className="font-semibold text-2xl">{t("title")}</h1>
      <Button>{t("addNewInvestor")}</Button>
    </div>
  );
};
