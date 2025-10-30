"use client";

import { EntitySearch } from "@/components/entity-components";
import { useEntitySearch } from "@/features/users/hooks/use-entity-search";
import { useScopedI18n } from "@/locales/client";
import { useInvestmentInterestsParams } from "../hooks/use-investment-interests-params";

export const InvestmentInterestsSearch = () => {
  const t = useScopedI18n("backoffice.investment-interests");
  const [params, setParams] = useInvestmentInterestsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      onChange={onSearchChange}
      placeholder={t("searchPlaceholder")}
      value={searchValue}
    />
  );
};
