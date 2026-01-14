import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CommissionRole, Role, OpportunityStatus, OpportunityType } from "@/generated/prisma";
import prisma from "@/lib/db";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { calculateOpportunityCommissions } from "./calculations";

export const commissionsRouter = createTRPCRouter({
  // Get commissions for the current logged-in user (team member view)
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
          include: {
            payments: true,
          },
        },
      },
    });

    // Fetch assignments where user is client acquisitioner
    const clientAcquisitionMNA = await prisma.mergerAndAcquisition.findMany({
      where: {
        clientAcquisitionerId: userId,
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
        clientAcquisitionerId: userId,
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

    // Fetch assignments where user is account manager
    const accountManagerAssignments = await prisma.opportunityAccountManager.findMany({
      where: { userId },
      select: {
        opportunityId: true,
        opportunityType: true,
      },
    });

    // Fetch the actual opportunities for account manager role
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
      ...accountManagerMNA.map(p => p.id),
      ...accountManagerRE.map(p => p.id),
      ...dealSupportMNA.map(p => p.id),
      ...dealSupportRE.map(p => p.id),
    ];

    const commissionValues = await prisma.commissionValue.findMany({
      where: {
        opportunityId: { in: allOpportunityIds },
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

    // Create a map for easy lookup: `${opportunityId}-${roleType}` -> commissionValue
    const commissionValueMap = new Map(
      commissionValues.map(cv => [
        `${cv.opportunityId}-${cv.commission.roleType}`,
        cv.totalCommissionValue,
      ])
    );

    return {
      commissions,
      commissionValues: commissions.flatMap((c) => c.commissionValues),
      commissionValueMap: Object.fromEntries(commissionValueMap),
      projects: {
        clientAcquisition: [...clientAcquisitionMNA, ...clientAcquisitionRE],
        accountManager: [...accountManagerMNA, ...accountManagerRE],
        dealSupport: [...dealSupportMNA, ...dealSupportRE],
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
        ...accountManagerMNA.map(p => p.id),
        ...accountManagerRE.map(p => p.id),
        ...dealSupportMNA.map(p => p.id),
        ...dealSupportRE.map(p => p.id),
      ];

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

      return {
        user,
        commissions,
        commissionValueMap: Object.fromEntries(commissionValueMap),
        projects: {
          clientAcquisition: [...clientAcquisitionMNA, ...clientAcquisitionRE],
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

        // Count client acquisition projects
        const clientAcqCount = await Promise.all([
          prisma.mergerAndAcquisition.count({
            where: {
              clientAcquisitionerId: user.id,
              status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
            },
          }),
          prisma.realEstate.count({
            where: {
              clientAcquisitionerId: user.id,
              status: { in: [OpportunityStatus.ACTIVE, OpportunityStatus.CONCLUDED] },
            },
          }),
        ]);

        // Count account manager projects
        const accountManagerAssignments = await prisma.opportunityAccountManager.count({
          where: { userId: user.id },
        });

        const totalProjects =
          clientAcqCount[0] + clientAcqCount[1] + accountManagerAssignments;

        return {
          ...user,
          commissionCount,
          totalProjects,
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
  getCommissionDetail: protectedProcedure
    .input(z.object({ 
      commissionValueId: z.string().optional(),
      opportunityId: z.string().optional(),
      commissionId: z.string().optional(),
      roleType: z.string().optional(),
      userId: z.string().optional(),
    }))
    .query(async ({ ctx, input }: { ctx: any; input: { commissionValueId?: string; opportunityId?: string; commissionId?: string; roleType?: string; userId?: string } }) => {
      let commissionValue;
      
      // If commissionValueId provided, use it directly
      if (input.commissionValueId) {
        commissionValue = await prisma.commissionValue.findUnique({
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
      }
      // Otherwise, find or create based on opportunityId and commissionId
      else if (input.opportunityId && input.commissionId) {
        // Handle special case: commission doesn't exist yet, create it on-the-fly
        if (input.commissionId === 'create' && input.roleType && input.userId) {
          // First check if user is admin
          const currentUser = await prisma.user.findUnique({
            where: { id: ctx.auth.user.id },
            select: { role: true },
          });

          if (currentUser?.role !== Role.ADMIN) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Only admins can create commissions",
            });
          }

          // Create the commission if it doesn't exist
          const commission = await prisma.commission.upsert({
            where: {
              userId_roleType: {
                userId: input.userId,
                roleType: input.roleType as CommissionRole,
              },
            },
            create: {
              userId: input.userId,
              roleType: input.roleType as CommissionRole,
              commissionPercentage: 0,
            },
            update: {},
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

          // Determine opportunity type
          let opportunityType: "MNA" | "REAL_ESTATE" | null = null;
          const mnaExists = await prisma.mergerAndAcquisition.findUnique({
            where: { id: input.opportunityId },
          });
          if (mnaExists) {
            opportunityType = "MNA";
          } else {
            const reExists = await prisma.realEstate.findUnique({
              where: { id: input.opportunityId },
            });
            if (reExists) {
              opportunityType = "REAL_ESTATE";
            }
          }

          if (!opportunityType) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Opportunity not found",
            });
          }

          // Create or find CommissionValue
          commissionValue = await prisma.commissionValue.findFirst({
            where: {
              opportunityId: input.opportunityId,
              opportunityType: opportunityType,
              commissionId: commission.id,
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

          if (!commissionValue) {
            commissionValue = await prisma.commissionValue.create({
              data: {
                opportunityId: input.opportunityId,
                opportunityType: opportunityType,
                commissionId: commission.id,
                totalCommissionValue: null,
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
          }
        } else {
          // Normal flow: commission ID is provided
        const commission = await prisma.commission.findUnique({
          where: { id: input.commissionId },
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

        if (!commission) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Commission not found",
          });
        }

        // Determine opportunity type by checking both tables
        let opportunityType: "MNA" | "REAL_ESTATE" | null = null;
        const mnaExists = await prisma.mergerAndAcquisition.findUnique({
          where: { id: input.opportunityId },
        });
        if (mnaExists) {
          opportunityType = "MNA";
        } else {
          const reExists = await prisma.realEstate.findUnique({
            where: { id: input.opportunityId },
          });
          if (reExists) {
            opportunityType = "REAL_ESTATE";
          }
        }

        if (!opportunityType) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Opportunity not found",
          });
        }

        // Find or create CommissionValue
        commissionValue = await prisma.commissionValue.findFirst({
          where: {
            opportunityId: input.opportunityId,
            opportunityType: opportunityType,
            commissionId: input.commissionId,
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

        // Create if doesn't exist
        if (!commissionValue) {
          commissionValue = await prisma.commissionValue.create({
            data: {
              opportunityId: input.opportunityId,
              opportunityType: opportunityType,
              commissionId: input.commissionId,
              totalCommissionValue: null,
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

          // Note: We no longer create empty payment records here.
          // Payment records will only be created when admin actually sets values.
        }
        }
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either commissionValueId or both opportunityId and commissionId must be provided",
        });
      }

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

      // Fetch the opportunity details based on type
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

      // Fetch all commissions for this user on this project
      const allUserCommissions = await prisma.commission.findMany({
        where: {
          userId: commissionValue.commission.userId,
        },
        select: {
          id: true,
          roleType: true,
          commissionPercentage: true,
        },
      });

      // Check if this user has commission values for other roles on the same project
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
        },
      });

      return {
        ...commissionValue,
        opportunity: opportunityDetails,
        isAdmin,
        allProjectCommissions, // All roles this user has on this specific project
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
});
