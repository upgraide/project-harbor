import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CommissionRole, NotificationType, Role, OpportunityStatus, OpportunityType } from "@/generated/prisma";
import { createNotifications, notifyAdmins } from "@/features/notifications/server/notifications";
import prisma from "@/lib/db";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { calculateOpportunityCommissions } from "./calculations";

export const commissionsRouter = createTRPCRouter({
  // Get commissions for the current logged-in user (team member view)
  // Shows ALL CONCLUDED opportunities where user has a commission role (resolved or not)
  getMyCommissions: protectedProcedure.query(async ({ ctx }) => {
    // Check if user has TEAM or ADMIN role
    const user = await prisma.user.findUnique({
      where: { id: ctx.auth.user.id },
      select: { role: true },
    });

    if (!user || (user.role !== Role.TEAM && user.role !== Role.ADMIN)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be a team member or admin to access commissions",
      });
    }

    const userId = ctx.auth.user.id;

    // Fetch user's commissions
    const commissions = await prisma.commission.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        commissionValues: {
          where: {
            totalCommissionValue: { not: null }, // Only show resolved commissions
          },
          include: {
            payments: true,
          },
        },
      },
    });

    // Get only commission values that have been resolved (for resolved opportunity list)
    const resolvedCommissionValues = await prisma.commissionValue.findMany({
      where: {
        commission: {
          userId: userId,
        },
        totalCommissionValue: { not: null },
      },
      select: {
        opportunityId: true,
        opportunityType: true,
      },
    });

    const resolvedOpportunityIds = resolvedCommissionValues.map(cv => cv.opportunityId);

    // Fetch ALL CONCLUDED opportunities where user has a commission role (resolved or not)
    const clientAcquisitionMNA = await prisma.mergerAndAcquisition.findMany({
      where: {
        clientAcquisitionerId: userId,
        status: OpportunityStatus.CONCLUDED,
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            closed_at: true,
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    const clientAcquisitionRE = await prisma.realEstate.findMany({
      where: {
        clientAcquisitionerId: userId,
        status: OpportunityStatus.CONCLUDED,
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            closed_at: true,
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    // Fetch opportunities where user is client originator
    const clientOriginatorMNA = await prisma.mergerAndAcquisition.findMany({
      where: {
        clientOriginatorId: userId,
        status: OpportunityStatus.CONCLUDED,
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            closed_at: true,
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    const clientOriginatorRE = await prisma.realEstate.findMany({
      where: {
        clientOriginatorId: userId,
        status: OpportunityStatus.CONCLUDED,
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            closed_at: true,
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    // Fetch assignments where user is account manager
    const accountManagerAssignments = await prisma.opportunityAccountManager.findMany({
      where: { userId },
      select: {
        opportunityId: true,
        opportunityType: true,
      },
    });

    const accountManagerMNAIds = accountManagerAssignments
      .filter((a) => a.opportunityType === "MNA")
      .map((a) => a.opportunityId);

    const accountManagerREIds = accountManagerAssignments
      .filter((a) => a.opportunityType === "REAL_ESTATE")
      .map((a) => a.opportunityId);

    const accountManagerMNA = await prisma.mergerAndAcquisition.findMany({
      where: {
        id: { in: accountManagerMNAIds },
        status: OpportunityStatus.CONCLUDED,
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            closed_at: true,
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    const accountManagerRE = await prisma.realEstate.findMany({
      where: {
        id: { in: accountManagerREIds },
        status: OpportunityStatus.CONCLUDED,
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            closed_at: true,
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    // Fetch assignments where user is deal support
    const dealSupportAnalytics = await prisma.opportunityAnalytics.findMany({
      where: {
        OR: [
          { invested_person_id: userId },
          { followup_person_id: userId },
        ],
      },
      select: {
        mergerAndAcquisitionId: true,
        realEstateId: true,
        closed_at: true,
        final_amount: true,
        commissionable_amount: true,
      },
    });

    const dealSupportMNAIds = dealSupportAnalytics
      .filter((a) => a.mergerAndAcquisitionId)
      .map((a) => a.mergerAndAcquisitionId as string);

    const dealSupportREIds = dealSupportAnalytics
      .filter((a) => a.realEstateId)
      .map((a) => a.realEstateId as string);

    const dealSupportMNA = await prisma.mergerAndAcquisition.findMany({
      where: {
        id: { in: dealSupportMNAIds },
        status: OpportunityStatus.CONCLUDED,
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            closed_at: true,
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    const dealSupportRE = await prisma.realEstate.findMany({
      where: {
        id: { in: dealSupportREIds },
        status: OpportunityStatus.CONCLUDED,
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            closed_at: true,
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    // Fetch all commission values for this user's projects (only resolved ones)
    const allOpportunityIds = [
      ...clientAcquisitionMNA.map(p => p.id),
      ...clientAcquisitionRE.map(p => p.id),
      ...clientOriginatorMNA.map(p => p.id),
      ...clientOriginatorRE.map(p => p.id),
      ...accountManagerMNA.map(p => p.id),
      ...accountManagerRE.map(p => p.id),
      ...dealSupportMNA.map(p => p.id),
      ...dealSupportRE.map(p => p.id),
    ];

    // Fetch commission schedules to check if they are resolved
    const commissionSchedules = await prisma.opportunityCommissionSchedule.findMany({
      where: {
        opportunityId: { in: allOpportunityIds },
        isResolved: true,
      },
      select: {
        id: true,
        opportunityId: true,
        opportunityType: true,
        isResolved: true,
        resolvedAt: true,
      },
    });

    const resolvedScheduleOpportunityIds = commissionSchedules.map(s => s.opportunityId);

    const commissionValues = await prisma.commissionValue.findMany({
      where: {
        opportunityId: { in: resolvedScheduleOpportunityIds },
        commission: {
          userId: userId,
        },
      },
      select: {
        id: true,
        opportunityId: true,
        opportunityType: true,
        totalCommissionValue: true,
        commission: {
          select: {
            roleType: true,
          },
        },
      },
    });

    // Fetch all commission payments for this user across all opportunities
    const userCommissionPayments = await prisma.commissionPayment.findMany({
      where: {
        commissionValue: {
          opportunityId: { in: resolvedScheduleOpportunityIds },
          commission: {
            userId: userId,
          },
        },
      },
      select: {
        commissionValue: {
          select: {
            opportunityId: true,
          },
        },
        isPaid: true,
        paymentAmount: true,
      },
    });

    // Group payments by opportunity
    const paymentsByOpportunity = new Map<string, Array<{ isPaid: boolean; paymentAmount: number | null }>>();
    
    for (const payment of userCommissionPayments) {
      const oppId = payment.commissionValue.opportunityId;
      if (!paymentsByOpportunity.has(oppId)) {
        paymentsByOpportunity.set(oppId, []);
      }
      paymentsByOpportunity.get(oppId)!.push({
        isPaid: payment.isPaid,
        paymentAmount: payment.paymentAmount,
      });
    }

    // Create a map for easy lookup: `${opportunityId}-${roleType}` -> commissionValue
    const commissionValueMap = new Map(
      commissionValues.map(cv => [
        `${cv.opportunityId}-${cv.commission.roleType}`,
        cv.totalCommissionValue,
      ])
    );

    // Create schedule map for isResolved check with payment status
    const scheduleMap = new Map(
      commissionSchedules.map(s => {
        // Get payments for this opportunity
        const allPayments = paymentsByOpportunity.get(s.opportunityId) || [];
        const totalPaid = allPayments.filter(p => p.isPaid).reduce((sum, p) => sum + (p.paymentAmount ?? 0), 0);
        const totalAmount = allPayments.reduce((sum, p) => sum + (p.paymentAmount ?? 0), 0);
        const allPaid = allPayments.length > 0 && allPayments.every(p => p.isPaid);
        const hasUnpaid = allPayments.some(p => !p.isPaid);

        return [
          s.opportunityId,
          {
            isResolved: s.isResolved,
            resolvedAt: s.resolvedAt,
            paymentStatus: {
              allPaid,
              hasUnpaid,
              totalPaid,
              totalAmount,
            },
          },
        ];
      })
    );

    // Calculate payment statistics for the user (only for resolved schedules)
    const allUserPayments = await prisma.commissionPayment.findMany({
      where: {
        commissionValue: {
          opportunityId: { in: resolvedScheduleOpportunityIds },
          commission: {
            userId: userId,
          },
        },
      },
      select: {
        isPaid: true,
        paymentAmount: true,
      },
    });

    const totalPaid = allUserPayments
      .filter(p => p.isPaid)
      .reduce((sum, p) => sum + (p.paymentAmount ?? 0), 0);

    const totalYetToPay = allUserPayments
      .filter(p => !p.isPaid)
      .reduce((sum, p) => sum + (p.paymentAmount ?? 0), 0);

    return {
      commissions,
      commissionValues: commissionValues, // Use the correctly structured query results
      commissionValueMap: Object.fromEntries(commissionValueMap),
      scheduleMap: Object.fromEntries(scheduleMap),
      projects: {
        clientAcquisition: [...clientAcquisitionMNA, ...clientAcquisitionRE],
        clientOriginator: [...clientOriginatorMNA, ...clientOriginatorRE],
        accountManager: [...accountManagerMNA, ...accountManagerRE],
        dealSupport: [...dealSupportMNA, ...dealSupportRE],
      },
      paymentStats: {
        totalPaid,
        totalYetToPay,
      },
    };
  }),

  // Get all commissions (admin overview)
  getAllCommissions: adminProcedure.query(async () => {
    const commissions = await prisma.commission.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [
        { user: { name: "asc" } },
        { roleType: "asc" },
      ],
    });

    return commissions;
  }),

  // Get commissions for a specific employee (admin)
  getEmployeeCommissions: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const commissions = await prisma.commission.findMany({
        where: { userId: input.userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Fetch project assignments similar to getMyCommissions
      const clientAcquisitionMNA = await prisma.mergerAndAcquisition.findMany({
        where: {
          clientAcquisitionerId: input.userId,
          status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
        },
        select: {
          id: true,
          name: true,
          status: true,
          analytics: {
            select: {
              closed_at: true,
              final_amount: true,
              commissionable_amount: true,
            },
          },
        },
      });

      const clientAcquisitionRE = await prisma.realEstate.findMany({
        where: {
          clientAcquisitionerId: input.userId,
          status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
        },
        select: {
          id: true,
          name: true,
          status: true,
          analytics: {
            select: {
              closed_at: true,
              final_amount: true,
              commissionable_amount: true,
            },
          },
        },
      });

      // Fetch opportunities where user is client originator
      const clientOriginatorMNA = await prisma.mergerAndAcquisition.findMany({
        where: {
          clientOriginatorId: input.userId,
          status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
        },
        select: {
          id: true,
          name: true,
          status: true,
          analytics: {
            select: {
              closed_at: true,
              final_amount: true,
              commissionable_amount: true,
            },
          },
        },
      });

      const clientOriginatorRE = await prisma.realEstate.findMany({
        where: {
          clientOriginatorId: input.userId,
          status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
        },
        select: {
          id: true,
          name: true,
          status: true,
          analytics: {
            select: {
              closed_at: true,
              final_amount: true,
              commissionable_amount: true,
            },
          },
        },
      });

      const accountManagerAssignments = await prisma.opportunityAccountManager.findMany({
        where: { userId: input.userId },
        select: {
          opportunityId: true,
          opportunityType: true,
        },
      });

      const accountManagerMNAIds = accountManagerAssignments
        .filter((a) => a.opportunityType === "MNA")
        .map((a) => a.opportunityId);

      const accountManagerREIds = accountManagerAssignments
        .filter((a) => a.opportunityType === "REAL_ESTATE")
        .map((a) => a.opportunityId);

      const accountManagerMNA = await prisma.mergerAndAcquisition.findMany({
        where: {
          id: { in: accountManagerMNAIds },
          status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
        },
        select: {
          id: true,
          name: true,
          status: true,
          analytics: {
            select: {
              closed_at: true,
              final_amount: true,
              commissionable_amount: true,
            },
          },
        },
      });

      const accountManagerRE = await prisma.realEstate.findMany({
        where: {
          id: { in: accountManagerREIds },
          status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
        },
        select: {
          id: true,
          name: true,
          status: true,
          analytics: {
            select: {
              closed_at: true,
              final_amount: true,
              commissionable_amount: true,
            },
          },
        },
      });

      // Fetch assignments where user is deal support (invested_person or followup_person)
      const dealSupportAnalytics = await prisma.opportunityAnalytics.findMany({
        where: {
          OR: [
            { invested_person_id: input.userId },
            { followup_person_id: input.userId },
          ],
        },
        select: {
          mergerAndAcquisitionId: true,
          realEstateId: true,
          closed_at: true,
          final_amount: true,
          commissionable_amount: true,
        },
      });

      const dealSupportMNAIds = dealSupportAnalytics
        .filter((a) => a.mergerAndAcquisitionId)
        .map((a) => a.mergerAndAcquisitionId as string);

      const dealSupportREIds = dealSupportAnalytics
        .filter((a) => a.realEstateId)
        .map((a) => a.realEstateId as string);

      const dealSupportMNA = await prisma.mergerAndAcquisition.findMany({
        where: {
          id: { in: dealSupportMNAIds },
          status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
        },
        select: {
          id: true,
          name: true,
          status: true,
          analytics: {
            select: {
              closed_at: true,
              final_amount: true,
              commissionable_amount: true,
            },
          },
        },
      });

      const dealSupportRE = await prisma.realEstate.findMany({
        where: {
          id: { in: dealSupportREIds },
          status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
        },
        select: {
          id: true,
          name: true,
          status: true,
          analytics: {
            select: {
              closed_at: true,
              final_amount: true,
              commissionable_amount: true,
            },
          },
        },
      });

      // Fetch all commission values for this user's projects
      const allOpportunityIds = [
        ...clientAcquisitionMNA.map(p => p.id),
        ...clientAcquisitionRE.map(p => p.id),
        ...clientOriginatorMNA.map(p => p.id),
        ...clientOriginatorRE.map(p => p.id),
        ...accountManagerMNA.map(p => p.id),
        ...accountManagerRE.map(p => p.id),
        ...dealSupportMNA.map(p => p.id),
        ...dealSupportRE.map(p => p.id),
      ];

      // Fetch commission schedules
      const commissionSchedules = await prisma.opportunityCommissionSchedule.findMany({
        where: {
          opportunityId: { in: allOpportunityIds },
        },
        select: {
          id: true,
          opportunityId: true,
          opportunityType: true,
          isResolved: true,
          resolvedAt: true,
        },
      });

      const commissionValues = await prisma.commissionValue.findMany({
        where: {
          opportunityId: { in: allOpportunityIds },
          commission: {
            userId: input.userId,
          },
        },
        select: {
          id: true,
          opportunityId: true,
          opportunityType: true,
          totalCommissionValue: true,
          commission: {
            select: {
              roleType: true,
            },
          },
        },
      });

      // Create a map for easy lookup: `${opportunityId}-${roleType}` -> commissionValue
      const commissionValueMap = new Map(
        commissionValues.map(cv => [
          `${cv.opportunityId}-${cv.commission.roleType}`,
          cv.totalCommissionValue,
        ])
      );

      // Create schedule map for isResolved check
      const scheduleMap = new Map(
        commissionSchedules.map(s => [
          s.opportunityId,
          { isResolved: s.isResolved, resolvedAt: s.resolvedAt },
        ])
      );

      return {
        user,
        commissions,
        commissionValues: commissionValues, // Add this for consistency
        commissionValueMap: Object.fromEntries(commissionValueMap),
        scheduleMap: Object.fromEntries(scheduleMap),
        projects: {
          clientAcquisition: [...clientAcquisitionMNA, ...clientAcquisitionRE],
          clientOriginator: [...clientOriginatorMNA, ...clientOriginatorRE],
          accountManager: [...accountManagerMNA, ...accountManagerRE],
          dealSupport: [...dealSupportMNA, ...dealSupportRE],
        },
      };
    }),

  // Get summary of all employees with commission data (admin overview)
  getEmployeeSummary: adminProcedure.query(async () => {
    // Get all team members and admins
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.TEAM, Role.ADMIN],
        },
        disabled: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Get commission counts and project counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const commissionCount = await prisma.commission.count({
          where: { userId: user.id },
        });

        // Get all commission values for this user
        const commissionValues = await prisma.commissionValue.findMany({
          where: {
            commission: {
              userId: user.id,
            },
            totalCommissionValue: { not: null },
          },
          select: {
            totalCommissionValue: true,
          },
        });

        // For now, all commissions are considered "received" since there's no tracking of pending payments
        // Total received = sum of all commission values
        const totalReceived = commissionValues.reduce(
          (sum, cv) => sum + (cv.totalCommissionValue || 0),
          0
        );

        // Yet to receive is 0 for now (will be implemented later with payment tracking)
        const totalYetToReceive = 0;

        return {
          ...user,
          commissionCount,
          totalReceived,
          totalYetToReceive,
        };
      })
    );

    return usersWithStats;
  }),

  // Update commission percentage (admin only)
  updateCommission: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        roleType: z.nativeEnum(CommissionRole),
        commissionPercentage: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input }) => {
      // Check if user exists and is team/admin
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: { role: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (user.role !== Role.TEAM && user.role !== Role.ADMIN) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Commissions can only be set for team members or admins",
        });
      }

      // Upsert the commission
      const commission = await prisma.commission.upsert({
        where: {
          userId_roleType: {
            userId: input.userId,
            roleType: input.roleType,
          },
        },
        create: {
          userId: input.userId,
          roleType: input.roleType,
          commissionPercentage: input.commissionPercentage,
        },
        update: {
          commissionPercentage: input.commissionPercentage,
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
      });

      return commission;
    }),

  // Get all team members for commission setup
  getTeamMembers: adminProcedure.query(async () => {
    const teamMembers = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.TEAM, Role.ADMIN],
        },
        disabled: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        commissions: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return teamMembers;
  }),

  // Get commission detail for a specific commission value
  // Now only retrieves existing data - no auto-creation
  getCommissionDetail: protectedProcedure
    .input(z.object({ 
      commissionValueId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const commissionValue = await prisma.commissionValue.findUnique({
        where: { id: input.commissionValueId },
        include: {
          commission: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          payments: {
            orderBy: {
              installmentNumber: "asc",
            },
          },
        },
      });

      if (!commissionValue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Commission value not found",
        });
      }

      // Check authorization: user must be admin or the commission owner
      const user = await prisma.user.findUnique({
        where: { id: ctx.auth.user.id },
        select: { role: true },
      });

      const isAdmin = user?.role === Role.ADMIN;
      const isOwner = commissionValue.commission.userId === ctx.auth.user.id;

      if (!isAdmin && !isOwner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this commission",
        });
      }

      // Fetch the opportunity details
      let opportunityDetails: {
        name: string;
        status: OpportunityStatus;
        finalAmount?: number | null;
        commissionableAmount?: number | null;
      } | null = null;

      if (commissionValue.opportunityType === "MNA") {
        const opportunity = await prisma.mergerAndAcquisition.findUnique({
          where: { id: commissionValue.opportunityId },
          select: {
            name: true,
            status: true,
            analytics: {
              select: {
                final_amount: true,
                commissionable_amount: true,
              },
            },
          },
        });

        if (opportunity) {
          opportunityDetails = {
            name: opportunity.name,
            status: opportunity.status,
            finalAmount: opportunity.analytics?.final_amount,
            commissionableAmount: opportunity.analytics?.commissionable_amount,
          };
        }
      } else if (commissionValue.opportunityType === "REAL_ESTATE") {
        const opportunity = await prisma.realEstate.findUnique({
          where: { id: commissionValue.opportunityId },
          select: {
            name: true,
            status: true,
            analytics: {
              select: {
                final_amount: true,
                commissionable_amount: true,
              },
            },
          },
        });

        if (opportunity) {
          opportunityDetails = {
            name: opportunity.name,
            status: opportunity.status,
            finalAmount: opportunity.analytics?.final_amount,
            commissionableAmount: opportunity.analytics?.commissionable_amount,
          };
        }
      }

      // Fetch all project commissions for this user on this specific project
      const allProjectCommissions = await prisma.commissionValue.findMany({
        where: {
          opportunityId: commissionValue.opportunityId,
          opportunityType: commissionValue.opportunityType,
          commission: {
            userId: commissionValue.commission.userId,
          },
        },
        include: {
          commission: {
            select: {
              roleType: true,
              commissionPercentage: true,
            },
          },
          payments: {
            orderBy: {
              installmentNumber: "asc",
            },
          },
        },
      });

      // Calculate effective percentage for each commission to detect halved commissions
      const commissionableAmount = opportunityDetails?.commissionableAmount ?? 0;
      const allProjectCommissionsWithEffective = allProjectCommissions.map(cv => {
        const effectivePercentage = commissionableAmount > 0 && cv.totalCommissionValue
          ? (cv.totalCommissionValue / commissionableAmount) * 100
          : cv.commission.commissionPercentage;
        const isHalved = cv.commission.commissionPercentage > 0 && 
          Math.abs(effectivePercentage - cv.commission.commissionPercentage / 2) < 0.01;
        return {
          ...cv,
          effectivePercentage,
          isHalved,
        };
      });

      return {
        ...commissionValue,
        opportunity: opportunityDetails,
        isAdmin,
        allProjectCommissions: allProjectCommissionsWithEffective,
      };
    }),

  // Update payment schedule (admin only)
  updatePaymentSchedule: adminProcedure
    .input(
      z.object({
        commissionValueId: z.string(),
        payments: z.array(
          z.object({
            installmentNumber: z.number().int().min(1).max(3),
            paymentDate: z.date().nullable(),
            paymentAmount: z.number().min(0).nullable(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Validate that commission value exists
      const commissionValue = await prisma.commissionValue.findUnique({
        where: { id: input.commissionValueId },
      });

      if (!commissionValue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Commission value not found",
        });
      }

      // Update or create payment records
      const updatedPayments = await Promise.all(
        input.payments.map(async (payment) => {
          return await prisma.commissionPayment.upsert({
            where: {
              commissionValueId_installmentNumber: {
                commissionValueId: input.commissionValueId,
                installmentNumber: payment.installmentNumber,
              },
            },
            create: {
              commissionValueId: input.commissionValueId,
              installmentNumber: payment.installmentNumber,
              paymentDate: payment.paymentDate,
              paymentAmount: payment.paymentAmount,
            },
            update: {
              paymentDate: payment.paymentDate,
              paymentAmount: payment.paymentAmount,
            },
          });
        })
      );

      return updatedPayments;
    }),

  // Update payment status (mark as paid/unpaid) - admin only
  updatePaymentStatus: adminProcedure
    .input(
      z.object({
        paymentId: z.string(),
        isPaid: z.boolean(),
        paidAt: z.date().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { paymentId, isPaid, paidAt } = input;

      // Validate that payment exists
      const payment = await prisma.commissionPayment.findUnique({
        where: { id: paymentId },
        select: { paymentDate: true },
      });

      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment not found",
        });
      }

      // Update payment status
      const updatedPayment = await prisma.commissionPayment.update({
        where: { id: paymentId },
        data: {
          isPaid,
          // If marking as paid and no custom paidAt provided, use the scheduled paymentDate
          // If marking as unpaid, set paidAt to null
          paidAt: isPaid 
            ? (paidAt ?? payment.paymentDate) 
            : null,
        },
      });

      return updatedPayment;
    }),

  // Recalculate commissions for a specific opportunity (admin only)
  recalculateCommissions: adminProcedure
    .input(
      z.object({
        opportunityId: z.string(),
        opportunityType: z.nativeEnum(OpportunityType),
      })
    )
    .mutation(async ({ input }) => {
      // Validate that the opportunity exists
      if (input.opportunityType === OpportunityType.MNA) {
        const opportunity = await prisma.mergerAndAcquisition.findUnique({
          where: { id: input.opportunityId },
          select: { id: true, name: true, status: true },
        });

        if (!opportunity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "M&A opportunity not found",
          });
        }
      } else {
        const opportunity = await prisma.realEstate.findUnique({
          where: { id: input.opportunityId },
          select: { id: true, name: true, status: true },
        });

        if (!opportunity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Real Estate opportunity not found",
          });
        }
      }

      // Trigger recalculation
      const results = await calculateOpportunityCommissions({
        opportunityId: input.opportunityId,
        opportunityType: input.opportunityType,
      });

      return {
        success: true,
        calculatedCommissions: results?.length || 0,
      };
    }),

  // Get commission preview for an opportunity (admin only - doesn't save to DB)
  getCommissionPreview: adminProcedure
    .input(
      z.object({
        opportunityId: z.string(),
        opportunityType: z.nativeEnum(OpportunityType).optional(),
      })
    )
    .query(async ({ input }) => {
      const { opportunityId } = input;

      // Auto-detect opportunity type by querying both tables
      let opportunity: any;
      let analytics: any;

      const opportunitySelect = {
        id: true,
        name: true,
        status: true,
        clientAcquisitionerId: true,
        clientAcquisitioner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        clientOriginatorId: true,
        clientOriginator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        analytics: {
          select: {
            id: true,
            commissionable_amount: true,
            final_amount: true,
            invested_person_id: true,
            followup_person_id: true,
            invested_person: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            followup_person: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      };

      // Try MNA first
      const mnaOpportunity = await prisma.mergerAndAcquisition.findUnique({
        where: { id: opportunityId },
        select: opportunitySelect,
      });

      let detectedOpportunityType: OpportunityType;

      if (mnaOpportunity) {
        opportunity = mnaOpportunity;
        analytics = opportunity.analytics;
        detectedOpportunityType = OpportunityType.MNA;
      } else {
        // Try REAL_ESTATE
        const reOpportunity = await prisma.realEstate.findUnique({
          where: { id: opportunityId },
          select: opportunitySelect,
        });

        if (reOpportunity) {
          opportunity = reOpportunity;
          analytics = opportunity.analytics;
          detectedOpportunityType = OpportunityType.REAL_ESTATE;
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Opportunity not found with ID: ${opportunityId}. Searched in both MNA and Real Estate tables.`,
          });
        }
      }

      if (!opportunity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Opportunity not found with ID: ${opportunityId}. Searched in both MNA and Real Estate tables.`,
        });
      }

      if (!analytics) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Opportunity "${opportunity.name}" has no analytics record. Please ensure analytics are properly configured.`,
        });
      }

      if (analytics.commissionable_amount == null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Opportunity "${opportunity.name}" has no commissionable amount set. Current final amount: ${analytics.final_amount ?? 'not set'}. Please configure the commissionable amount in opportunity analytics.`,
        });
      }

      const commissionableAmount = analytics.commissionable_amount;

      // Calculate commissions for each role
      const commissionRecipients: Array<{
        userId: string;
        userName: string;
        userEmail: string;
        roleType: CommissionRole;
        commissionPercentage: number;
        calculatedAmount: number;
      }> = [];

      // Client Acquisitioner (Angariação do Cliente)
      if (opportunity.clientAcquisitionerId && opportunity.clientAcquisitioner) {
        const commission = await prisma.commission.findUnique({
          where: {
            userId_roleType: {
              userId: opportunity.clientAcquisitionerId,
              roleType: CommissionRole.CLIENT_ACQUISITION,
            },
          },
        });

        // Include recipient even if commission percentage is 0 or not configured
        // This allows admins to see all role assignments and configure percentages
        const percentage = commission?.commissionPercentage ?? 0;
        commissionRecipients.push({
          userId: opportunity.clientAcquisitioner.id,
          userName: opportunity.clientAcquisitioner.name,
          userEmail: opportunity.clientAcquisitioner.email,
          roleType: CommissionRole.CLIENT_ACQUISITION,
          commissionPercentage: percentage,
          calculatedAmount: (commissionableAmount * percentage) / 100,
        });
      }

      // Client Originator (Angariação do Investidor)
      if (opportunity.clientOriginatorId && opportunity.clientOriginator) {
        const commission = await prisma.commission.findUnique({
          where: {
            userId_roleType: {
              userId: opportunity.clientOriginatorId,
              roleType: CommissionRole.CLIENT_ORIGINATOR,
            },
          },
        });

        // Include recipient even if commission percentage is 0 or not configured
        // This allows admins to see all role assignments and configure percentages
        const percentage = commission?.commissionPercentage ?? 0;
        commissionRecipients.push({
          userId: opportunity.clientOriginator.id,
          userName: opportunity.clientOriginator.name,
          userEmail: opportunity.clientOriginator.email,
          roleType: CommissionRole.CLIENT_ORIGINATOR,
          commissionPercentage: percentage,
          calculatedAmount: (commissionableAmount * percentage) / 100,
        });
      }

      // Account Managers
      const accountManagers = await prisma.opportunityAccountManager.findMany({
        where: {
          opportunityId,
          opportunityType: detectedOpportunityType,
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
      });

      const accountManagerCount = accountManagers.length;

      for (const manager of accountManagers) {
        const commission = await prisma.commission.findUnique({
          where: {
            userId_roleType: {
              userId: manager.userId,
              roleType: CommissionRole.ACCOUNT_MANAGER,
            },
          },
        });

        // Include recipient even if commission percentage is 0 or not configured
        // This allows admins to see all role assignments and configure percentages
        const basePercentage = commission?.commissionPercentage ?? 0;
        const adjustedPercentage =
          accountManagerCount === 2
            ? basePercentage / 2
            : basePercentage;

        commissionRecipients.push({
          userId: manager.user.id,
          userName: manager.user.name,
          userEmail: manager.user.email,
          roleType: CommissionRole.ACCOUNT_MANAGER,
          commissionPercentage: adjustedPercentage,
          calculatedAmount: (commissionableAmount * adjustedPercentage) / 100,
        });
      }

      // Deal Support - "Acompanhamento do Investidor" role
      // IMPORTANT: Only followup_person gets the DEAL_SUPPORT commission.
      // invested_person is the investor who bought/invested - NOT a commission role.
      // This ensures exactly 1 person per role as per commission system rules.
      if (analytics.followup_person) {
        const user = analytics.followup_person;
        const commission = await prisma.commission.findUnique({
          where: {
            userId_roleType: {
              userId: user.id,
              roleType: CommissionRole.DEAL_SUPPORT,
            },
          },
        });

        // Include recipient even if commission percentage is 0 or not configured
        // This allows admins to see all role assignments and configure percentages
        const percentage = commission?.commissionPercentage ?? 0;
        commissionRecipients.push({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          roleType: CommissionRole.DEAL_SUPPORT,
          commissionPercentage: percentage,
          calculatedAmount: (commissionableAmount * percentage) / 100,
        });
      }

      // Check if already resolved
      const existingSchedule = await prisma.opportunityCommissionSchedule.findUnique({
        where: {
          opportunityId_opportunityType: {
            opportunityId,
            opportunityType: detectedOpportunityType,
          },
        },
        include: {
          paymentPlans: {
            orderBy: {
              installmentNumber: "asc",
            },
          },
        },
      });

      return {
        opportunity: {
          id: opportunity.id,
          name: opportunity.name,
          status: opportunity.status,
          finalAmount: analytics.final_amount,
          commissionableAmount: analytics.commissionable_amount,
        },
        recipients: commissionRecipients,
        isResolved: existingSchedule?.isResolved || false,
        existingSchedule: existingSchedule || null,
      };
    }),

  // Get commission payments for an opportunity (admin only - for payment tracking)
  getOpportunityCommissionPayments: adminProcedure
    .input(
      z.object({
        opportunityId: z.string(),
        opportunityType: z.nativeEnum(OpportunityType).optional(),
      })
    )
    .query(async ({ input }) => {
      const { opportunityId } = input;

      // Auto-detect opportunity type by checking both tables
      let detectedOpportunityType: OpportunityType | null = null;

      const mnaExists = await prisma.mergerAndAcquisition.findUnique({
        where: { id: opportunityId },
        select: { id: true },
      });

      if (mnaExists) {
        detectedOpportunityType = OpportunityType.MNA;
      } else {
        const reExists = await prisma.realEstate.findUnique({
          where: { id: opportunityId },
          select: { id: true },
        });

        if (reExists) {
          detectedOpportunityType = OpportunityType.REAL_ESTATE;
        }
      }

      if (!detectedOpportunityType) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Opportunity not found with ID: ${opportunityId}`,
        });
      }

      // Get all commission values for this opportunity
      const commissionValues = await prisma.commissionValue.findMany({
        where: {
          opportunityId,
          opportunityType: detectedOpportunityType,
        },
        include: {
          commission: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          payments: {
            orderBy: {
              installmentNumber: "asc",
            },
          },
        },
      });

      return commissionValues;
    }),

  // Get opportunities pending commission resolution (admin only)
  getPendingCommissions: adminProcedure.query(async () => {
    // Get all M&A opportunities with CONCLUDED status (excluding INACTIVE)
    const mnaOpportunities = await prisma.mergerAndAcquisition.findMany({
      where: {
        status: OpportunityStatus.CONCLUDED,
        analytics: {
          commissionable_amount: { not: null, gt: 0 },
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    // Get all Real Estate opportunities with CONCLUDED status (excluding INACTIVE)
    const realEstateOpportunities = await prisma.realEstate.findMany({
      where: {
        status: OpportunityStatus.CONCLUDED,
        analytics: {
          commissionable_amount: { not: null, gt: 0 },
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
        analytics: {
          select: {
            final_amount: true,
            commissionable_amount: true,
          },
        },
      },
    });

    // Get all resolved commission schedules
    const resolvedSchedules = await prisma.opportunityCommissionSchedule.findMany({
      where: {
        isResolved: true,
      },
      select: {
        opportunityId: true,
        opportunityType: true,
      },
    });

    // Filter out opportunities that already have resolved commissions
    const resolvedSet = new Set(
      resolvedSchedules.map((s) => `${s.opportunityId}-${s.opportunityType}`)
    );

    const pendingMNA = mnaOpportunities
      .filter((opp) => !resolvedSet.has(`${opp.id}-MNA`))
      .map((opp) => ({
        id: opp.id,
        name: opp.name,
        type: "MNA" as const,
        status: opp.status,
        finalAmount: opp.analytics?.final_amount,
        commissionableAmount: opp.analytics?.commissionable_amount,
      }));

    const pendingRealEstate = realEstateOpportunities
      .filter((opp) => !resolvedSet.has(`${opp.id}-REAL_ESTATE`))
      .map((opp) => ({
        id: opp.id,
        name: opp.name,
        type: "REAL_ESTATE" as const,
        status: opp.status,
        finalAmount: opp.analytics?.final_amount,
        commissionableAmount: opp.analytics?.commissionable_amount,
      }));

    return [...pendingMNA, ...pendingRealEstate].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }),

  // Get all resolved commission schedules (admin only)
  getAllResolvedCommissions: adminProcedure.query(async () => {
    const schedules = await prisma.opportunityCommissionSchedule.findMany({
      where: {
        isResolved: true,
      },
      include: {
        paymentPlans: {
          orderBy: {
            installmentNumber: "asc",
          },
        },
      },
      orderBy: {
        resolvedAt: "desc",
      },
    });

    // Fetch opportunity details for each schedule
    const schedulesWithDetails = await Promise.all(
      schedules.map(async (schedule) => {
        let opportunityDetails: {
          name: string;
          status: string;
          finalAmount?: number | null;
          commissionableAmount?: number | null;
        } | null = null;

        if (schedule.opportunityType === "MNA") {
          const opportunity = await prisma.mergerAndAcquisition.findUnique({
            where: { id: schedule.opportunityId },
            select: {
              name: true,
              status: true,
              analytics: {
                select: {
                  final_amount: true,
                  commissionable_amount: true,
                },
              },
            },
          });

          if (opportunity) {
            opportunityDetails = {
              name: opportunity.name,
              status: opportunity.status,
              finalAmount: opportunity.analytics?.final_amount,
              commissionableAmount: opportunity.analytics?.commissionable_amount,
            };
          }
        } else {
          const opportunity = await prisma.realEstate.findUnique({
            where: { id: schedule.opportunityId },
            select: {
              name: true,
              status: true,
              analytics: {
                select: {
                  final_amount: true,
                  commissionable_amount: true,
                },
              },
            },
          });

          if (opportunity) {
            opportunityDetails = {
              name: opportunity.name,
              status: opportunity.status,
              finalAmount: opportunity.analytics?.final_amount,
              commissionableAmount: opportunity.analytics?.commissionable_amount,
            };
          }
        }

        // Get commission values count for this opportunity
        const commissionValuesCount = await prisma.commissionValue.count({
          where: {
            opportunityId: schedule.opportunityId,
            opportunityType: schedule.opportunityType,
            totalCommissionValue: { not: null },
          },
        });

        // Get all payments for this opportunity to check payment status
        const allPayments = await prisma.commissionPayment.findMany({
          where: {
            commissionValue: {
              opportunityId: schedule.opportunityId,
              opportunityType: schedule.opportunityType,
            },
          },
          select: {
            isPaid: true,
            paymentAmount: true,
          },
        });

        // Calculate payment statistics
        const totalPaid = allPayments
          .filter(p => p.isPaid)
          .reduce((sum, p) => sum + (p.paymentAmount ?? 0), 0);

        const totalAmount = allPayments
          .reduce((sum, p) => sum + (p.paymentAmount ?? 0), 0);

        const allPaymentsPaid = allPayments.length > 0 && allPayments.every(p => p.isPaid);
        const hasUnpaidPayments = allPayments.some(p => !p.isPaid);

        return {
          ...schedule,
          opportunity: opportunityDetails,
          recipientsCount: commissionValuesCount,
          paymentStatus: {
            allPaid: allPaymentsPaid,
            hasUnpaid: hasUnpaidPayments,
            totalPaid,
            totalAmount,
          },
        };
      })
    );

    return schedulesWithDetails.filter((s) => s.opportunity !== null);
  }),

  // Resolve commissions for an opportunity (admin only - saves to DB)
  resolveCommissions: adminProcedure
    .input(
      z.object({
        opportunityId: z.string(),
        opportunityType: z.nativeEnum(OpportunityType).optional(), // Optional - will auto-detect if not provided
        paymentPlan: z.array(
          z.object({
            installmentNumber: z.number().int().min(1),
            percentage: z.number().min(0).max(100),
            paymentDate: z.date(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { opportunityId, paymentPlan } = input;
      let opportunityType = input.opportunityType;

      // Validate percentages sum to 100
      const totalPercentage = paymentPlan.reduce((sum, p) => sum + p.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Payment plan percentages must sum to 100% (currently ${totalPercentage}%)`,
        });
      }

      // Get commission preview (validates opportunity and calculates commissions)
      const preview = await prisma.$transaction(async (tx) => {
        // Get the opportunity - auto-detect type if not provided
        let opportunity: any;
        let analytics: any;
        let detectedOpportunityType: OpportunityType;

        // Try MNA first
        const mnaOpportunity = await tx.mergerAndAcquisition.findUnique({
          where: { id: opportunityId },
          select: {
            id: true,
            name: true,
            status: true,
            clientAcquisitionerId: true,
            clientOriginatorId: true,
            analytics: {
              select: {
                commissionable_amount: true,
                invested_person_id: true,
                followup_person_id: true,
              },
            },
          },
        });

        if (mnaOpportunity) {
          opportunity = mnaOpportunity;
          analytics = opportunity.analytics;
          detectedOpportunityType = OpportunityType.MNA;
        } else {
          // Try Real Estate
          const reOpportunity = await tx.realEstate.findUnique({
            where: { id: opportunityId },
            select: {
              id: true,
              name: true,
              status: true,
              clientAcquisitionerId: true,
              clientOriginatorId: true,
              analytics: {
                select: {
                  commissionable_amount: true,
                  invested_person_id: true,
                  followup_person_id: true,
                },
              },
            },
          });

          if (reOpportunity) {
            opportunity = reOpportunity;
            analytics = opportunity.analytics;
            detectedOpportunityType = OpportunityType.REAL_ESTATE;
          } else {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Opportunity not found with ID: ${opportunityId}. Searched in both MNA and Real Estate tables.`,
            });
          }
        }

        // Use detected type if not provided
        if (!opportunityType) {
          opportunityType = detectedOpportunityType;
        }

        if (!analytics?.commissionable_amount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Opportunity "${opportunity.name}" has no commissionable amount set. Please go to "Close Opportunities" and set the "Commissionable Amount" field before resolving commissions.`,
          });
        }

        const commissionableAmount = analytics.commissionable_amount;

        // Calculate commission recipients
        // Include recipients even if their commission percentage is 0 or not configured
        // This allows admins to see all role assignments and configure percentages later
        const recipients: Array<{
          userId: string;
          roleType: CommissionRole;
          percentage: number;
          totalValue: number;
        }> = [];

        // Client Acquisitioner (Angariação do Cliente)
        if (opportunity.clientAcquisitionerId) {
          const commission = await tx.commission.findUnique({
            where: {
              userId_roleType: {
                userId: opportunity.clientAcquisitionerId,
                roleType: CommissionRole.CLIENT_ACQUISITION,
              },
            },
          });

          const percentage = commission?.commissionPercentage ?? 0;
          recipients.push({
            userId: opportunity.clientAcquisitionerId,
            roleType: CommissionRole.CLIENT_ACQUISITION,
            percentage: percentage,
            totalValue: (commissionableAmount * percentage) / 100,
          });
        }

        // Client Originator (Angariação do Investidor)
        if (opportunity.clientOriginatorId) {
          const commission = await tx.commission.findUnique({
            where: {
              userId_roleType: {
                userId: opportunity.clientOriginatorId,
                roleType: CommissionRole.CLIENT_ORIGINATOR,
              },
            },
          });

          const percentage = commission?.commissionPercentage ?? 0;
          recipients.push({
            userId: opportunity.clientOriginatorId,
            roleType: CommissionRole.CLIENT_ORIGINATOR,
            percentage: percentage,
            totalValue: (commissionableAmount * percentage) / 100,
          });
        }

        // Account Managers (Acompanhamento do Cliente)
        const accountManagers = await tx.opportunityAccountManager.findMany({
          where: { opportunityId, opportunityType: detectedOpportunityType },
        });

        const accountManagerCount = accountManagers.length;

        for (const manager of accountManagers) {
          const commission = await tx.commission.findUnique({
            where: {
              userId_roleType: {
                userId: manager.userId,
                roleType: CommissionRole.ACCOUNT_MANAGER,
              },
            },
          });

          const basePercentage = commission?.commissionPercentage ?? 0;
          const adjustedPercentage =
            accountManagerCount === 2
              ? basePercentage / 2
              : basePercentage;

          recipients.push({
            userId: manager.userId,
            roleType: CommissionRole.ACCOUNT_MANAGER,
            percentage: adjustedPercentage,
            totalValue: (commissionableAmount * adjustedPercentage) / 100,
          });
        }

        // Deal Support - "Acompanhamento do Investidor" role
        // IMPORTANT: Only followup_person gets the DEAL_SUPPORT commission.
        // invested_person is the investor who bought/invested - NOT a commission role.
        // This ensures exactly 1 person per role as per commission system rules.
        if (analytics.followup_person_id) {
          const userId = analytics.followup_person_id;
          const commission = await tx.commission.findUnique({
            where: {
              userId_roleType: {
                userId,
                roleType: CommissionRole.DEAL_SUPPORT,
              },
            },
          });

          const percentage = commission?.commissionPercentage ?? 0;
          recipients.push({
            userId,
            roleType: CommissionRole.DEAL_SUPPORT,
            percentage: percentage,
            totalValue: (commissionableAmount * percentage) / 100,
          });
        }

        // Create or update schedule
        const schedule = await tx.opportunityCommissionSchedule.upsert({
          where: {
            opportunityId_opportunityType: {
              opportunityId,
              opportunityType: detectedOpportunityType,
            },
          },
          create: {
            opportunityId,
            opportunityType: detectedOpportunityType,
            isResolved: true,
            resolvedAt: new Date(),
            resolvedBy: ctx.auth.user.id,
          },
          update: {
            isResolved: true,
            resolvedAt: new Date(),
            resolvedBy: ctx.auth.user.id,
          },
        });

        // Delete existing payment plans
        await tx.opportunityPaymentPlan.deleteMany({
          where: { scheduleId: schedule.id },
        });

        // Create new payment plans
        await tx.opportunityPaymentPlan.createMany({
          data: paymentPlan.map((plan) => ({
            scheduleId: schedule.id,
            installmentNumber: plan.installmentNumber,
            percentage: plan.percentage,
            paymentDate: plan.paymentDate,
          })),
        });

        // Create or update commission values and payments for each recipient
        for (const recipient of recipients) {
          // Get or create commission record
          const commission = await tx.commission.upsert({
            where: {
              userId_roleType: {
                userId: recipient.userId,
                roleType: recipient.roleType,
              },
            },
            create: {
              userId: recipient.userId,
              roleType: recipient.roleType,
              commissionPercentage: recipient.percentage,
            },
            update: {},
          });

          // Create or update commission value
          const commissionValue = await tx.commissionValue.upsert({
            where: {
              opportunityId_opportunityType_commissionId: {
                opportunityId,
                opportunityType: detectedOpportunityType,
                commissionId: commission.id,
              },
            },
            create: {
              opportunityId,
              opportunityType: detectedOpportunityType,
              commissionId: commission.id,
              totalCommissionValue: recipient.totalValue,
            },
            update: {
              totalCommissionValue: recipient.totalValue,
            },
          });

          // Delete existing payments
          await tx.commissionPayment.deleteMany({
            where: { commissionValueId: commissionValue.id },
          });

          // Create payment records based on payment plan
          await tx.commissionPayment.createMany({
            data: paymentPlan.map((plan) => ({
              commissionValueId: commissionValue.id,
              installmentNumber: plan.installmentNumber,
              percentage: plan.percentage,
              paymentDate: plan.paymentDate,
              paymentAmount: (recipient.totalValue * plan.percentage) / 100,
              isPaid: false,
            })),
          });
        }

        return { schedule, recipients };
      });

      // Notify recipients about their commission resolution
      const recipientUserIds = preview.recipients.map((r) => r.userId);
      const oppType = preview.schedule.opportunityType;

      // Get opportunity name for notification message
      let oppName = "opportunity";
      if (oppType === OpportunityType.MNA) {
        const opp = await prisma.mergerAndAcquisition.findUnique({
          where: { id: opportunityId },
          select: { name: true },
        });
        if (opp) oppName = opp.name;
      } else {
        const opp = await prisma.realEstate.findUnique({
          where: { id: opportunityId },
          select: { name: true },
        });
        if (opp) oppName = opp.name;
      }

      await createNotifications(
        recipientUserIds.map((userId) => ({
          userId,
          type: NotificationType.COMMISSION_RESOLVED,
          title: "Commission resolved",
          message: `Commissions for "${oppName}" have been resolved. Check your commission details.`,
          opportunityId,
          opportunityType: oppType,
        }))
      );

      return {
        success: true,
        scheduleId: preview.schedule.id,
        recipientsProcessed: preview.recipients.length,
      };
    }),
});
