import { z } from "zod";
import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const buildWhereClause = (
  type: string,
  status: string,
  targetType: "m&a" | "real-estate"
): { interested: boolean; ndaSigned?: boolean } | null => {
  const shouldInclude = type === "all" || type === targetType;
  if (!shouldInclude) {
    return null;
  }

  const baseClause = { interested: true };
  if (status === "pending") {
    return { ...baseClause, ndaSigned: false };
  }
  if (status === "processed") {
    return { ...baseClause, ndaSigned: true };
  }
  return baseClause;
};

const formatMAndAInterest = (interest: {
  id: string;
  userId: string;
  createdAt: Date;
  ndaSigned: boolean;
  user: { name: string; email: string };
  mergerAndAcquisition: { id: string; name: string };
}) => ({
  id: interest.id,
  userId: interest.userId,
  userName: interest.user.name,
  userEmail: interest.user.email,
  projectId: interest.mergerAndAcquisition.id,
  projectName: interest.mergerAndAcquisition.name,
  type: "m&a" as const,
  date: interest.createdAt,
  status: interest.ndaSigned ? ("processed" as const) : ("pending" as const),
});

const formatRealEstateInterest = (interest: {
  id: string;
  userId: string;
  createdAt: Date;
  ndaSigned: boolean;
  user: { name: string; email: string };
  realEstate: { id: string; name: string };
}) => ({
  id: interest.id,
  userId: interest.userId,
  userName: interest.user.name,
  userEmail: interest.user.email,
  projectId: interest.realEstate.id,
  projectName: interest.realEstate.name,
  type: "real-estate" as const,
  date: interest.createdAt,
  status: interest.ndaSigned ? ("processed" as const) : ("pending" as const),
});

export const investmentInterestsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        type: z.enum(["all", "m&a", "real-estate"]).default("all"),
        status: z.enum(["all", "pending", "processed"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, type, status } = input;

      const mAndAWhere = buildWhereClause(type, status, "m&a");
      const realEstateWhere = buildWhereClause(type, status, "real-estate");

      const isMAndAOnly = type === "m&a";
      const isRealEstateOnly = type === "real-estate";

      const fetchMAndA = async () => {
        if (!mAndAWhere) {
          return [];
        }
        return await prisma.userMergerAndAcquisitionInterest.findMany({
          where: mAndAWhere,
          skip: isMAndAOnly ? (page - 1) * pageSize : 0,
          take: isMAndAOnly ? pageSize : undefined,
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
        if (!realEstateWhere) {
          return [];
        }
        return await prisma.userRealEstateInterest.findMany({
          where: realEstateWhere,
          skip: isRealEstateOnly ? (page - 1) * pageSize : 0,
          take: isRealEstateOnly ? pageSize : undefined,
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

      const allInterests = [
        ...mAndAInterests.map(formatMAndAInterest),
        ...realEstateInterests.map(formatRealEstateInterest),
      ];

      allInterests.sort((a, b) => b.date.getTime() - a.date.getTime());

      const isAllTypes = type === "all";
      const startIndex = isAllTypes ? (page - 1) * pageSize : 0;
      const endIndex = isAllTypes ? startIndex + pageSize : undefined;
      const paginatedInterests = endIndex
        ? allInterests.slice(startIndex, endIndex)
        : allInterests;

      let totalCount: number;
      if (isAllTypes) {
        totalCount = allInterests.length;
      } else if (isMAndAOnly && mAndAWhere) {
        totalCount = await prisma.userMergerAndAcquisitionInterest.count({
          where: mAndAWhere as { interested: boolean; ndaSigned?: boolean },
        });
      } else if (realEstateWhere) {
        totalCount = await prisma.userRealEstateInterest.count({
          where: realEstateWhere as {
            interested: boolean;
            ndaSigned?: boolean;
          },
        });
      } else {
        totalCount = 0;
      }

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items: paginatedInterests,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
