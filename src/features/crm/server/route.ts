import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ActivityType, LeadStatus, Role } from "@/generated/prisma";
import prisma from "@/lib/db";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import {
  addNoteSchema,
  assignLeadSchema,
  leadListInputSchema,
  scheduleFollowUpSchema,
  updateLeadStatusSchema,
  type LeadListItem,
  type LeadListResponse,
} from "../types/lead-schemas";

export const leadsRouter = createTRPCRouter({
  // Get paginated list of leads with filters
  getLeads: adminProcedure
    .input(leadListInputSchema)
    .query(async ({ input }): Promise<LeadListResponse> => {
      const {
        page,
        pageSize,
        search,
        leadSource,
        assignedTo,
        department,
        status,
        priorities,
        lastContactDateFrom,
        lastContactDateTo,
        sortBy,
        sortDirection,
      } = input;

      // Build where clause
      const where: any = {
        // Only show users who are investors/clients (not team members or admins)
        role: Role.USER,
      };

      // Apply search filter
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } },
        ];
      }

      // Apply filters
      if (leadSource) {
        where.leadSource = leadSource;
      }

      if (assignedTo) {
        where.OR = [
          { leadResponsibleId: assignedTo },
          { leadMainContactId: assignedTo },
        ];
      }

      if (department) {
        where.department = department;
      }

      if (status) {
        where.leadStatus = status;
      }

      if (priorities && priorities.length > 0) {
        where.leadPriority = { in: priorities };
      }

      if (lastContactDateFrom || lastContactDateTo) {
        where.lastContactDate = {};
        if (lastContactDateFrom) {
          where.lastContactDate.gte = lastContactDateFrom;
        }
        if (lastContactDateTo) {
          where.lastContactDate.lte = lastContactDateTo;
        }
      }

      // Build orderBy clause
      const orderBy: any = {};
      switch (sortBy) {
        case "lastContactDate":
          orderBy.lastContactDate = sortDirection;
          break;
        case "createdAt":
          orderBy.createdAt = sortDirection;
          break;
        case "name":
          orderBy.name = sortDirection;
          break;
        case "minTicketSize":
          orderBy.minTicketSize = sortDirection;
          break;
        case "maxTicketSize":
          orderBy.maxTicketSize = sortDirection;
          break;
        default:
          orderBy.lastContactDate = "desc";
      }

      // Execute queries
      const [items, totalCount] = await Promise.all([
        prisma.user.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy,
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            lastContactDate: true,
            leadStatus: true,
            leadPriority: true,
            leadSource: true,
            department: true,
            minTicketSize: true,
            maxTicketSize: true,
            createdAt: true,
            leadResponsible: {
              select: {
                id: true,
                name: true,
              },
            },
            leadMainContact: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      // Format items to match LeadListItem interface
      const formattedItems: LeadListItem[] = items.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        lastContactDate: user.lastContactDate,
        status: user.leadStatus || LeadStatus.NEW,
        priority: user.leadPriority,
        leadSource: user.leadSource,
        department: user.department,
        minTicketSize: user.minTicketSize,
        maxTicketSize: user.maxTicketSize,
        leadResponsible: user.leadResponsible,
        leadMainContact: user.leadMainContact,
        createdAt: user.createdAt,
      }));

      return {
        items: formattedItems,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),

  // Get single lead details
  getOne: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const lead = await prisma.user.findUnique({
        where: { id: input.id, role: Role.USER },
        include: {
          leadResponsible: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          leadMainContact: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          notes: {
            include: {
              createdByUser: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          lastFollowUps: {
            include: {
              contactedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              personContacted: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              followUpDate: "desc",
            },
          },
          activities: {
            orderBy: {
              createdAt: "desc",
            },
            take: 50,
          },
        },
      });

      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found",
        });
      }

      return lead;
    }),

  // Assign lead to a user
  assign: adminProcedure
    .input(assignLeadSchema)
    .mutation(async ({ input, ctx }) => {
      const { leadId, assignedToId, department } = input;

      // Verify the assigned user exists and is a team member or admin
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser || assignedUser.role === Role.USER) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only assign to team members or admins",
        });
      }

      // Update the lead
      const updatedLead = await prisma.user.update({
        where: { id: leadId, role: Role.USER },
        data: {
          leadResponsibleId: assignedToId,
          department: department || undefined,
          lastContactDate: new Date(),
        },
      });

      // Create activity log
      await prisma.leadActivity.create({
        data: {
          userId: leadId,
          activityType: ActivityType.ASSIGNMENT_CHANGE,
          title: "Lead assigned",
          description: `Lead assigned to ${assignedUser.name}`,
          relatedUserId: assignedToId,
        },
      });

      return updatedLead;
    }),

  // Add note to lead
  addNote: adminProcedure
    .input(addNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const { leadId, note } = input;

      // Verify lead exists
      const lead = await prisma.user.findUnique({
        where: { id: leadId, role: Role.USER },
      });

      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found",
        });
      }

      // Get current user ID from context
      const userId = ctx.auth?.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Create the note
      const newNote = await prisma.userNote.create({
        data: {
          userId: leadId,
          note,
          createdBy: userId,
        },
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Create activity log
      await prisma.leadActivity.create({
        data: {
          userId: leadId,
          activityType: ActivityType.NOTE,
          title: "Note added",
          description: note.substring(0, 100),
        },
      });

      // Update last contact date
      await prisma.user.update({
        where: { id: leadId },
        data: {
          lastContactDate: new Date(),
        },
      });

      return newNote;
    }),

  // Schedule follow-up
  scheduleFollowUp: adminProcedure
    .input(scheduleFollowUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { leadId, followUpDate, note } = input;

      // Verify lead exists
      const lead = await prisma.user.findUnique({
        where: { id: leadId, role: Role.USER },
      });

      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found",
        });
      }

      // Update the lead with follow-up date
      const updatedLead = await prisma.user.update({
        where: { id: leadId },
        data: {
          nextFollowUpDate: followUpDate,
          lastContactDate: new Date(),
        },
      });

      // Create activity log
      await prisma.leadActivity.create({
        data: {
          userId: leadId,
          activityType: ActivityType.FOLLOW_UP_SCHEDULED,
          title: "Follow-up scheduled",
          description: note || `Follow-up scheduled for ${followUpDate.toLocaleDateString()}`,
        },
      });

      // If note is provided, create a note as well
      if (note) {
        const userId = ctx.auth?.user?.id;
        if (userId) {
          await prisma.userNote.create({
            data: {
              userId: leadId,
              note: `Follow-up: ${note}`,
              createdBy: userId,
            },
          });
        }
      }

      return updatedLead;
    }),

  // Update lead status
  updateLeadStatus: adminProcedure
    .input(updateLeadStatusSchema)
    .mutation(async ({ input }) => {
      const { leadId, status, priority } = input;

      const updateData: any = {
        leadStatus: status,
        lastContactDate: new Date(),
      };

      if (priority !== undefined) {
        updateData.leadPriority = priority;
      }

      const updatedLead = await prisma.user.update({
        where: { id: leadId, role: Role.USER },
        data: updateData,
      });

      // Create activity log
      await prisma.leadActivity.create({
        data: {
          userId: leadId,
          activityType: ActivityType.STATUS_CHANGE,
          title: "Status changed",
          description: `Status changed to ${status}`,
        },
      });

      return updatedLead;
    }),

  // Get team members for assignment dropdown
  getTeamMembers: adminProcedure.query(async () => {
    const teamMembers = await prisma.user.findMany({
      where: {
        OR: [{ role: Role.TEAM }, { role: Role.ADMIN }],
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

    return teamMembers;
  }),

  // Last Follow-up endpoints for CRM
  getFollowUps: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return prisma.lastFollowUp.findMany({
        where: { userId: input.userId },
        include: {
          contactedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          personContacted: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { followUpDate: "desc" },
      });
    }),

  addFollowUp: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        followUpDate: z.date(),
        description: z.string().min(1),
        contactedById: z.string(),
        personContactedId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, followUpDate, description, contactedById, personContactedId } = input;

      const newFollowUp = await prisma.lastFollowUp.create({
        data: {
          userId,
          followUpDate,
          description,
          contactedById,
          personContactedId,
        },
        include: {
          contactedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          personContacted: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Update lastContactDate on user
      await prisma.user.update({
        where: { id: userId },
        data: {
          lastContactDate: followUpDate,
        },
      });

      // Create activity log
      await prisma.leadActivity.create({
        data: {
          userId,
          activityType: ActivityType.OTHER,
          title: "Follow-up recorded",
          description: `Follow-up on ${followUpDate.toLocaleDateString()}`,
        },
      });

      return newFollowUp;
    }),

  updateFollowUp: adminProcedure
    .input(
      z.object({
        id: z.string(),
        followUpDate: z.date(),
        description: z.string().min(1),
        contactedById: z.string(),
        personContactedId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, followUpDate, description, contactedById, personContactedId } = input;

      const updatedFollowUp = await prisma.lastFollowUp.update({
        where: { id },
        data: {
          followUpDate,
          description,
          contactedById,
          personContactedId,
        },
        include: {
          contactedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          personContacted: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedFollowUp;
    }),

  deleteFollowUp: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.lastFollowUp.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

export const crmRouter = createTRPCRouter({
  leads: leadsRouter,
});
