"use client";

import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { BriefcaseIcon, BuildingIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  EmptyView,
  EntityContainer,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useEntitySearch } from "@/features/opportunities/hooks/use-entity-search";
import { useSuspenseOpportunities } from "@/features/opportunities/hooks/use-opportunities";
import { useOpportunitiesParams } from "@/features/opportunities/hooks/use-opportunities-params";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import {
  dashboardMergerAndAcquisitionOpportunityPath,
  dashboardRealEstateOpportunityPath,
} from "@/paths";

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

export const OpportunitiesEmpty = () => {
  const t = useScopedI18n("dashboard.opportunities");
  return <EmptyView message={t("emptyMessage")} />;
};

export const OpportunitiesList = () => {
  const opportunities = useSuspenseOpportunities();

  if (opportunities.data.items.length === 0) {
    return <OpportunitiesEmpty />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {opportunities.data.items.map((item) => (
        <OpportunityItem data={item} key={item.id} />
      ))}
    </div>
  );
};

type OpportunityItemProps = {
  data: {
    id: string;
    name: string;
    description: string | null;
    englishDescription: string | null;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    opportunityType: "mna" | "realEstate";
  };
};

export const OpportunityItem = ({ data }: OpportunityItemProps) => {
  const t = useScopedI18n("dashboard.opportunities");
  const locale = useCurrentLocale();

  const href =
    data.opportunityType === "mna"
      ? dashboardMergerAndAcquisitionOpportunityPath(data.id)
      : dashboardRealEstateOpportunityPath(data.id);

  const firstImage = data.images?.[0];

  const displayDescription =
    locale === "en" ? data.englishDescription : data.description;

  return (
    <Card className="flex flex-col overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-md">
      {firstImage ? (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            alt={data.name}
            className="object-cover"
            fill
            src={firstImage}
          />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center bg-muted">
          {data.opportunityType === "mna" ? (
            <BriefcaseIcon className="size-12 text-muted-foreground" />
          ) : (
            <BuildingIcon className="size-12 text-muted-foreground" />
          )}
        </div>
      )}

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-1 flex-col gap-2">
          <CardTitle className="line-clamp-2 text-base">{data.name}</CardTitle>
          {displayDescription && (
            <CardDescription className="line-clamp-3 text-sm">
              {displayDescription}
            </CardDescription>
          )}
        </div>

        <div className="space-y-1 text-muted-foreground text-xs">
          <p>
            {t("updated")}{" "}
            {formatDistanceToNow(data.updatedAt, {
              addSuffix: true,
              locale: locale === "pt" ? pt : undefined,
            })}
          </p>
        </div>

        <Link className="w-full" href={href} prefetch>
          <Button className="w-full" type="button" variant="default">
            {t("viewButton")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
