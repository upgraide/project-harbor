"use client";

import { api } from "@/convex/_generated/api";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import { LoaderIcon } from "lucide-react";
import { RefObject } from "react";
import { InfiniteScrollTrigger } from "@/components/infinite-scroll-trigger";
import RealEstateOpportunityCard from "../components/real-estate-opportunity-card";

const RealEstateView = () => {
  const opportunities = usePaginatedQuery(
    api.realEstates.getMany,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.results.map((opportunity) => (
              <RealEstateOpportunityCard
                id={opportunity._id}
                name={opportunity.name}
                key={opportunity._id}
                description={opportunity.description ?? ""}
                image={
                  opportunity.imagesUrls?.[0] ??
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZjNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
                }
                createdAt={opportunity._creationTime}
              />
            ))}
          </div>
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

export default RealEstateView;
