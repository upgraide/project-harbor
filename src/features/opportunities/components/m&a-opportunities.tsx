"use client";

import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { BriefcaseBusinessIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  EmptyView,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  MergerAndAcquisition,
  OpportunityStatus,
} from "@/generated/prisma";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import {
  backofficeMergeAndAcquisitionOpportunityCreatePath,
  backofficeMergeAndAcquisitionOpportunityPath,
} from "@/paths";
import { useEntitySearch } from "../hooks/use-entity-search";
import {
  useDeleteOpportunity,
  useSuspenseOpportunities,
} from "../hooks/use-m&a-opportunities";
import { useOpportunitiesParams } from "../hooks/use-opportunities-params";

export const OpportunitiesStatusFilter = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunites");
  const [params, setParams] = useOpportunitiesParams();

  return (
    <Select
      onValueChange={(value) =>
        setParams({
          ...params,
          status: value as "all" | "ACTIVE" | "INACTIVE" | "CONCLUDED",
        })
      }
      value={params.status}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("statusFilter.all")}</SelectItem>
        <SelectItem value="ACTIVE">{t("statusFilter.active")}</SelectItem>
        <SelectItem value="INACTIVE">{t("statusFilter.inactive")}</SelectItem>
        <SelectItem value="CONCLUDED">{t("statusFilter.concluded")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export const OpportunitiesSearch = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunites");
  const [params, setParams] = useOpportunitiesParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <div className="flex gap-2">
      <EntitySearch
        onChange={onSearchChange}
        placeholder={t("searchPlaceholder")}
        value={searchValue}
      />
      <OpportunitiesStatusFilter />
    </div>
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
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunites");

  return (
    <EntityHeader
      description={t("description")}
      disabled={disabled}
      newButtonHref={backofficeMergeAndAcquisitionOpportunityCreatePath()}
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

export const OpportunitiesContent = () => (
  <>
    <OpportunitiesList />
    <OpportunitiesPagination />
  </>
);

export const OpportunitiesContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="h-full w-full overflow-x-hidden p-4 md:px-10 md:py-6">
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-y-8 overflow-hidden">
      <OpportunitiesHeader />
      <div className="flex h-full min-w-0 flex-col gap-y-4 overflow-hidden">
        <OpportunitiesSearch />
        <div className="flex min-w-0 flex-col gap-y-4 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const OpportunitiesLoading = () => <LoadingView />;

export const OpportunitiesError = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunites");
  return <ErrorView message={t("errorMessage")} />;
};

export const OpportunitiesEmpty = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunites");
  const router = useRouter();

  const handleCreate = () => {
    router.push(backofficeMergeAndAcquisitionOpportunityCreatePath());
  };

  return <EmptyView message={t("emptyMessage")} onNew={handleCreate} />;
};

export const OpportunityItem = ({ data }: { data: MergerAndAcquisition }) => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunites");
  const locale = useCurrentLocale();
  const removeOpportunity = useDeleteOpportunity();

  const handleRemove = () => {
    removeOpportunity.mutate({ id: data.id });
  };

  const getStatusBadgeVariant = (status: OpportunityStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "CONCLUDED":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <EntityItem
      href={backofficeMergeAndAcquisitionOpportunityPath(data.id)}
      image={
        <div className="flex size-8 items-center justify-center">
          <BriefcaseBusinessIcon className="size-5 text-muted-foreground" />
        </div>
      }
      isRemoving={removeOpportunity.isPending}
      onRemove={handleRemove}
      subtitle={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getStatusBadgeVariant(data.status)}>
            {t(`status.${data.status.toLowerCase()}`)}
          </Badge>
          <span className="text-muted-foreground">
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
          </span>
        </div>
      }
      title={data.name}
    />
  );
};
