import { z } from "zod";
import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type MAndAInterest = {
  id: string;
  userId: string;
  createdAt: Date;
  ndaSigned: boolean;
  interested: boolean;
  notInterestedReason: string | null;
  processed: boolean;
  user: { name: string; email: string };
  mergerAndAcquisition: { id: string; name: string };
};

type RealEstateInterest = {
  id: string;
  userId: string;
  createdAt: Date;
  ndaSigned: boolean;
  interested: boolean;
  notInterestedReason: string | null;
  processed: boolean;
  user: { name: string; email: string };
  realEstate: { id: string; name: string };
};

const formatMAndAInterest = (interest: MAndAInterest) => ({
  id: interest.id,
  uniqueId: `mna-${interest.id}`,
  userId: interest.userId,
  userName: interest.user.name,
  userEmail: interest.user.email,
  projectId: interest.mergerAndAcquisition.id,
  projectName: interest.mergerAndAcquisition.name,
  type: "m&a" as const,
  date: interest.createdAt,
  interested: interest.interested,
  notInterestedReason: interest.notInterestedReason,
  ndaSigned: interest.ndaSigned,
  processed: interest.processed,
});

const formatRealEstateInterest = (interest: RealEstateInterest) => ({
  id: interest.id,
  uniqueId: `re-${interest.id}`,
  userId: interest.userId,
  userName: interest.user.name,
  userEmail: interest.user.email,
  projectId: interest.realEstate.id,
  projectName: interest.realEstate.name,
  type: "real-estate" as const,
  date: interest.createdAt,
  interested: interest.interested,
  notInterestedReason: interest.notInterestedReason,
  ndaSigned: interest.ndaSigned,
  processed: interest.processed,
});

const buildMAndAWhereClause = (
  type: string,
  status: string,
  search: string
) => {
  if (type === "real-estate") {
    return null; // Skip M&A when filtering for real-estate only
  }

  const whereClause: Record<string, unknown> = {};

  // Status filter: pending = not processed, processed = processed
  if (status === "pending") {
    whereClause.processed = false;
  } else if (status === "processed") {
    whereClause.processed = true;
  }

  // Search filter
  if (search.trim()) {
    whereClause.OR = [
      {
        mergerAndAcquisition: {
          name: { contains: search.trim(), mode: "insensitive" },
        },
      },
      {
        user: {
          name: { contains: search.trim(), mode: "insensitive" },
        },
      },
    ];
  }

  return whereClause;
};

const buildRealEstateWhereClause = (
  type: string,
  status: string,
  search: string
) => {
  if (type === "m&a") {
    return null; // Skip real estate when filtering for M&A only
  }

  const whereClause: Record<string, unknown> = {};

  // Status filter: pending = not processed, processed = processed
  if (status === "pending") {
    whereClause.processed = false;
  } else if (status === "processed") {
    whereClause.processed = true;
  }

  // Search filter
  if (search.trim()) {
    whereClause.OR = [
      {
        realEstate: {
          name: { contains: search.trim(), mode: "insensitive" },
        },
      },
      {
        user: {
          name: { contains: search.trim(), mode: "insensitive" },
        },
      },
    ];
  }

  return whereClause;
};

export const investmentInterestsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        type: z.enum(["all", "m&a", "real-estate"]).default("all"),
        status: z.enum(["all", "pending", "processed"]).default("all"),
        search: z.string().default(""),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit, type, status, search } = input;

      const mAndAWhere = buildMAndAWhereClause(type, status, search);
      const realEstateWhere = buildRealEstateWhereClause(type, status, search);

      // Fetch all interests from both tables (we'll merge and paginate after)
      const fetchMAndA = async () => {
        if (mAndAWhere === null) {
          return [];
        }
        return await prisma.userMergerAndAcquisitionInterest.findMany({
          where: mAndAWhere,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            mergerAndAcquisition: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      };

      const fetchRealEstate = async () => {
        if (realEstateWhere === null) {
          return [];
        }
        return await prisma.userRealEstateInterest.findMany({
          where: realEstateWhere,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            realEstate: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      };

      const [mAndAInterests, realEstateInterests] = await Promise.all([
        fetchMAndA(),
        fetchRealEstate(),
      ]);

      // Merge and format all interests
      const allInterests = [
        ...mAndAInterests.map(formatMAndAInterest),
        ...realEstateInterests.map(formatRealEstateInterest),
      ];

      // Sort by date descending
      allInterests.sort((a, b) => b.date.getTime() - a.date.getTime());

      // Find cursor position and paginate
      let startIndex = 0;
      if (cursor) {
        const cursorIndex = allInterests.findIndex(
          (item) => item.uniqueId === cursor
        );
        if (cursorIndex !== -1) {
          startIndex = cursorIndex + 1;
        }
      }

      const paginatedInterests = allInterests.slice(
        startIndex,
        startIndex + limit
      );
      const nextCursor =
        paginatedInterests.length === limit
          ? paginatedInterests[paginatedInterests.length - 1]?.uniqueId
          : undefined;

      return {
        items: paginatedInterests,
        nextCursor,
        totalCount: allInterests.length,
      };
    }),

  toggleProcessed: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["m&a", "real-estate"]),
        processed: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, type, processed } = input;

      if (type === "m&a") {
        await prisma.userMergerAndAcquisitionInterest.update({
          where: { id },
          data: { processed },
        });
      } else {
        await prisma.userRealEstateInterest.update({
          where: { id },
          data: { processed },
        });
      }

      return { success: true };
    }),
});
