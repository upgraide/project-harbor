import {
  eachMonthOfInterval,
  endOfMonth,
  endOfQuarter,
  endOfYear,
  format,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subMonths,
  subDays,
} from "date-fns";
import { z } from "zod";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const MAX_TOP_VIEWED_LIMIT = 50;
const MONTHS_IN_YEAR = 12;
const MONTHS_BACK_FOR_ANALYTICS = MONTHS_IN_YEAR - 1; // Last 12 months

// Filter schemas
const analyticsFiltersSchema = z.object({
  year: z.string().default("2026"), // "2025", "2026", "allTime"
  period: z.enum(["q1", "q2", "q3", "q4", "full", "last7days", "last30days"]).default("q1"),
  opportunityType: z.enum(["all", "mna", "realEstate"]).default("all"),
});

// Helper function to get date ranges based on year and period
const getDateRange = (year: string, period: string): { start: Date; end: Date } => {
  const now = new Date();
  
  // Handle special periods
  if (period === "last7days") {
    return { start: subDays(now, 7), end: now };
  }
  if (period === "last30days") {
    return { start: subDays(now, 30), end: now };
  }
  if (year === "allTime") {
    return { start: new Date("2020-01-01"), end: now };
  }
  
  const yearNum = parseInt(year);
  
  // Handle full year
  if (period === "full") {
    return { 
      start: new Date(`${yearNum}-01-01`), 
      end: new Date(`${yearNum}-12-31`) 
    };
  }
  
  // Handle quarters
  switch (period) {
    case "q1":
      return { 
        start: new Date(`${yearNum}-01-01`), 
        end: new Date(`${yearNum}-03-31`) 
      };
    case "q2":
      return { 
        start: new Date(`${yearNum}-04-01`), 
        end: new Date(`${yearNum}-06-30`) 
      };
    case "q3":
      return { 
        start: new Date(`${yearNum}-07-01`), 
        end: new Date(`${yearNum}-09-30`) 
      };
    case "q4":
      return { 
        start: new Date(`${yearNum}-10-01`), 
        end: new Date(`${yearNum}-12-31`) 
      };
    default:
      return { start: startOfQuarter(now), end: endOfQuarter(now) };
  }
};

// Helper to get previous period for trend calculation
const getPreviousPeriodRange = (year: string, period: string): { start: Date; end: Date } => {
  const now = new Date();
  
  // Handle special periods
  if (period === "last7days") {
    return { start: subDays(now, 14), end: subDays(now, 7) };
  }
  if (period === "last30days") {
    return { start: subDays(now, 60), end: subDays(now, 30) };
  }
  if (year === "allTime") {
    return { start: new Date("2020-01-01"), end: new Date("2020-01-01") }; // No trend for all time
  }
  
  const yearNum = parseInt(year);
  
  // Handle full year
  if (period === "full") {
    return { 
      start: new Date(`${yearNum - 1}-01-01`), 
      end: new Date(`${yearNum - 1}-12-31`) 
    };
  }
  
  // Handle quarters - previous quarter
  switch (period) {
    case "q1":
      return { 
        start: new Date(`${yearNum - 1}-10-01`), 
        end: new Date(`${yearNum - 1}-12-31`) 
      };
    case "q2":
      return { 
        start: new Date(`${yearNum}-01-01`), 
        end: new Date(`${yearNum}-03-31`) 
      };
    case "q3":
      return { 
        start: new Date(`${yearNum}-04-01`), 
        end: new Date(`${yearNum}-06-30`) 
      };
    case "q4":
      return { 
        start: new Date(`${yearNum}-07-01`), 
        end: new Date(`${yearNum}-09-30`) 
      };
    default:
      const quarterStart = startOfQuarter(now);
      return { start: subMonths(quarterStart, 3), end: subDays(quarterStart, 1) };
  }
};

