"use client";

import { EntitySearch } from "@/components/entity-components";
import { useEntitySearch } from "@/features/users/hooks/use-entity-search";
import { useScopedI18n } from "@/locales/client";
import { useInvestorsParams } from "../hooks/use-investors-params";

export const InvestorsSearch = () => {
  const t = useScopedI18n("backoffice.investors");
  const [params, setParams] = useInvestorsParams();
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
