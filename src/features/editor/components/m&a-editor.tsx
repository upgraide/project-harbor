"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseOpportunity } from "@/features/opportunities/hooks/use-m&a-opportunities";
import { useScopedI18n } from "@/locales/client";

export const EditorLoading = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return <LoadingView message={t("loadingMessage")} />;
};

export const EditorError = () => {
  const t = useScopedI18n("backoffice.mergersAndAcquisitionOpportunityPage");
  return <ErrorView message={t("errorMessage")} />;
};

export const Editor = ({ opportunityId }: { opportunityId: string }) => {
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);

  return <p>{JSON.stringify(opportunity, null, 2)}</p>;
};
