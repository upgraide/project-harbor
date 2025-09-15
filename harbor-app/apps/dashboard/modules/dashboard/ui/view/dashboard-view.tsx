"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";

const DashboardView = () => {
  const opportunities = usePaginatedQuery(
    api.public.opportunities.getManyMergersAndAcquisition,
    {},
    {
      initialNumItems: 10,
    },
  );
  return (
    <div className="relative mx-auto flex w-full  flex-col items-center p-6">
      <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
        {opportunities.results.map((opportunity) => (
          <div className="flex flex-col gap-2" key={opportunity._id}>
            <div className="text-sm font-medium">{opportunity._id}</div>
            <div className="text-sm text-muted-foreground">
              {opportunity.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
