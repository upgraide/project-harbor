"use client";

import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useScopedI18n } from "@/locales/client";
import {
  CloseOpportunitiesHeader,
  useCloseOpportunitiesParams,
  useSuspenseCloseOpportunities,
} from "./close-opportunities-container";
import { CloseOpportunitiesTable } from "./close-opportunities-table";

export const CloseOpportunitiesSearch = () => {
  const t = useScopedI18n("backoffice.closeOpportunities");
  const [params, setParams] = useCloseOpportunitiesParams();
  const [localSearch, setLocalSearch] = useState(params.search);

  // Debounce search
  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({ ...params, search: "", page: "1" });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({ ...params, search: localSearch, page: "1" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams]);

  // Sync with URL changes
  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return (
    <Input
      className="max-w-sm"
      onChange={(e) => setLocalSearch(e.target.value)}
      placeholder={t("searchPlaceholder")}
      value={localSearch}
    />
  );
};

export const CloseOpportunitiesContent = () => {
  const t = useScopedI18n("backoffice.closeOpportunities");
  const opportunities = useSuspenseCloseOpportunities();

  return (
    <>
      {opportunities.data.items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-muted-foreground">{t("emptyMessage")}</p>
        </div>
      ) : (
        <CloseOpportunitiesTable opportunities={opportunities.data.items} />
      )}
    </>
  );
};

export const CloseOpportunitiesList = () => {
  const [params, setParams] = useCloseOpportunitiesParams();

  const handleTypeChange = (value: string) => {
    setParams({
      ...params,
      type: value as "all" | "mna" | "realEstate",
      page: "1",
    });
  };

  const handleStatusChange = (value: string) => {
    setParams({
      ...params,
      status: value as "all" | "ACTIVE" | "INACTIVE" | "CONCLUDED",
      page: "1",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <CloseOpportunitiesHeader
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        statusFilter={params.status}
        typeFilter={params.type}
      />

      <div className="flex items-center gap-4">
        <CloseOpportunitiesSearch />
      </div>

      <ErrorBoundary fallback={<CloseOpportunitiesError />}>
        <Suspense fallback={<CloseOpportunitiesLoading />}>
          <CloseOpportunitiesContent />
        </Suspense>
      </ErrorBoundary>
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
