"use client";

import {
  EntityContainer,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useEntitySearch } from "@/features/opportunities/hooks/use-entity-search";
import { useSuspenseOpportunities } from "@/features/opportunities/hooks/use-opportunities";
import { useOpportunitiesParams } from "@/features/opportunities/hooks/use-opportunities-params";
import { useScopedI18n } from "@/locales/client";

export const OpportunitiesLoading = () => {
  const t = useScopedI18n("dashboard.opportunities");
  return <LoadingView message={t("loadingMessage")} />;
};

export const OpportunitiesError = () => {
  const t = useScopedI18n("dashboard.opportunities");
  return <ErrorView message={t("errorMessage")} />;
};

type EntityHeaderProps = {
  title: string;
  description?: string;
};

export const EntityHeader = ({ title, description }: EntityHeaderProps) => (
  <div className="flex flex-row items-center gap-x-4">
    <div className="flex flex-col">
      <h1 className="font-semibold text-lg md:text-xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-xs md:text-sm">
          {description}
        </p>
      )}
    </div>
  </div>
);

export const OpportunitiesHeader = () => {
  const t = useScopedI18n("dashboard.opportunities");
  return <EntityHeader description={t("description")} title={t("title")} />;
};

export const OpportunitiesPagination = () => {
  const opportunities = useSuspenseOpportunities();
  const [params, setParams] = useOpportunitiesParams();
  return (
    <EntityPagination
      disabled={opportunities.isFetching}
      onPageChange={(page) => setParams({ ...params, page })}
      page={opportunities.data.page}
      totalPages={opportunities.data.totalPages}
    />
  );
};

export const OpportunitiesSearch = () => {
  const t = useScopedI18n("dashboard.opportunities");
  const [params, setParams] = useOpportunitiesParams();
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

export const OpportunitiesContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <EntityContainer
    header={<OpportunitiesHeader />}
    pagination={<OpportunitiesPagination />}
    search={<OpportunitiesSearch />}
  >
    {children}
  </EntityContainer>
);
