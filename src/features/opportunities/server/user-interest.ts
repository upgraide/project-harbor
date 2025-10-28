import { z } from "zod";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

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
});
