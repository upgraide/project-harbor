"use client";

import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { BuildingIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import type { RealEstate } from "@/generated/prisma";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import {
  backofficeRealEstateOpportunityCreatePath,
  backofficeRealEstateOpportunityPath,
} from "@/paths";
import { useEntitySearch } from "../hooks/use-entity-search";
import { useOpportunitiesParams } from "../hooks/use-opportunities-params";
import {
  useDeleteOpportunity,
  useSuspenseOpportunities,
} from "../hooks/use-real-estate-opportunities";

export const OpportunitiesSearch = () => {
  const t = useScopedI18n("backoffice.realEstateOpportunities");
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

export const OpportunitiesList = () => {
  const opportunities = useSuspenseOpportunities();

  return (
    <EntityList
      emptyView={<OpportunitiesEmpty />}
      getKey={(opportunity) => opportunity.id}
      items={opportunities.data.items}
      renderItem={(item) => <OpportunityItem data={item} />}
    />
  );
};

export const OpportunitiesHeader = ({ disabled }: { disabled?: boolean }) => {
  const t = useScopedI18n("backoffice.realEstateOpportunities");

  return (
    <EntityHeader
      description={t("description")}
      disabled={disabled}
      newButtonHref={backofficeRealEstateOpportunityCreatePath()}
      newButtonLabel={t("newButtonLabel")}
      title={t("title")}
    />
  );
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

export const OpportunitiesLoading = () => <LoadingView />;

export const OpportunitiesError = () => {
  const t = useScopedI18n("backoffice.realEstateOpportunities");
  return <ErrorView message={t("errorMessage")} />;
};

export const OpportunitiesEmpty = () => {
  const t = useScopedI18n("backoffice.realEstateOpportunities");
  const router = useRouter();

  const handleCreate = () => {
    router.push(backofficeRealEstateOpportunityCreatePath());
  };

  return <EmptyView message={t("emptyMessage")} onNew={handleCreate} />;
};

export const OpportunityItem = ({ data }: { data: RealEstate }) => {
  const t = useScopedI18n("backoffice.realEstateOpportunities");
  const locale = useCurrentLocale();
  const removeOpportunity = useDeleteOpportunity();

  const handleRemove = () => {
    removeOpportunity.mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={backofficeRealEstateOpportunityPath(data.id)}
      image={
        <div className="flex size-8 items-center justify-center">
          <BuildingIcon className="size-5 text-muted-foreground" />
        </div>
      }
      isRemoving={removeOpportunity.isPending}
      onRemove={handleRemove}
      subtitle={
        <>
          {t("updatedAt")}{" "}
          {formatDistanceToNow(data.updatedAt, {
            addSuffix: true,
            locale: locale === "pt" ? pt : undefined,
          })}{" "}
          &bull; {t("createdAt")}{" "}
          {formatDistanceToNow(data.createdAt, {
            addSuffix: true,
            locale: locale === "pt" ? pt : undefined,
          })}
        </>
      }
      title={data.name}
    />
  );
};
