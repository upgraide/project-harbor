"use client";

import { useEffect, useState } from "react";
import { EntitySearch } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";
import { useInvestmentInterestsParams } from "../hooks/use-investment-interests-params";

export const InvestmentInterestsSearch = () => {
  const t = useScopedI18n("backoffice.investment-interests");
  const [params, setParams] = useInvestmentInterestsParams();
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({ ...params, search: "" });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return (
    <EntitySearch
      onChange={setLocalSearch}
      placeholder={t("searchPlaceholder")}
      value={localSearch}
    />
  );
};
