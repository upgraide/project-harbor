"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useEntitySearch } from "../hooks/use-entity-search";
import {
  useCreateOpportunity,
  useSuspenseOpportunities,
} from "../hooks/use-opportunities";
import { useOpportunitiesParams } from "../hooks/use-opportunities-params";

export const OpportunitiesSearch = () => {
  const [params, setParams] = useOpportunitiesParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      onChange={onSearchChange}
      placeholder="Search opportunities"
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
      renderItem={(item) => <p>{item.name}</p>}
    />
  );
};

export const OpportunitiesHeader = ({ disabled }: { disabled?: boolean }) => {
  const createOpportunity = useCreateOpportunity();
  const router = useRouter();

  const handleCreate = () => {
    createOpportunity.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/backoffice/m&a/${data.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create opportunity: ${error.message}`);
      },
    });
  };

  return (
    <EntityHeader
      description="Create and manage your opportunities"
      disabled={disabled}
      isCreating={false}
      newButtonLabel="New Opportunity"
      onNew={handleCreate}
      title="Opportunities"
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

export const OpportunitiesLoading = () => (
  <LoadingView message="Loading opportunities..." />
);

export const OpportunitiesError = () => (
  <ErrorView message="Error loading opportunities..." />
);

export const OpportunitiesEmpty = () => {
  const createOpportunity = useCreateOpportunity();
  const router = useRouter();

  const handleCreate = () => {
    createOpportunity.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/backoffice/m&a/${data.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create opportunity: ${error.message}`);
      },
    });
  };

  return (
    <EmptyView
      message="No opportunities found. Get Started by creating an opportunity."
      onNew={handleCreate}
    />
  );
};
