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
import { LeadsFilters, type LeadFilters } from "./leads-filters";
import { LeadsTable } from "./leads-table";

export const LeadsListContainer = () => {
  const t = useScopedI18n("crm.leads");
  const trpc = useTRPC();

  // State
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"lastContactDate" | "createdAt" | "name" | "minTicketSize" | "maxTicketSize">("lastContactDate");
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
    trpc.crm.leads.getMany.queryOptions(queryParams as any)
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
        <div className="flex-1 max-w-md">
          <Label htmlFor="search" className="sr-only">
            {t("searchPlaceholder")}
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Sort and Filters */}
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sortBy" className="text-sm whitespace-nowrap">
              {t("sorting.title")}:
            </Label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger id="sortBy" className="w-[180px]">
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
              variant="outline"
              size="icon"
              onClick={() =>
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
              }
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
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">{t("errorMessage")}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && data && (
        <>
          <LeadsTable leads={data.items} />

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages} ({data.totalCount} total
                leads)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.hasPreviousPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.hasNextPage}
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
