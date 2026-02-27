"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { type LeadFilters, LeadsFilters } from "./leads-filters";
import { LeadsTable } from "./leads-table";

export const LeadsListContainer = () => {
  const t = useScopedI18n("crm.leads");
  const trpc = useTRPC();

  // State
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "lastContactDate" | "createdAt" | "name" | "minTicketSize" | "maxTicketSize"
  >("lastContactDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeadFilters>({});

  // Query params
  const queryParams = useMemo(
    () => ({
      page,
      pageSize: 20,
      search: search || undefined,
      sortBy,
      sortDirection,
      ...filters,
      lastContactDateFrom: filters.lastContactDateFrom
        ? new Date(filters.lastContactDateFrom)
        : undefined,
      lastContactDateTo: filters.lastContactDateTo
        ? new Date(filters.lastContactDateTo)
        : undefined,
    }),
    [page, search, sortBy, sortDirection, filters]
  );

  // Fetch data
  const { data, isLoading, error } = useQuery(
    trpc.crm.leads.getLeads.queryOptions(queryParams as any)
  );

  const { data: teamMembers } = useQuery(
    trpc.crm.leads.getTeamMembers.queryOptions()
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleFiltersChange = (newFilters: LeadFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as typeof sortBy);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* Search */}
        <div className="max-w-md flex-1">
          <Label className="sr-only" htmlFor="search">
            {t("searchPlaceholder")}
          </Label>
          <div className="relative">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              id="search"
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              type="search"
              value={search}
            />
          </div>
        </div>

        {/* Sort and Filters */}
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap text-sm" htmlFor="sortBy">
              {t("sorting.title")}:
            </Label>
            <Select onValueChange={handleSortChange} value={sortBy}>
              <SelectTrigger className="w-[180px]" id="sortBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastContactDate">
                  {t("sorting.lastContactDate")}
                </SelectItem>
                <SelectItem value="createdAt">
                  {t("sorting.createdAt")}
                </SelectItem>
                <SelectItem value="name">{t("sorting.name")}</SelectItem>
                <SelectItem value="minTicketSize">
                  {t("sorting.minTicketSize")}
                </SelectItem>
                <SelectItem value="maxTicketSize">
                  {t("sorting.maxTicketSize")}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() =>
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              size="icon"
              variant="outline"
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </Button>
          </div>

          {/* Filters */}
          <LeadsFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            teamMembers={teamMembers}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex h-64 items-center justify-center">
          <p className="text-destructive">{t("errorMessage")}</p>
        </div>
      )}

      {/* Table */}
      {!(isLoading || error) && data && (
        <>
          <LeadsTable leads={data.items} />

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Page {data.page} of {data.totalPages} ({data.totalCount} total
                leads)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  disabled={!data.hasPreviousPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  size="sm"
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  disabled={!data.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  size="sm"
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
