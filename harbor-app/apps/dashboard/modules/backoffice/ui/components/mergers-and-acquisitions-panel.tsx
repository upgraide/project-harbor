"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Doc } from "@harbor-app/backend/convex/_generated/dataModel";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@harbor-app/ui/components/avatar";
import { InfiniteScrollTrigger } from "@harbor-app/ui/components/infinite-scroll-trigger";
import { ScrollArea } from "@harbor-app/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@harbor-app/ui/components/select";
import { Skeleton } from "@harbor-app/ui/components/skeleton";
import { useInfiniteScroll } from "@harbor-app/ui/hooks/use-infinite-scroll";
import { cn } from "@harbor-app/ui/lib/utils";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { statusFilterAtom } from "../../atoms";

export const MergersAndAcquisitionsPanel = () => {
  const pathname = usePathname();

  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);

  const opportunities = usePaginatedQuery(
    api.private.mergersAndAcquisitionsOpportunities.getMany,
    {
      status: statusFilter === "all" ? undefined : statusFilter,
    },
    {
      initialNumItems: 10,
    },
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: opportunities.status,
    loadMore: opportunities.loadMore,
    loadSize: 10,
  });

  return (
    <div className="flex h-full flex-col w-full bg-background text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select
          defaultValue="all"
          onValueChange={(value) =>
            setStatusFilter(
              value as
                | Doc<"opportunitiesMergersAndAcquisitions">["status"]
                | "all",
            )
          }
          value={statusFilter}
        >
          <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="size-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="no-interest">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="size-4" />
                <span>No Interest</span>
              </div>
            </SelectItem>
            <SelectItem value="interested">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="size-4" />
                <span>Interested</span>
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <span>Completed</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoadingFirstPage ? (
        <SkeletonOpportunitiesPanel />
      ) : (
        <ScrollArea className="max-h-[calc(100vh-53px)]">
          <div className="flex w-full flex-1 flex-col text-sm">
            {opportunities.results.map((opportunity) => {
              return (
                <Link
                  className={cn(
                    "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                    pathname ===
                      `/backoffice/mergers-and-acquisitions/${opportunity._id}` &&
                      "bg-accent text-accent-foreground",
                  )}
                  href={`/backoffice/mergers-and-acquisitions/${opportunity._id}`}
                  key={opportunity._id}
                >
                  <div
                    className={cn(
                      "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                      pathname ===
                        `/backoffice/mergers-and-acquisitions/${opportunity._id}` &&
                        "opacity-100",
                    )}
                  />

                  <Avatar className="h-10 w-10 rounded-full">
                    <AvatarImage
                      alt={opportunity.createdBy?.email}
                      src={
                        opportunity.createdBy?.avatarURL ??
                        `https://avatar.vercel.sh/${opportunity.createdBy?.email}`
                      }
                    />
                    <AvatarFallback className="h-10 w-10 rounded-full">
                      {opportunity.createdBy?.name &&
                      opportunity.createdBy?.name.length > 0
                        ? opportunity.createdBy?.name.charAt(0).toUpperCase()
                        : opportunity.createdBy?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex w-full items-center gap-2">
                      <span className="truncate font-bold">
                        {opportunity.name}
                      </span>
                      <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                        {formatDistanceToNow(opportunity._creationTime)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex w-0 grow items-center gap-1">
                        <span className="line-clamp-1 text-muted-foreground text-xs">
                          {opportunity.description}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef as RefObject<HTMLDivElement>}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export const SkeletonOpportunitiesPanel = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: it's fine here
            <div className="flex items-start gap-3 rounded-lg p-4" key={index}>
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-3 w-12 shrink-0" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
