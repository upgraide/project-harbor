"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { EntityContainer } from "@/components/entity-components";

type CloseOpportunitiesHeaderProps = {
  typeFilter: string;
  statusFilter: string;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export const CloseOpportunitiesHeader = ({
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
}: CloseOpportunitiesHeaderProps) => {
  const t = useScopedI18n("backoffice.closeOpportunities");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="mna">{t("filters.mna")}</SelectItem>
            <SelectItem value="realEstate">{t("filters.realEstate")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="ACTIVE">{t("status.ACTIVE")}</SelectItem>
            <SelectItem value="INACTIVE">{t("status.INACTIVE")}</SelectItem>
            <SelectItem value="CONCLUDED">{t("status.CONCLUDED")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export const useCloseOpportunitiesParams = () => {
  return useQueryStates({
    page: parseAsString.withDefault("1"),
    search: parseAsString.withDefault(""),
    type: parseAsStringEnum(["all", "mna", "realEstate"]).withDefault("all"),
    status: parseAsStringEnum(["all", "ACTIVE", "INACTIVE", "CONCLUDED"]).withDefault("all"),
  });
};

export const useSuspenseCloseOpportunities = () => {
  const trpc = useTRPC();
  const [params] = useCloseOpportunitiesParams();

  const queryParams = useMemo(
    () => ({
      page: Number.parseInt(params.page, 10),
      pageSize: 20,
      search: params.search,
      type: params.type as "all" | "mna" | "realEstate",
      status: params.status as "all" | "ACTIVE" | "INACTIVE" | "CONCLUDED",
    }),
    [params]
  );

  return useSuspenseQuery(trpc.opportunities.getAll.queryOptions(queryParams));
};
