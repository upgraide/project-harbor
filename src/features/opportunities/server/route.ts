import { generateSlug } from "random-word-slugs";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const SLUG_WORDS = 3;

export const opportunitiesRouter = createTRPCRouter({
  create: protectedProcedure.mutation(({ ctx }) =>
    prisma.opportunity.create({
      data: {
        userId: ctx.auth.user.id,
        name: generateSlug(SLUG_WORDS),
      },
    })
  ),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.opportunity.delete({
        where: { id: input.id },
      })
    ),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.opportunity.update({
        where: { id: input.id },
        data: { name: input.name },
      })
    ),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.opportunity.findUniqueOrThrow({
        where: { id: input.id },
      })
    ),

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
        prisma.opportunity.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            name: { contains: search, mode: "insensitive" },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.opportunity.count({
          where: {
            name: { contains: search, mode: "insensitive" },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
