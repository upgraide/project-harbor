import { z } from "zod";
import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usersRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.user.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            sessions: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { createdAt: true },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.user.count({
          where: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      type User = (typeof items)[number];
      const formattedItems = items.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLoginAt: user.sessions[0]?.createdAt || null,
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
});
