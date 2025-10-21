"use client";

import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { BriefcaseIcon } from "lucide-react";
import Link from "next/link";
import {
  EmptyView,
  EntityContainer,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useEntitySearch } from "@/features/opportunities/hooks/use-entity-search";
import { useSuspenseOpportunities } from "@/features/opportunities/hooks/use-opportunities";
import { useOpportunitiesParams } from "@/features/opportunities/hooks/use-opportunities-params";
import { cn } from "@/lib/utils";
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

  return (
    <EntityList
      emptyView={<OpportunitiesEmpty />}
      getKey={(opportunity) => opportunity.id}
      items={opportunities.data.items}
      renderItem={(item) => <OpportunityItem data={item} />}
    />
  );
};

type OpportunityItemProps = {
  data: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    opportunityType: "mna" | "realEstate";
  };
};

type EntityItemProps = {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  className?: string;
};

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  className,
}: EntityItemProps) => (
  <Link href={href} prefetch>
    <Card
      className={cn("cursor-pointer p-4 shadow-none hover:shadow", className)}
    >
      <CardContent className="flex flex-row items-center justify-between p-0">
        <div className="flex items-center gap-3">
          {image}
          <div>
            <CardTitle className="font-medium text-base">{title}</CardTitle>
            {!!subtitle && (
              <CardDescription className="text-xs">{subtitle}</CardDescription>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export const OpportunityItem = ({ data }: OpportunityItemProps) => {
  const t = useScopedI18n("dashboard.opportunities");
  const locale = useCurrentLocale();

  const href =
    data.opportunityType === "mna"
      ? dashboardMergerAndAcquisitionOpportunityPath(data.id)
      : dashboardRealEstateOpportunityPath(data.id);

  return (
    <EntityItem
      href={href}
      image={
        <div className="flex size-8 items-center justify-center">
          <BriefcaseIcon className="size-5 text-muted-foreground" />
        </div>
      }
      subtitle={
        <>
          {t("updated")}{" "}
          {formatDistanceToNow(data.updatedAt, {
            addSuffix: true,
            locale: locale === "pt" ? pt : undefined,
          })}{" "}
          &bull; {t("created")}{" "}
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
