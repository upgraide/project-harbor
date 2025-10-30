"use client";

import { useScopedI18n } from "@/locales/client";

export const InvestmentInterestsHeader = () => {
  const t = useScopedI18n("backoffice.investment-interests");
  return <h1 className="font-semibold text-2xl">{t("title")}</h1>;
};
