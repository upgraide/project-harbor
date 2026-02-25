import { z } from "zod";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export const notificationsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        readFilter: z.enum(["all", "read", "unread"]).default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, readFilter } = input;
      const userId = ctx.auth.user.id;

      const where = {
        userId,
        ...(readFilter === "read" ? { read: true } : {}),
        ...(readFilter === "unread" ? { read: false } : {}),
      };

      const [items, totalCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        prisma.notification.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await prisma.notification.count({
      where: {
        userId: ctx.auth.user.id,
        read: false,
      },
    });

    return { count };
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notification = await prisma.notification.updateMany({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      return notification;
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await prisma.notification.updateMany({
      where: {
        userId: ctx.auth.user.id,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return result;
  }),
});
