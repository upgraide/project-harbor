"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseOpportunity } from "@/features/opportunities/hooks/use-m&a-opportunities";

export const EditorLoading = () => (
  <LoadingView message="Loading opportunity..." />
);

export const EditorError = () => (
  <ErrorView message="Error loading opportunity..." />
);

export const Editor = ({ opportunityId }: { opportunityId: string }) => {
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);

  return <p>{JSON.stringify(opportunity, null, 2)}</p>;
};
