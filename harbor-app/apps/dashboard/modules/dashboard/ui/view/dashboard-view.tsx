"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";

const DashboardView = () => {
  // TODO: Implement dashboard view, becarefull with the query, it's not the same as the other views
  // I need to get only the pre-NDA information
  const opportunities = usePaginatedQuery(
    api.private.mergersAndAcquisitionsOpportunities.getMany,
    {},
    {
      initialNumItems: 10,
    },
  );

  return (
    <div className="relative mx-auto w-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {opportunities.results.map((opportunity) => (
          <div
            className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            key={opportunity._id}
          >
            {/* Image placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                {opportunity.name}
              </h3>

              <div className="space-y-1 mb-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{opportunity.industry}</span>
                  {opportunity.subIndustry && (
                    <span className="text-gray-500">
                      {" "}
                      • {opportunity.subIndustry}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{opportunity.type}</span>
                  <span className="text-gray-500">
                    {" "}
                    • {opportunity.typeDetails}
                  </span>
                </div>
              </div>

              {opportunity.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {opportunity.description}
                </p>
              )}

              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span>Sales: €{opportunity.sales}M</span>
                <span>EBITDA: €{opportunity.ebitda}M</span>
              </div>

              <button
                className="w-full py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                type="button"
              >
                View Investment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      {opportunities.status === "CanLoadMore" && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={opportunities.isLoading}
            onClick={() => opportunities.loadMore(10)}
            type="button"
          >
            {opportunities.isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
