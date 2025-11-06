import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subMonths,
} from "date-fns";
import { z } from "zod";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const MAX_TOP_VIEWED_LIMIT = 50;
const MONTHS_IN_YEAR = 12;
const MONTHS_BACK_FOR_ANALYTICS = MONTHS_IN_YEAR - 1; // Last 12 months

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

  /**
   * Get backoffice KPIs for analytics overview
   */
  getBackofficeKPIs: protectedProcedure.query(async () => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const quarterStart = startOfQuarter(now);

    // Total Assets Under Management (AUM): Count of active opportunities
    const activeMnaCount = await prisma.mergerAndAcquisition.count({
      where: { status: "ACTIVE" },
    });
    const activeRealEstateCount = await prisma.realEstate.count({
      where: { status: "ACTIVE" },
    });
    const totalAUM = activeMnaCount + activeRealEstateCount;

    // Total Assets Transacted: Count of concluded opportunities
    const totalAssetsTransacted =
      (await prisma.mergerAndAcquisition.count({
        where: { status: "CONCLUDED" },
      })) +
      (await prisma.realEstate.count({
        where: { status: "CONCLUDED" },
      }));

    // Total Mandates Closed YTD: Count of concluded opportunities created this year
    const mandatesClosedYTD =
      (await prisma.mergerAndAcquisition.count({
        where: {
          status: "CONCLUDED",
          createdAt: { gte: yearStart },
        },
      })) +
      (await prisma.realEstate.count({
        where: {
          status: "CONCLUDED",
          createdAt: { gte: yearStart },
        },
      }));

    // Active Clients: Total count of users
    const activeClients = await prisma.user.count();

    // New Clients this quarter: Count of users created in current quarter
    const newClientsQuarter = await prisma.user.count({
      where: {
        createdAt: { gte: quarterStart },
      },
    });

    return {
      totalAUM,
      totalAssetsTransacted,
      mandatesClosedYTD,
      activeClients,
      newClientsQuarter,
    };
  }),

  /**
   * Get assets transacted growth over time (last 12 months)
   */
  getAssetsTransactedByMonth: protectedProcedure.query(async () => {
    const now = new Date();
    const twelveMonthsAgo = subMonths(now, MONTHS_BACK_FOR_ANALYTICS);
    const months = eachMonthOfInterval({
      start: startOfMonth(twelveMonthsAgo),
      end: endOfMonth(now),
    });

    const data = await Promise.all(
      months.map(async (month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);

        const concludedMna = await prisma.mergerAndAcquisition.count({
          where: {
            status: "CONCLUDED",
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        });

        const concludedRealEstate = await prisma.realEstate.count({
          where: {
            status: "CONCLUDED",
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        });

        return {
          month: format(month, "yyyy-MM"),
          count: concludedMna + concludedRealEstate,
        };
      })
    );

    return data;
  }),

  /**
   * Get AUM growth over time (last 12 months)
   * Shows monthly snapshot of active opportunities
   */
  getAumByMonth: protectedProcedure.query(async () => {
    const now = new Date();
    const twelveMonthsAgo = subMonths(now, MONTHS_BACK_FOR_ANALYTICS);
    const months = eachMonthOfInterval({
      start: startOfMonth(twelveMonthsAgo),
      end: endOfMonth(now),
    });

    const data = await Promise.all(
      months.map(async (month) => {
        const monthEndDate = endOfMonth(month);

        // Count opportunities that were active at the end of this month
        const activeMna = await prisma.mergerAndAcquisition.count({
          where: {
            status: "ACTIVE",
            createdAt: {
              lte: monthEndDate,
            },
          },
        });

        const activeRealEstate = await prisma.realEstate.count({
          where: {
            status: "ACTIVE",
            createdAt: {
              lte: monthEndDate,
            },
          },
        });

        return {
          month: format(month, "yyyy-MM"),
          count: activeMna + activeRealEstate,
        };
      })
    );

    return data;
  }),

  /**
   * Get deal pipeline funnel data
   */
  getPipelineFunnel: protectedProcedure.query(async () => {
    // Leads = ACTIVE opportunities
    const activeMna = await prisma.mergerAndAcquisition.count({
      where: { status: "ACTIVE" },
    });
    const activeRealEstate = await prisma.realEstate.count({
      where: { status: "ACTIVE" },
    });
    const leads = activeMna + activeRealEstate;

    // Due Diligence = opportunities with at least one NDA signed
    const mnaWithNDA = await prisma.mergerAndAcquisition.count({
      where: {
        status: "ACTIVE",
        userInterests: {
          some: {
            ndaSigned: true,
          },
        },
      },
    });
    const realEstateWithNDA = await prisma.realEstate.count({
      where: {
        status: "ACTIVE",
        userInterests: {
          some: {
            ndaSigned: true,
          },
        },
      },
    });
    const dueDiligence = mnaWithNDA + realEstateWithNDA;

    // Negotiation = opportunities with at least one interested user
    const mnaWithInterest = await prisma.mergerAndAcquisition.count({
      where: {
        status: "ACTIVE",
        userInterests: {
          some: {
            interested: true,
          },
        },
      },
    });
    const realEstateWithInterest = await prisma.realEstate.count({
      where: {
        status: "ACTIVE",
        userInterests: {
          some: {
            interested: true,
          },
        },
      },
    });
    const negotiation = mnaWithInterest + realEstateWithInterest;

    // Closed = CONCLUDED opportunities
    const concludedMna = await prisma.mergerAndAcquisition.count({
      where: { status: "CONCLUDED" },
    });
    const concludedRealEstate = await prisma.realEstate.count({
      where: { status: "CONCLUDED" },
    });
    const closed = concludedMna + concludedRealEstate;

    return {
      leads,
      dueDiligence,
      negotiation,
      closed,
    };
  }),

  /**
   * Get client segmentation by investor type
   */
  getClientSegmentation: protectedProcedure.query(async () => {
    const users = await prisma.user.findMany({
      where: {
        investorType: {
          not: null,
        },
      },
      select: {
        investorType: true,
      },
    });

    const counts = new Map<string, number>();
    for (const user of users) {
      if (user.investorType) {
        const current = counts.get(user.investorType) ?? 0;
        counts.set(user.investorType, current + 1);
      }
    }

    return Array.from(counts.entries()).map(([label, count]) => ({
      label,
      count,
    }));
  }),

  /**
   * Get sector breakdown by industry (M&A) and asset type (Real Estate)
   */
  getSectorBreakdown: protectedProcedure.query(async () => {
    // Get M&A opportunities grouped by industry
    const mnaByIndustry = await prisma.mergerAndAcquisition.groupBy({
      by: ["industry"],
      where: {
        industry: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
    });

    // Get Real Estate opportunities grouped by asset type
    const realEstateByAsset = await prisma.realEstate.groupBy({
      by: ["asset"],
      where: {
        asset: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
    });

    const sectorMap = new Map<string, number>();

    // Add M&A industries
    for (const item of mnaByIndustry) {
      if (item.industry) {
        sectorMap.set(item.industry, item._count.id);
      }
    }

    // Add Real Estate asset types with "RE: " prefix
    for (const item of realEstateByAsset) {
      if (item.asset) {
        const sector = `RE: ${item.asset}`;
        const current = sectorMap.get(sector) ?? 0;
        sectorMap.set(sector, current + item._count.id);
      }
    }

    return Array.from(sectorMap.entries()).map(([sector, count]) => ({
      sector,
      count,
    }));
  }),
});