export const analyticsRouter = createTRPCRouter({
  /**
   * Get available years from actual data
   */
  getAvailableYears: protectedProcedure.query(async () => {
    // Get earliest M&A
    const earliestMna = await prisma.mergerAndAcquisition.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    // Get earliest Real Estate
    const earliestRealEstate = await prisma.realEstate.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    const earliestDate = [earliestMna?.createdAt, earliestRealEstate?.createdAt]
      .filter(Boolean)
      .sort((a, b) => (a as Date).getTime() - (b as Date).getTime())[0];

    const startYear = earliestDate ? new Date(earliestDate).getFullYear() : 2025;
    const currentYear = new Date().getFullYear();

    const years: string[] = ['allTime'];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }

    return years;
  }),

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
  getAssetsTransactedByMonth: protectedProcedure
    .input(analyticsFiltersSchema)
    .query(async ({ input }) => {
      const { year, period, opportunityType } = input;
      const dateRange = getDateRange(year, period);
      
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

          // Only count if month is within the selected date range
          if (monthEnd < dateRange.start || monthStart > dateRange.end) {
            return {
              month: format(month, "yyyy-MM"),
              count: 0,
            };
          }

          const whereClause = {
            status: "CONCLUDED" as const,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          };

          const concludedMna = opportunityType === "realEstate" 
            ? 0 
            : await prisma.mergerAndAcquisition.count({ where: whereClause });

          const concludedRealEstate = opportunityType === "mna" 
            ? 0 
            : await prisma.realEstate.count({ where: whereClause });

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
  getAumByMonth: protectedProcedure
    .input(analyticsFiltersSchema)
    .query(async ({ input }) => {
      const { year, period, opportunityType } = input;
      const dateRange = getDateRange(year, period);
      
      const now = new Date();
      const twelveMonthsAgo = subMonths(now, MONTHS_BACK_FOR_ANALYTICS);
      const months = eachMonthOfInterval({
        start: startOfMonth(twelveMonthsAgo),
        end: endOfMonth(now),
      });

      const data = await Promise.all(
        months.map(async (month) => {
          const monthEndDate = endOfMonth(month);

          // Only count if month is within the selected date range
          if (monthEndDate < dateRange.start || startOfMonth(month) > dateRange.end) {
            return {
              month: format(month, "yyyy-MM"),
              count: 0,
            };
          }

          // Count opportunities that were active at the end of this month
          const whereClause = {
            status: "ACTIVE" as const,
            createdAt: {
              lte: monthEndDate,
            },
          };

          const activeMna = opportunityType === "realEstate" 
            ? 0 
            : await prisma.mergerAndAcquisition.count({ where: whereClause });

          const activeRealEstate = opportunityType === "mna" 
            ? 0 
            : await prisma.realEstate.count({ where: whereClause });

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
  getPipelineFunnel: protectedProcedure
    .input(analyticsFiltersSchema)
    .query(async ({ input }) => {
      const { year, period, opportunityType } = input;
      const dateRange = getDateRange(year, period);
      
      const dateFilter = {
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      };

      // Leads = ACTIVE opportunities
      const activeMna = opportunityType === "realEstate" 
        ? 0 
        : await prisma.mergerAndAcquisition.count({
            where: { status: "ACTIVE", ...dateFilter },
          });
      const activeRealEstate = opportunityType === "mna" 
        ? 0 
        : await prisma.realEstate.count({
            where: { status: "ACTIVE", ...dateFilter },
          });
      const leads = activeMna + activeRealEstate;

      // Due Diligence = opportunities with at least one NDA signed
      const mnaWithNDA = opportunityType === "realEstate" 
        ? 0 
        : await prisma.mergerAndAcquisition.count({
            where: {
              status: "ACTIVE",
              ...dateFilter,
              userInterests: {
                some: {
                  ndaSigned: true,
                },
              },
            },
          });
      const realEstateWithNDA = opportunityType === "mna" 
        ? 0 
        : await prisma.realEstate.count({
            where: {
              status: "ACTIVE",
              ...dateFilter,
              userInterests: {
                some: {
                  ndaSigned: true,
                },
              },
            },
          });
      const dueDiligence = mnaWithNDA + realEstateWithNDA;

      // Negotiation = opportunities with at least one interested user
      const mnaWithInterest = opportunityType === "realEstate" 
        ? 0 
        : await prisma.mergerAndAcquisition.count({
            where: {
              status: "ACTIVE",
              ...dateFilter,
              userInterests: {
                some: {
                  interested: true,
                },
              },
            },
          });
      const realEstateWithInterest = opportunityType === "mna" 
        ? 0 
        : await prisma.realEstate.count({
            where: {
              status: "ACTIVE",
              ...dateFilter,
              userInterests: {
                some: {
                  interested: true,
                },
              },
            },
          });
      const negotiation = mnaWithInterest + realEstateWithInterest;

      // Closed = CONCLUDED opportunities
      const concludedMna = opportunityType === "realEstate" 
        ? 0 
        : await prisma.mergerAndAcquisition.count({
            where: { status: "CONCLUDED", ...dateFilter },
          });
      const concludedRealEstate = opportunityType === "mna" 
        ? 0 
        : await prisma.realEstate.count({
            where: { status: "CONCLUDED", ...dateFilter },
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
  getClientSegmentation: protectedProcedure
    .input(analyticsFiltersSchema)
    .query(async ({ input }) => {
      // Get all users grouped by investorType (investment range)
      const clients = await prisma.user.groupBy({
        by: ["investorType"],
        where: {
          role: "USER",
          investorType: {
            not: null,
          },
        },
        _count: {
          id: true,
        },
      });

      return clients.map((item) => ({
        label: item.investorType ?? "Unknown",
        count: item._count.id,
      }));
    }),

  /**
   * Get sector breakdown by industry (M&A) and asset type (Real Estate)
   */
  getSectorBreakdown: protectedProcedure
    .input(analyticsFiltersSchema)
    .query(async ({ input }) => {
      const { year, period, opportunityType } = input;
      const dateRange = getDateRange(year, period);
      
      const dateFilter = {
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      };

      const sectorMap = new Map<string, number>();

      // Get M&A opportunities grouped by industry (if not filtering to Real Estate only)
      if (opportunityType !== "realEstate") {
        const mnaByIndustry = await prisma.mergerAndAcquisition.groupBy({
          by: ["industry"],
          where: {
            industry: {
              not: null,
            },
            ...dateFilter,
          },
          _count: {
            id: true,
          },
        });

        // Add M&A industries
        for (const item of mnaByIndustry) {
          if (item.industry) {
            sectorMap.set(item.industry, item._count.id);
          }
        }
      }

      // Get Real Estate opportunities grouped by asset type (if not filtering to M&A only)
      if (opportunityType !== "mna") {
        const realEstateByAsset = await prisma.realEstate.groupBy({
          by: ["asset"],
          where: {
            asset: {
              not: null,
            },
            ...dateFilter,
          },
          _count: {
            id: true,
          },
        });

        // Add Real Estate asset types with "RE: " prefix
        for (const item of realEstateByAsset) {
          if (item.asset) {
            const sector = `RE: ${item.asset}`;
            const current = sectorMap.get(sector) ?? 0;
            sectorMap.set(sector, current + item._count.id);
          }
        }
      }

      return Array.from(sectorMap.entries()).map(([sector, count]) => ({
        sector,
        count,
      }));
    }),

  /**
   * Get pipeline value (total estimated value of deals in progress)
   */
  getPipelineValue: protectedProcedure.query(async () => {
    // Count active opportunities as proxy for pipeline value
    const activeMna = await prisma.mergerAndAcquisition.count({
      where: { status: "ACTIVE" },
    });
    const activeRealEstate = await prisma.realEstate.count({
      where: { status: "ACTIVE" },
    });

    return {
      pipelineDeals: activeMna + activeRealEstate,
      pipelineValue: 0, // Placeholder - will need actual valuation fields from schema
    };
  }),

  /**
   * Get average deal size (average value of concluded deals)
   */
  getAverageDealSize: protectedProcedure.query(async () => {
    const concludedDealsCount =
      (await prisma.mergerAndAcquisition.count({
        where: { status: "CONCLUDED" },
      })) +
      (await prisma.realEstate.count({
        where: { status: "CONCLUDED" },
      }));

    // Placeholder - will need actual deal values from schema
    const averageDealSize = concludedDealsCount > 0 ? 0 : 0;

    return {
      averageDealSize,
      totalDeals: concludedDealsCount,
    };
  }),

  /**
   * Get extended KPIs with quarter-over-quarter trends
   */
  getBackofficeKPIsWithTrends: protectedProcedure
    .input(analyticsFiltersSchema)
    .query(async ({ input }) => {
      const now = new Date();
      
      // Get date ranges using helper functions with separate year and period
      const currentPeriod = getDateRange(input.year, input.period);
      const prevPeriod = getPreviousPeriodRange(input.year, input.period);
      
      const yearStart = startOfYear(now);

      // Check if the period is in the future
      const isFuture = currentPeriod.start > now;
      
      if (isFuture) {
        // Return null/zero values for future periods
        return {
          totalAUM: 0,
          totalAUMTrend: 0,
          totalAssetsTransacted: 0,
          totalAssetsTransactedTrend: 0,
          mandatesClosedYTD: 0,
          mandatesClosedYTDTrend: 0,
          activeClients: 0,
          activeClientsTrend: 0,
          newClientsQuarter: 0,
          newClientsQuarterTrend: 0,
          pipelineValue: 0,
          pipelineValueTrend: 0,
          averageDealSize: 0,
          averageDealSizeTrend: 0,
          isFuture: true,
        };
      }

      // For historical data, query based on createdAt within the period
      const currentActiveMna = await prisma.mergerAndAcquisition.count({
        where: { 
          createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
          status: "ACTIVE",
          ...(input.opportunityType !== "all" && input.opportunityType !== "realEstate" ? {} : {})
        },
      });
      const currentActiveRealEstate = await prisma.realEstate.count({
        where: { 
          createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
          status: "ACTIVE",
          ...(input.opportunityType !== "all" && input.opportunityType !== "mna" ? {} : {})
        },
      });
      
      const totalAUM = 
        (input.opportunityType === "all" || input.opportunityType === "mna" ? currentActiveMna : 0) +
        (input.opportunityType === "all" || input.opportunityType === "realEstate" ? currentActiveRealEstate : 0);

      const currentAssetsTransacted =
        (input.opportunityType === "all" || input.opportunityType === "mna" 
          ? await prisma.mergerAndAcquisition.count({
              where: { 
                status: "CONCLUDED",
                createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
              },
            })
          : 0) +
        (input.opportunityType === "all" || input.opportunityType === "realEstate"
          ? await prisma.realEstate.count({
              where: { 
                status: "CONCLUDED",
                createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
              },
            })
          : 0);

      const totalAssetsTransacted = currentAssetsTransacted;

      const mandatesClosedYTD =
        (input.opportunityType === "all" || input.opportunityType === "mna"
          ? await prisma.mergerAndAcquisition.count({
              where: {
                status: "CONCLUDED",
                createdAt: { gte: yearStart },
              },
            })
          : 0) +
        (input.opportunityType === "all" || input.opportunityType === "realEstate"
          ? await prisma.realEstate.count({
              where: {
                status: "CONCLUDED",
                createdAt: { gte: yearStart },
              },
            })
          : 0);

      const activeClients = await prisma.user.count();

      const newClientsQuarter = await prisma.user.count({
        where: {
          createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
        },
      });

      // Calculate pipeline value (sum of estimated values for ACTIVE opportunities)
      // For M&A: use entrepriseValue (estimated value)
      // For Real Estate: use totalInvestment or value (estimated value)
      const mnaPipelineOpportunities = input.opportunityType === "realEstate" ? [] : await prisma.mergerAndAcquisition.findMany({
        where: {
          status: "ACTIVE",
          createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
        },
        select: {
          entrepriseValue: true,
          equityValue: true,
        },
      });

      const rePipelineOpportunities = input.opportunityType === "mna" ? [] : await prisma.realEstate.findMany({
        where: {
          status: "ACTIVE",
          createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
        },
        select: {
          totalInvestment: true,
          value: true,
          price: true,
        },
      });

      // Sum up M&A pipeline value (prefer entrepriseValue, fallback to equityValue)
      const mnaPipelineValue = mnaPipelineOpportunities.reduce(
        (sum, opp) => sum + (opp.entrepriseValue || opp.equityValue || 0),
        0
      );

      // Sum up Real Estate pipeline value (prefer totalInvestment, fallback to value or price)
      const rePipelineValue = rePipelineOpportunities.reduce(
        (sum, opp) => sum + (opp.totalInvestment || opp.value || opp.price || 0),
        0
      );

      const pipelineValue = mnaPipelineValue + rePipelineValue;

      // Calculate average deal size from concluded deals with final_amount
      const concludedDealsValue = await prisma.opportunityAnalytics.aggregate({
        where: {
          final_amount: { not: null },
          OR: [
            input.opportunityType === "realEstate" ? {} : {
              mergerAndAcquisition: {
                status: "CONCLUDED",
                createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
              },
            },
            input.opportunityType === "mna" ? {} : {
              realEstate: {
                status: "CONCLUDED",
                createdAt: { gte: currentPeriod.start, lte: currentPeriod.end },
              },
            },
          ],
        },
        _sum: { final_amount: true },
        _count: { id: true },
      });

      const averageDealSize = concludedDealsValue._count.id > 0 
        ? (concludedDealsValue._sum.final_amount || 0) / concludedDealsValue._count.id
        : 0;

      // Previous period KPIs for trend calculation
      const prevAssetsTransacted =
        (input.opportunityType === "all" || input.opportunityType === "mna"
          ? await prisma.mergerAndAcquisition.count({
              where: {
                status: "CONCLUDED",
                createdAt: {
                  gte: prevPeriod.start,
                  lte: prevPeriod.end,
                },
              },
            })
          : 0) +
        (input.opportunityType === "all" || input.opportunityType === "realEstate"
          ? await prisma.realEstate.count({
              where: {
                status: "CONCLUDED",
                createdAt: {
                  gte: prevPeriod.start,
                  lte: prevPeriod.end,
                },
              },
            })
          : 0);

      // Calculate trends (percentage change)
      const assetsTransactedTrend =
        prevAssetsTransacted > 0
          ? ((currentAssetsTransacted - prevAssetsTransacted) /
              prevAssetsTransacted) *
            100
          : 0;

      return {
        totalAUM,
        totalAUMTrend: 0,
        totalAssetsTransacted,
        totalAssetsTransactedTrend: assetsTransactedTrend,
        mandatesClosedYTD,
        mandatesClosedYTDTrend: 0,
        activeClients,
        activeClientsTrend: 0,
        newClientsQuarter,
        newClientsQuarterTrend: 0,
        pipelineValue,
        pipelineValueTrend: 0,
        averageDealSize,
        averageDealSizeTrend: 0,
      };
    }),

  /**
   * Get client activity (no contact for >30 days)
   */
  getClientActivity: protectedProcedure.query(async () => {
    const thirtyDaysAgo = subDays(new Date(), 30);

    const noRecentContact = await prisma.user.findMany({
      where: {
        OR: [
          { lastContactDate: { lt: thirtyDaysAgo } },
          { lastContactDate: null },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastContactDate: true,
        type: true,
      },
      orderBy: {
        lastContactDate: "asc",
      },
    });

    const recentContact = await prisma.user.count({
      where: {
        lastContactDate: { gte: thirtyDaysAgo },
      },
    });

    return {
      noRecentContact: noRecentContact.length,
      recentContact,
      detailedList: noRecentContact,
    };
  }),

  /**
   * Get advisor/team performance metrics
   */
  getAdvisorPerformance: protectedProcedure.query(async () => {
    // Get all users who have account manager assignments
    const accountManagers = await prisma.opportunityAccountManager.groupBy({
      by: ["userId"],
    });

    const advisorMetrics = await Promise.all(
      accountManagers.map(async ({ userId }) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, email: true },
        });

        if (!user) return null;

        // Deals assigned as account manager
        const dealsAssigned = await prisma.opportunityAccountManager.count({
          where: { userId },
        });

        // Deals closed (where they are involved with concluded opportunities)
        const dealsClosed = await prisma.opportunityAccountManager.count({
          where: {
            userId,
            OR: [
              {
                opportunityId: {
                  in: (
                    await prisma.mergerAndAcquisition.findMany({
                      where: { status: "CONCLUDED" },
                      select: { id: true },
                    })
                  ).map((m) => m.id),
                },
                opportunityType: "MNA",
              },
              {
                opportunityId: {
                  in: (
                    await prisma.realEstate.findMany({
                      where: { status: "CONCLUDED" },
                      select: { id: true },
                    })
                  ).map((r) => r.id),
                },
                opportunityType: "REAL_ESTATE",
              },
            ],
          },
        });

        // AUM managed (count of active opportunities assigned)
        const aumManaged = await prisma.opportunityAccountManager.count({
          where: {
            userId,
            OR: [
              {
                opportunityId: {
                  in: (
                    await prisma.mergerAndAcquisition.findMany({
                      where: { status: "ACTIVE" },
                      select: { id: true },
                    })
                  ).map((m) => m.id),
                },
                opportunityType: "MNA",
              },
              {
                opportunityId: {
                  in: (
                    await prisma.realEstate.findMany({
                      where: { status: "ACTIVE" },
                      select: { id: true },
                    })
                  ).map((r) => r.id),
                },
                opportunityType: "REAL_ESTATE",
              },
            ],
          },
        });

        return {
          advisorId: user.id,
          advisorName: user.name || user.email,
          dealsAssigned,
          dealsClosed,
          aumManaged,
          closureRate:
            dealsAssigned > 0 ? (dealsClosed / dealsAssigned) * 100 : 0,
        };
      })
    );

    return advisorMetrics.filter(Boolean);
  }),

  /**
   * Get list of advisors for filtering
   */
  getAdvisors: protectedProcedure.query(async () => {
    const advisors = await prisma.user.findMany({
      where: {
        OR: [
          { accountManagerAssignments: { some: {} } },
          { leadResponsibleFor: { some: {} } },
          { leadMainContactFor: { some: {} } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      distinct: ["id"],
    });

    return advisors.map((advisor) => ({
      id: advisor.id,
      name: advisor.name || advisor.email,
    }));
  }),

  /**
   * Get available regions from database
   */
  getAvailableRegions: protectedProcedure.query(async () => {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        OR: [
          { location1: { not: null } },
          { location2: { not: null } },
          { location3: { not: null } },
        ],
      },
      select: {
        location1: true,
        location2: true,
        location3: true,
      },
    });

    const regionsSet = new Set<string>();
    for (const user of users) {
      [user.location1, user.location2, user.location3].forEach((loc) => {
        if (loc && loc.trim()) {
          regionsSet.add(loc.trim());
        }
      });
    }

    return Array.from(regionsSet).sort();
  }),

  /**
   * Get client insights statistics with filters
   */
  getClientInsightsStats: protectedProcedure
    .input(
      z.object({
        advisorId: z.string().nullable().optional(),
        clientType: z.string().nullable().optional(),
        region: z.string().nullable().optional(),
        investmentRange: z.string().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      const { advisorId, clientType, region, investmentRange } = input;

      // Build where clause based on filters
      const whereClause: any = {
        role: "USER", // Only count actual clients, not team members
      };

      const andConditions: any[] = [];

      if (advisorId) {
        andConditions.push({
          OR: [
            { leadResponsibleId: advisorId },
            { leadMainContactId: advisorId },
          ],
        });
      }

      if (clientType) {
        whereClause.type = clientType;
      }

      if (region) {
        andConditions.push({
          OR: [
            { location1: { contains: region, mode: "insensitive" } },
            { location2: { contains: region, mode: "insensitive" } },
            { location3: { contains: region, mode: "insensitive" } },
          ],
        });
      }

      if (investmentRange) {
        whereClause.investorType = investmentRange;
      }

      if (andConditions.length > 0) {
        whereClause.AND = andConditions;
      }

      // Get total clients
      const totalClients = await prisma.user.count({ where: whereClause });

      // Get active clients (those with recent contact or interests)
      const activeClients = await prisma.user.count({
        where: {
          ...whereClause,
          OR: [
            { lastContactDate: { gte: subDays(new Date(), 90) } },
            { mergerAndAcquisitionInterests: { some: {} } },
            { realEstateInterests: { some: {} } },
          ],
        },
      });

      // Calculate retention rate (clients active in last 90 days / total clients)
      const retentionRate = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

      // Get average portfolio size (average number of interests per client)
      const clientsWithInterests = await prisma.user.findMany({
        where: whereClause,
        select: {
          _count: {
            select: {
              mergerAndAcquisitionInterests: true,
              realEstateInterests: true,
            },
          },
        },
      });

      const avgPortfolioSize = totalClients > 0
        ? clientsWithInterests.reduce(
            (sum, client) =>
              sum +
              client._count.mergerAndAcquisitionInterests +
              client._count.realEstateInterests,
            0
          ) / totalClients
        : 0;

      return {
        totalClients,
        activeClients,
        clientAcquisitionCost: 0, // Placeholder - would need cost tracking
        lifetimeValue: 0, // Placeholder - would need revenue tracking
        retentionRate,
        avgPortfolioSize,
      };
    }),

  /**
   * Get clients by region for geographic distribution
   */
  getClientsByRegion: protectedProcedure
    .input(
      z.object({
        advisorId: z.string().nullable().optional(),
        clientType: z.string().nullable().optional(),
        investmentRange: z.string().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      const { advisorId, clientType, investmentRange } = input;

      const whereClause: any = {
        role: "USER",
      };

      const andConditions: any[] = [];

      if (advisorId) {
        andConditions.push({
          OR: [
            { leadResponsibleId: advisorId },
            { leadMainContactId: advisorId },
          ],
        });
      }

      if (clientType) {
        whereClause.type = clientType;
      }

      if (investmentRange) {
        whereClause.investorType = investmentRange;
      }

      if (andConditions.length > 0) {
        whereClause.AND = andConditions;
      }

      const clients = await prisma.user.findMany({
        where: whereClause,
        select: {
          location1: true,
          location2: true,
          location3: true,
        },
      });

      // Aggregate by region
      const regionCounts = new Map<string, number>();
      for (const client of clients) {
        [client.location1, client.location2, client.location3].forEach((loc) => {
          if (loc && loc.trim()) {
            const trimmedLoc = loc.trim();
            const current = regionCounts.get(trimmedLoc) ?? 0;
            regionCounts.set(trimmedLoc, current + 1);
          }
        });
      }

      return Array.from(regionCounts.entries())
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count);
    }),

  /**
   * Get client acquisition trend over last 12 months
   */
  getClientAcquisitionTrend: protectedProcedure
    .input(
      z.object({
        advisorId: z.string().nullable().optional(),
        clientType: z.string().nullable().optional(),
        region: z.string().nullable().optional(),
        investmentRange: z.string().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      const { advisorId, clientType, region, investmentRange } = input;

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

          const whereClause: any = {
            role: "USER",
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          };

          const andConditions: any[] = [];

          if (advisorId) {
            andConditions.push({
              OR: [
                { leadResponsibleId: advisorId },
                { leadMainContactId: advisorId },
              ],
            });
          }

          if (clientType) {
            whereClause.type = clientType;
          }

          if (region) {
            andConditions.push({
              OR: [
                { location1: { contains: region, mode: "insensitive" } },
                { location2: { contains: region, mode: "insensitive" } },
                { location3: { contains: region, mode: "insensitive" } },
              ],
            });
          }

          if (investmentRange) {
            whereClause.investorType = investmentRange;
          }

          if (andConditions.length > 0) {
            whereClause.AND = andConditions;
          }

          const count = await prisma.user.count({ where: whereClause });

          return {
            month: format(month, "yyyy-MM"),
            newClients: count,
          };
        })
      );

      return data;
    }),

  /**
   * Get clients by investment capacity
   */
  getClientsByInvestmentRange: protectedProcedure
    .input(
      z.object({
        advisorId: z.string().nullable().optional(),
        clientType: z.string().nullable().optional(),
        region: z.string().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      const { advisorId, clientType, region } = input;

      const whereClause: any = {
        role: "USER",
        investorType: {
          not: null,
        },
      };

      const andConditions: any[] = [];

      if (advisorId) {
        andConditions.push({
          OR: [
            { leadResponsibleId: advisorId },
            { leadMainContactId: advisorId },
          ],
        });
      }

      if (clientType) {
        whereClause.type = clientType;
      }

      if (region) {
        andConditions.push({
          OR: [
            { location1: { contains: region, mode: "insensitive" } },
            { location2: { contains: region, mode: "insensitive" } },
            { location3: { contains: region, mode: "insensitive" } },
          ],
        });
      }

      if (andConditions.length > 0) {
        whereClause.AND = andConditions;
      }

      const clients = await prisma.user.groupBy({
        by: ["investorType"],
        where: whereClause,
        _count: {
          id: true,
        },
      });

      return clients.map((item) => ({
        range: item.investorType ?? "Unknown",
        count: item._count.id,
      }));
    }),

  /**
   * Get clients per advisor with role breakdown
   */
  getClientsPerAdvisor: protectedProcedure
    .input(
      z.object({
        clientType: z.string().nullable().optional(),
        region: z.string().nullable().optional(),
        investmentRange: z.string().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      const { clientType, region, investmentRange } = input;

      // Build base where clause for clients
      const clientWhereClause: any = {
        role: "USER",
      };

      if (clientType) {
        clientWhereClause.type = clientType;
      }

      if (investmentRange) {
        clientWhereClause.investorType = investmentRange;
      }

      const andConditions: any[] = [];
      if (region) {
        andConditions.push({
          OR: [
            { location1: { contains: region, mode: "insensitive" } },
            { location2: { contains: region, mode: "insensitive" } },
            { location3: { contains: region, mode: "insensitive" } },
          ],
        });
      }

      if (andConditions.length > 0) {
        clientWhereClause.AND = andConditions;
      }

      // Get all team members (advisors/consultants)
      const advisors = await prisma.user.findMany({
        where: {
          role: { in: ["TEAM", "ADMIN"] },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      const advisorMetrics = await Promise.all(
        advisors.map(async (advisor) => {
          // Account Manager role: Get from OpportunityAccountManager table
          const accountManagerAssignments = await prisma.opportunityAccountManager.findMany({
            where: {
              userId: advisor.id,
            },
            select: {
              opportunityId: true,
              opportunityType: true,
            },
          });

          const accountManagerClients = new Set<string>();
          for (const assignment of accountManagerAssignments) {
            if (assignment.opportunityType === "MNA") {
              const mna = await prisma.mergerAndAcquisition.findUnique({
                where: { id: assignment.opportunityId },
                select: {
                  userInterests: {
                    where: { user: clientWhereClause },
                    select: { userId: true },
                  },
                },
              });
              mna?.userInterests.forEach((ui: any) => accountManagerClients.add(ui.userId));
            } else if (assignment.opportunityType === "REAL_ESTATE") {
              const re = await prisma.realEstate.findUnique({
                where: { id: assignment.opportunityId },
                select: {
                  userInterests: {
                    where: { user: clientWhereClause },
                    select: { userId: true },
                  },
                },
              });
              re?.userInterests.forEach((ui: any) => accountManagerClients.add(ui.userId));
            }
          }

          // Client Acquisitioner role
          const mnaClientAcq = await prisma.mergerAndAcquisition.findMany({
            where: { clientAcquisitionerId: advisor.id },
            select: {
              userInterests: {
                where: { user: clientWhereClause },
                select: { userId: true },
              },
            },
          });

          const reClientAcq = await prisma.realEstate.findMany({
            where: { clientAcquisitionerId: advisor.id },
            select: {
              userInterests: {
                where: { user: clientWhereClause },
                select: { userId: true },
              },
            },
          });

          const clientAcquisitionerClients = new Set<string>();
          [...mnaClientAcq, ...reClientAcq].forEach((opp) => {
            opp.userInterests.forEach((ui: any) => clientAcquisitionerClients.add(ui.userId));
          });

          // Deal Closure role: invested_person or followup_person
          const dealClosureAnalytics = await prisma.opportunityAnalytics.findMany({
            where: {
              OR: [
                { invested_person_id: advisor.id },
                { followup_person_id: advisor.id },
              ],
            },
            select: {
              mergerAndAcquisitionId: true,
              realEstateId: true,
            },
          });

          const dealClosureClients = new Set<string>();
          for (const analytics of dealClosureAnalytics) {
            if (analytics.mergerAndAcquisitionId) {
              const mna = await prisma.mergerAndAcquisition.findUnique({
                where: { id: analytics.mergerAndAcquisitionId },
                select: {
                  userInterests: {
                    where: { user: clientWhereClause },
                    select: { userId: true },
                  },
                },
              });
              mna?.userInterests.forEach((ui: any) => dealClosureClients.add(ui.userId));
            } else if (analytics.realEstateId) {
              const re = await prisma.realEstate.findUnique({
                where: { id: analytics.realEstateId },
                select: {
                  userInterests: {
                    where: { user: clientWhereClause },
                    select: { userId: true },
                  },
                },
              });
              re?.userInterests.forEach((ui: any) => dealClosureClients.add(ui.userId));
            }
          }

          return {
            advisorName: advisor.name || advisor.email,
            accountManager: accountManagerClients.size,
            clientAcquisitioner: clientAcquisitionerClients.size,
            dealClosure: dealClosureClients.size,
            total: accountManagerClients.size + clientAcquisitionerClients.size + dealClosureClients.size,
          };
        })
      );

      return advisorMetrics
        .filter((m) => m.total > 0)
        .sort((a, b) => b.total - a.total);
    }),

  /**
   * Get client type distribution
   */
  getClientTypeDistribution: protectedProcedure
    .input(
      z.object({
        advisorId: z.string().nullable().optional(),
        region: z.string().nullable().optional(),
        investmentRange: z.string().nullable().optional(),
      })
    )
    .query(async ({ input }) => {
      const { advisorId, region, investmentRange } = input;

      const whereClause: any = {
        role: "USER",
        type: {
          not: null,
        },
      };

      const andConditions: any[] = [];

      if (advisorId) {
        andConditions.push({
          OR: [
            { leadResponsibleId: advisorId },
            { leadMainContactId: advisorId },
          ],
        });
      }

      if (region) {
        andConditions.push({
          OR: [
            { location1: { contains: region, mode: "insensitive" } },
            { location2: { contains: region, mode: "insensitive" } },
            { location3: { contains: region, mode: "insensitive" } },
          ],
        });
      }

      if (investmentRange) {
        whereClause.investorType = investmentRange;
      }

      if (andConditions.length > 0) {
        whereClause.AND = andConditions;
      }

      const clients = await prisma.user.groupBy({
        by: ["type"],
        where: whereClause,
        _count: {
          id: true,
        },
      });

      return clients.map((item) => ({
        type: item.type ?? "Unknown",
        count: item._count.id,
      }));
    }),
});
