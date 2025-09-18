"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import { Button } from "@harbor-app/ui/components/button";
import { Card, CardContent } from "@harbor-app/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@harbor-app/ui/components/tabs";
import { usePaginatedQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const DashboardView = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("m&a");

  const opportunities = usePaginatedQuery(
    api.private.mergersAndAcquisitionsOpportunities.getMany,
    {},
    {
      initialNumItems: 12,
    },
  );

  const handleViewOpportunity = (opportunityId: string) => {
    router.push(`/opportunities/${opportunityId}`);
  };

  return (
    <div className="relative mx-auto w-full p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2  mx-auto mb-8">
          <TabsTrigger value="m&a">M&A Projects</TabsTrigger>
          <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
        </TabsList>

        <TabsContent value="m&a" className="space-y-6">
          {opportunities.results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {opportunities.results.map((opportunity) => (
                  <Card
                    key={opportunity._id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-border"
                  >
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                          <div className="text-muted-foreground text-sm">No Image</div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-4">
                        <h3 className="font-semibold text-foreground text-lg line-clamp-2">
                          {opportunity.name}
                        </h3>

                        <Button
                          className="w-full"
                          onClick={() => handleViewOpportunity(opportunity._id)}
                        >
                          See Opportunity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load more button */}
              {opportunities.status === "CanLoadMore" && (
                <div className="flex justify-center mt-8">
                  <Button
                    disabled={opportunities.isLoading}
                    onClick={() => opportunities.loadMore(12)}
                    variant="outline"
                  >
                    {opportunities.isLoading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground text-lg mb-2">
                No M&A Projects Available
              </div>
              <p className="text-muted-foreground text-sm">
                Check back later for new investment opportunities.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="real-estate" className="space-y-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground text-lg mb-2">
              Real Estate Projects
            </div>
            <p className="text-muted-foreground text-sm">
              Coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardView;
