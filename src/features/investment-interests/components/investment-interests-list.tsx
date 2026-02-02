"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { EmptyView } from "@/components/entity-components";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useScopedI18n } from "@/locales/client";
import {
  backofficeMergeAndAcquisitionOpportunityPath,
  backofficeRealEstateOpportunityPath,
} from "@/paths";
import { useSuspenseInvestmentInterests } from "../hooks/use-investment-interests";
import { useInvestmentInterestsParams } from "../hooks/use-investment-interests-params";
import { useToggleProcessed } from "../hooks/use-toggle-processed";
import { InvestmentInterestsSearch } from "./investment-interests-search";

export const InvestmentInterestsList = () => {
  const interests = useSuspenseInvestmentInterests();
  const t = useScopedI18n("backoffice.investment-interests");
  const [params, setParams] = useInvestmentInterestsParams();
  const toggleProcessed = useToggleProcessed();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Flatten all pages into a single array
  const allItems = interests.data.pages.flatMap((page) => page.items);

  type InterestItem = (typeof allItems)[number];

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  const handleToggleProcessed = useCallback(
    (interest: InterestItem) => {
      toggleProcessed.mutate({
        id: interest.id,
        type: interest.type,
        processed: !interest.processed,
      });
    },
    [toggleProcessed]
  );

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first?.isIntersecting &&
          interests.hasNextPage &&
          !interests.isFetchingNextPage
        ) {
          interests.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [interests.hasNextPage, interests.isFetchingNextPage, interests.fetchNextPage]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex gap-4">
          <Select
            onValueChange={(value) => {
              setParams({
                type: value as "all" | "m&a" | "real-estate",
              });
            }}
            value={params.type ?? "all"}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder={t("filters.type.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.type.all")}</SelectItem>
              <SelectItem value="m&a">{t("filters.type.m&a")}</SelectItem>
              <SelectItem value="real-estate">
                {t("filters.type.real-estate")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              setParams({
                status: value as "all" | "pending" | "processed",
              });
            }}
            value={params.status ?? "all"}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder={t("filters.status.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.status.all")}</SelectItem>
              <SelectItem value="pending">
                {t("filters.status.pending")}
              </SelectItem>
              <SelectItem value="processed">
                {t("filters.status.processed")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <InvestmentInterestsSearch />
      </div>

      {allItems.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <EmptyView message={t("emptyMessage")} title={t("emptyTitle")} />
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="max-h-[calc(100vh-280px)] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>{t("table.clientName")}</TableHead>
                  <TableHead>{t("table.project")}</TableHead>
                  <TableHead>{t("table.interestType")}</TableHead>
                  <TableHead>{t("table.interestStatus")}</TableHead>
                  <TableHead>{t("table.date")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allItems.map((interest: InterestItem) => (
                  <TableRow key={interest.uniqueId}>
                    <TableCell className="font-medium">
                      {interest.userName}
                    </TableCell>
                    <TableCell>{interest.projectName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
                        {interest.type === "m&a"
                          ? t("interestType.m&a")
                          : t("interestType.real-estate")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {interest.interested ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {t("interestStatus.interested")}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          {t("interestStatus.notInterested")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(interest.date)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
                          interest.processed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {interest.processed
                          ? t("status.processed")
                          : t("status.pending")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Link
                          className="text-primary text-sm hover:underline"
                          href={
                            interest.type === "m&a"
                              ? backofficeMergeAndAcquisitionOpportunityPath(
                                  interest.projectId
                                )
                              : backofficeRealEstateOpportunityPath(
                                  interest.projectId
                                )
                          }
                        >
                          {t("actions.viewDetails")}
                        </Link>
                        <button
                          className="text-left text-primary text-sm hover:underline disabled:opacity-50"
                          type="button"
                          onClick={() => handleToggleProcessed(interest)}
                          disabled={toggleProcessed.isPending}
                        >
                          {interest.processed
                            ? t("actions.markAsUnprocessed")
                            : t("actions.markAsProcessed")}
                        </button>
                        <span className="text-muted-foreground text-sm">
                          {t("actions.sendDocuments")}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Load more trigger */}
            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {interests.isFetchingNextPage && (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              )}
              {!interests.hasNextPage && allItems.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {t("noMoreItems")}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
