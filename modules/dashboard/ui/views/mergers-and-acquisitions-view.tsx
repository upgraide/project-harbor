"use client";

import { api } from "@/convex/_generated/api";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import MergerAndAcquisitionsOpportunityCard from "../components/merger-and-acquisitions-opportunity-card";
import { LoaderIcon } from "lucide-react";
import { RefObject } from "react";
import { InfiniteScrollTrigger } from "@/components/infinite-scroll-trigger";

const MergersAndAcquisitionsView = () => {
  const opportunities = usePaginatedQuery(
    api.mergersAndAcquisitions.getMany,
    {},
    {
      initialNumItems: 6,
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
    <div>
      {isLoadingFirstPage ? (
        <div className="flex items-center justify-center h-full w-full">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {opportunities.results.map((opportunity) => (
            <MergerAndAcquisitionsOpportunityCard
              id={opportunity._id}
              name={opportunity.name}
              key={opportunity._id}
              description={opportunity.description ?? ""}
              image={opportunity.images ? "" : (opportunity.images?.[0] ?? "")}
              createdAt={opportunity._creationTime}
            />
          ))}
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef as RefObject<HTMLDivElement>}
          />
        </div>
      )}
    </div>
  );
};

export default MergersAndAcquisitionsView;
