import { z } from "zod";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const MAX_TOP_VIEWED_LIMIT = 50;

export const analyticsRouter = createTRPCRouter({
  /**
   * Get analytics for a Merger & Acquisition opportunity
   */
  getMnaAnalytics: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ input }) => {
      const analytics = await prisma.opportunityAnalytics.findFirst({
        where: { mergerAndAcquisitionId: input.opportunityId },
      });

      return analytics ?? { views: 0 };
    }),

  /**
   * Get analytics for a Real Estate opportunity
   */
  getRealEstateAnalytics: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ input }) => {
      const analytics = await prisma.opportunityAnalytics.findFirst({
        where: { realEstateId: input.opportunityId },
      });

      return analytics ?? { views: 0 };
    }),

  /**
   * Increment view count for a Merger & Acquisition opportunity
   */
  incrementMnaViews: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .mutation(async ({ input }) => {
      const analytics = await prisma.opportunityAnalytics.findFirst({
        where: { mergerAndAcquisitionId: input.opportunityId },
      });

      if (!analytics) {
        // Create analytics if it doesn't exist (for legacy opportunities)
        return await prisma.opportunityAnalytics.create({
          data: {
            mergerAndAcquisitionId: input.opportunityId,
            views: 1,
          },
        });
      }

      return await prisma.opportunityAnalytics.update({
        where: { id: analytics.id },
        data: { views: { increment: 1 } },
      });
    }),

  /**
   * Increment view count for a Real Estate opportunity
   */
  incrementRealEstateViews: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .mutation(async ({ input }) => {
      const analytics = await prisma.opportunityAnalytics.findFirst({
        where: { realEstateId: input.opportunityId },
      });

      if (!analytics) {
        // Create analytics if it doesn't exist (for legacy opportunities)
        return await prisma.opportunityAnalytics.create({
          data: {
            realEstateId: input.opportunityId,
            views: 1,
          },
        });
      }

      return await prisma.opportunityAnalytics.update({
        where: { id: analytics.id },
        data: { views: { increment: 1 } },
      });
    }),

  /**
   * Get aggregated analytics across all opportunities
   */
  getAggregatedAnalytics: protectedProcedure.query(async () => {
    const analytics = await prisma.opportunityAnalytics.findMany({
      select: {
        views: true,
        mergerAndAcquisitionId: true,
        realEstateId: true,
      },
    });

    const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
    const mnaCount = analytics.filter((a) => a.mergerAndAcquisitionId).length;
    const realEstateCount = analytics.filter((a) => a.realEstateId).length;

    return {
      totalViews,
      totalOpportunities: analytics.length,
      mnaOpportunities: mnaCount,
      realEstateOpportunities: realEstateCount,
      averageViews: analytics.length > 0 ? totalViews / analytics.length : 0,
    };
  }),

  /**
   * Get top viewed opportunities
   */
  getTopViewed: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(MAX_TOP_VIEWED_LIMIT).default(10),
        type: z.enum(["all", "mna", "realEstate"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      let where = {};

      if (input.type === "mna") {
        where = { mergerAndAcquisitionId: { not: null } };
      } else if (input.type === "realEstate") {
        where = { realEstateId: { not: null } };
      }

      const analytics = await prisma.opportunityAnalytics.findMany({
        where,
        orderBy: { views: "desc" },
        take: input.limit,
        include: {
          mergerAndAcquisition: {
            select: {
              id: true,
              name: true,
              images: true,
              updatedAt: true,
            },
          },
          realEstate: {
            select: {
              id: true,
              name: true,
              images: true,
              updatedAt: true,
            },
          },
        },
      });

      return analytics.map((a) => ({
        views: a.views,
        opportunity: a.mergerAndAcquisition ?? a.realEstate,
        type: a.mergerAndAcquisitionId
          ? ("mna" as const)
          : ("realEstate" as const),
      }));
    }),
});
