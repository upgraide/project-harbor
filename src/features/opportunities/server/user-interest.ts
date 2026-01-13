import { z } from "zod";
import { Role } from "@/generated/prisma";
import prisma from "@/lib/db";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const userInterestRouter = createTRPCRouter({
  /**
   * Get user's interest status for an M&A opportunity
   */
  getMergerAndAcquisitionInterest: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ ctx, input }) => {
      const interest = await prisma.userMergerAndAcquisitionInterest.findFirst({
        where: {
          userId: ctx.auth.user.id,
          mergerAndAcquisitionId: input.opportunityId,
        },
      });

      return interest ?? { interested: false, ndaSigned: false };
    }),

  /**
   * Get user's interest status for a Real Estate opportunity
   */
  getRealEstateInterest: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ ctx, input }) => {
      const interest = await prisma.userRealEstateInterest.findFirst({
        where: {
          userId: ctx.auth.user.id,
          realEstateId: input.opportunityId,
        },
      });

      return interest ?? { interested: false, ndaSigned: false };
    }),

  /**
   * Mark user as interested in an M&A opportunity
   */
  markMergerAndAcquisitionInterest: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.userMergerAndAcquisitionInterest.findFirst({
        where: {
          userId: ctx.auth.user.id,
          mergerAndAcquisitionId: input.opportunityId,
        },
      });

      if (existing) {
        return await prisma.userMergerAndAcquisitionInterest.update({
          where: { id: existing.id },
          data: { interested: true },
        });
      }

      return await prisma.userMergerAndAcquisitionInterest.create({
        data: {
          userId: ctx.auth.user.id,
          mergerAndAcquisitionId: input.opportunityId,
          interested: true,
        },
      });
    }),

  /**
   * Mark user as not interested in an M&A opportunity
   */
  markMergerAndAcquisitionNoInterest: protectedProcedure
    .input(
      z.object({ opportunityId: z.string(), reason: z.string().optional() })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.userMergerAndAcquisitionInterest.findFirst({
        where: {
          userId: ctx.auth.user.id,
          mergerAndAcquisitionId: input.opportunityId,
        },
      });

      if (existing) {
        return await prisma.userMergerAndAcquisitionInterest.update({
          where: { id: existing.id },
          data: { interested: false, notInterestedReason: input.reason },
        });
      }

      return await prisma.userMergerAndAcquisitionInterest.create({
        data: {
          userId: ctx.auth.user.id,
          mergerAndAcquisitionId: input.opportunityId,
          interested: false,
          notInterestedReason: input.reason,
        },
      });
    }),

  /**
   * Mark NDA as signed for an M&A opportunity
   */
  signMergerAndAcquisitionNDA: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.userMergerAndAcquisitionInterest.findFirst({
        where: {
          userId: ctx.auth.user.id,
          mergerAndAcquisitionId: input.opportunityId,
        },
      });

      if (existing) {
        return await prisma.userMergerAndAcquisitionInterest.update({
          where: { id: existing.id },
          data: { ndaSigned: true, interested: true },
        });
      }

      return await prisma.userMergerAndAcquisitionInterest.create({
        data: {
          userId: ctx.auth.user.id,
          mergerAndAcquisitionId: input.opportunityId,
          ndaSigned: true,
          interested: true,
        },
      });
    }),

  /**
   * Mark user as interested in a Real Estate opportunity
   */
  markRealEstateInterest: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.userRealEstateInterest.findFirst({
        where: {
          userId: ctx.auth.user.id,
          realEstateId: input.opportunityId,
        },
      });

      if (existing) {
        return await prisma.userRealEstateInterest.update({
          where: { id: existing.id },
          data: { interested: true },
        });
      }

      return await prisma.userRealEstateInterest.create({
        data: {
          userId: ctx.auth.user.id,
          realEstateId: input.opportunityId,
          interested: true,
        },
      });
    }),

  /**
   * Mark user as not interested in a Real Estate opportunity
   */
  markRealEstateNoInterest: protectedProcedure
    .input(
      z.object({ opportunityId: z.string(), reason: z.string().optional() })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.userRealEstateInterest.findFirst({
        where: {
          userId: ctx.auth.user.id,
          realEstateId: input.opportunityId,
        },
      });

      if (existing) {
        return await prisma.userRealEstateInterest.update({
          where: { id: existing.id },
          data: { interested: false, notInterestedReason: input.reason },
        });
      }

      return await prisma.userRealEstateInterest.create({
        data: {
          userId: ctx.auth.user.id,
          realEstateId: input.opportunityId,
          interested: false,
          notInterestedReason: input.reason,
        },
      });
    }),

  /**
   * Mark NDA as signed for a Real Estate opportunity
   */
  signRealEstateNDA: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.userRealEstateInterest.findFirst({
        where: {
          userId: ctx.auth.user.id,
          realEstateId: input.opportunityId,
        },
      });

      if (existing) {
        return await prisma.userRealEstateInterest.update({
          where: { id: existing.id },
          data: { ndaSigned: true, interested: true },
        });
      }

      return await prisma.userRealEstateInterest.create({
        data: {
          userId: ctx.auth.user.id,
          realEstateId: input.opportunityId,
          ndaSigned: true,
          interested: true,
        },
      });
    }),

  /**
   * Get all user interests for an M&A opportunity (Team/Admin only)
   */
  getAllMergerAndAcquisitionInterests: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch user's role from database
      const user = await prisma.user.findUnique({
        where: { id: ctx.auth.user.id },
        select: { role: true },
      });

      // Check if user is team or admin
      if (!user || (user.role !== Role.TEAM && user.role !== Role.ADMIN)) {
        throw new Error("Unauthorized: Team or Admin access required");
      }

      return await prisma.userMergerAndAcquisitionInterest.findMany({
        where: {
          mergerAndAcquisitionId: input.opportunityId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),

  /**
   * Get all user interests for a Real Estate opportunity (Team/Admin only)
   */
  getAllRealEstateInterests: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch user's role from database
      const user = await prisma.user.findUnique({
        where: { id: ctx.auth.user.id },
        select: { role: true },
      });

      // Check if user is team or admin
      if (!user || (user.role !== Role.TEAM && user.role !== Role.ADMIN)) {
        throw new Error("Unauthorized: Team or Admin access required");
      }

      return await prisma.userRealEstateInterest.findMany({
        where: {
          realEstateId: input.opportunityId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),
});
