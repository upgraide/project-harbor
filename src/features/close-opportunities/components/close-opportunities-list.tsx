"use client";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useScopedI18n } from "@/locales/client";
import { CloseOpportunitiesTable } from "./close-opportunities-table";
import {
  CloseOpportunitiesHeader,
  useCloseOpportunitiesParams,
  useSuspenseCloseOpportunities,
} from "./close-opportunities-container";

export const CloseOpportunitiesList = () => {
  const t = useScopedI18n("backoffice.closeOpportunities");
  const [params, setParams] = useCloseOpportunitiesParams();
  const opportunities = useSuspenseCloseOpportunities();

  const handleTypeChange = (value: string) => {
    setParams({ ...params, type: value as "all" | "mna" | "realEstate", page: "1" });
  };

  const handleStatusChange = (value: string) => {
    setParams({
      ...params,
      status: value as "all" | "ACTIVE" | "INACTIVE" | "CONCLUDED",
      page: "1",
    });
  };

  const handleSearchChange = (value: string) => {
    setParams({ ...params, search: value, page: "1" });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <CloseOpportunitiesHeader
        typeFilter={params.type}
        statusFilter={params.status}
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
      />

      <div className="flex items-center gap-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={params.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {opportunities.data.items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-muted-foreground">{t("emptyMessage")}</p>
        </div>
      ) : (
        <CloseOpportunitiesTable opportunities={opportunities.data.items} />
      )}
    </div>
  );
};

export const CloseOpportunitiesLoading = () => (
  <div className="flex flex-1 items-center justify-center">
    <Spinner />
  </div>
);

export const CloseOpportunitiesError = () => {
  const t = useScopedI18n("backoffice.closeOpportunities");
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-destructive">{t("errorMessage")}</p>
    </div>
  );
};
