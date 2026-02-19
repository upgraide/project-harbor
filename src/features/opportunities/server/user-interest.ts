import { z } from "zod";
import { NotificationType, OpportunityType, Role } from "@/generated/prisma";
import prisma from "@/lib/db";
import { notifyTeamAndAdmins } from "@/features/notifications/server/notifications";
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

      let result;
      if (existing) {
        result = await prisma.userMergerAndAcquisitionInterest.update({
          where: { id: existing.id },
          data: { interested: true },
        });
      } else {
        result = await prisma.userMergerAndAcquisitionInterest.create({
          data: {
            userId: ctx.auth.user.id,
            mergerAndAcquisitionId: input.opportunityId,
            interested: true,
          },
        });
      }

      // Notify team about interest
      const [user, opp] = await Promise.all([
        prisma.user.findUnique({ where: { id: ctx.auth.user.id }, select: { name: true } }),
        prisma.mergerAndAcquisition.findUnique({ where: { id: input.opportunityId }, select: { name: true } }),
      ]);
      await notifyTeamAndAdmins({
        type: NotificationType.OPPORTUNITY_INTEREST,
        title: `${user?.name ?? "User"} interested in M&A`,
        message: `${user?.name ?? "User"} expressed interest in ${opp?.name ?? "opportunity"}`,
        opportunityId: input.opportunityId,
        opportunityType: OpportunityType.MNA,
        relatedUserId: ctx.auth.user.id,
      });

      return result;
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

      let result;
      if (existing) {
        result = await prisma.userMergerAndAcquisitionInterest.update({
          where: { id: existing.id },
          data: { interested: false, notInterestedReason: input.reason },
        });
      } else {
        result = await prisma.userMergerAndAcquisitionInterest.create({
          data: {
            userId: ctx.auth.user.id,
            mergerAndAcquisitionId: input.opportunityId,
            interested: false,
            notInterestedReason: input.reason,
          },
        });
      }

      // Notify team about no interest
      const [user, opp] = await Promise.all([
        prisma.user.findUnique({ where: { id: ctx.auth.user.id }, select: { name: true } }),
        prisma.mergerAndAcquisition.findUnique({ where: { id: input.opportunityId }, select: { name: true } }),
      ]);
      await notifyTeamAndAdmins({
        type: NotificationType.OPPORTUNITY_NOT_INTERESTED,
        title: `${user?.name ?? "User"} not interested in M&A`,
        message: `${user?.name ?? "User"} declined ${opp?.name ?? "opportunity"}${input.reason ? `: ${input.reason}` : ""}`,
        opportunityId: input.opportunityId,
        opportunityType: OpportunityType.MNA,
        relatedUserId: ctx.auth.user.id,
      });

      return result;
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

      let result;
      if (existing) {
        result = await prisma.userMergerAndAcquisitionInterest.update({
          where: { id: existing.id },
          data: { ndaSigned: true, interested: true },
        });
      } else {
        result = await prisma.userMergerAndAcquisitionInterest.create({
          data: {
            userId: ctx.auth.user.id,
            mergerAndAcquisitionId: input.opportunityId,
            ndaSigned: true,
            interested: true,
          },
        });
      }

      // Notify team about NDA signing
      const [user, opp] = await Promise.all([
        prisma.user.findUnique({ where: { id: ctx.auth.user.id }, select: { name: true } }),
        prisma.mergerAndAcquisition.findUnique({ where: { id: input.opportunityId }, select: { name: true } }),
      ]);
      await notifyTeamAndAdmins({
        type: NotificationType.OPPORTUNITY_NDA_SIGNED,
        title: `${user?.name ?? "User"} signed NDA`,
        message: `${user?.name ?? "User"} signed NDA for ${opp?.name ?? "opportunity"} (M&A)`,
        opportunityId: input.opportunityId,
        opportunityType: OpportunityType.MNA,
        relatedUserId: ctx.auth.user.id,
      });

      return result;
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

      let result;
      if (existing) {
        result = await prisma.userRealEstateInterest.update({
          where: { id: existing.id },
          data: { interested: true },
        });
      } else {
        result = await prisma.userRealEstateInterest.create({
          data: {
            userId: ctx.auth.user.id,
            realEstateId: input.opportunityId,
            interested: true,
          },
        });
      }

      // Notify team about interest
      const [user, opp] = await Promise.all([
        prisma.user.findUnique({ where: { id: ctx.auth.user.id }, select: { name: true } }),
        prisma.realEstate.findUnique({ where: { id: input.opportunityId }, select: { name: true } }),
      ]);
      await notifyTeamAndAdmins({
        type: NotificationType.OPPORTUNITY_INTEREST,
        title: `${user?.name ?? "User"} interested in Real Estate`,
        message: `${user?.name ?? "User"} expressed interest in ${opp?.name ?? "opportunity"}`,
        opportunityId: input.opportunityId,
        opportunityType: OpportunityType.REAL_ESTATE,
        relatedUserId: ctx.auth.user.id,
      });

      return result;
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

      let result;
      if (existing) {
        result = await prisma.userRealEstateInterest.update({
          where: { id: existing.id },
          data: { interested: false, notInterestedReason: input.reason },
        });
      } else {
        result = await prisma.userRealEstateInterest.create({
          data: {
            userId: ctx.auth.user.id,
            realEstateId: input.opportunityId,
            interested: false,
            notInterestedReason: input.reason,
          },
        });
      }

      // Notify team about no interest
      const [user, opp] = await Promise.all([
        prisma.user.findUnique({ where: { id: ctx.auth.user.id }, select: { name: true } }),
        prisma.realEstate.findUnique({ where: { id: input.opportunityId }, select: { name: true } }),
      ]);
      await notifyTeamAndAdmins({
        type: NotificationType.OPPORTUNITY_NOT_INTERESTED,
        title: `${user?.name ?? "User"} not interested in RE`,
        message: `${user?.name ?? "User"} declined ${opp?.name ?? "opportunity"}${input.reason ? `: ${input.reason}` : ""}`,
        opportunityId: input.opportunityId,
        opportunityType: OpportunityType.REAL_ESTATE,
        relatedUserId: ctx.auth.user.id,
      });

      return result;
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

      let result;
      if (existing) {
        result = await prisma.userRealEstateInterest.update({
          where: { id: existing.id },
          data: { ndaSigned: true, interested: true },
        });
      } else {
        result = await prisma.userRealEstateInterest.create({
          data: {
            userId: ctx.auth.user.id,
            realEstateId: input.opportunityId,
            ndaSigned: true,
            interested: true,
          },
        });
      }

      // Notify team about NDA signing
      const [user, opp] = await Promise.all([
        prisma.user.findUnique({ where: { id: ctx.auth.user.id }, select: { name: true } }),
        prisma.realEstate.findUnique({ where: { id: input.opportunityId }, select: { name: true } }),
      ]);
      await notifyTeamAndAdmins({
        type: NotificationType.OPPORTUNITY_NDA_SIGNED,
        title: `${user?.name ?? "User"} signed NDA`,
        message: `${user?.name ?? "User"} signed NDA for ${opp?.name ?? "opportunity"} (Real Estate)`,
        opportunityId: input.opportunityId,
        opportunityType: OpportunityType.REAL_ESTATE,
        relatedUserId: ctx.auth.user.id,
      });

      return result;
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
