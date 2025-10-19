"use client";

import { EntitySearch } from "@/components/entity-components";
import { useScopedI18n } from "@/locales/client";
import { useEntitySearch } from "../hooks/use-entity-search";
import { useUsersParams } from "../hooks/use-users-params";

export const UsersSearch = () => {
  const t = useScopedI18n("backoffice.users");
  const [params, setParams] = useUsersParams();
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
