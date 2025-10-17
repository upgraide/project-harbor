import { generateSlug } from "random-word-slugs";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import {
  EbitdaRange,
  Industry,
  IndustrySubsector,
  SalesRange,
  Type,
  TypeDetails,
} from "@/generated/prisma";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const SLUG_WORDS = 3;

export const mergerAndAcquisitionRouter = createTRPCRouter({
  create: protectedProcedure.mutation(({ ctx }) =>
    prisma.mergerAndAcquisition.create({
      data: {
        userId: ctx.auth.user.id,
        name: generateSlug(SLUG_WORDS),
      },
    })
  ),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.delete({
        where: { id: input.id },
      })
    ),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { name: input.name },
      })
    ),
  updateDescription: protectedProcedure
    .input(z.object({ id: z.string(), description: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { description: input.description },
      })
    ),
  updateType: protectedProcedure
    .input(z.object({ id: z.string(), type: z.enum(Type) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { type: input.type },
      })
    ),
  removeType: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { type: null },
      })
    ),
  updateTypeDetails: protectedProcedure
    .input(z.object({ id: z.string(), typeDetails: z.enum(TypeDetails) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { typeDetails: input.typeDetails },
      })
    ),
  removeTypeDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { typeDetails: null },
      })
    ),
  updateIndustry: protectedProcedure
    .input(z.object({ id: z.string(), industry: z.enum(Industry) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industry: input.industry },
      })
    ),
  removeIndustry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industry: null },
      })
    ),
  updateIndustrySubsector: protectedProcedure
    .input(
      z.object({ id: z.string(), industrySubsector: z.enum(IndustrySubsector) })
    )
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industrySubsector: input.industrySubsector },
      })
    ),
  removeIndustrySubsector: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { industrySubsector: null },
      })
    ),
  updateSales: protectedProcedure
    .input(z.object({ id: z.string(), sales: z.enum(SalesRange) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { sales: input.sales },
      })
    ),
  removeSales: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { sales: null },
      })
    ),
  updateEbitda: protectedProcedure
    .input(z.object({ id: z.string(), ebitda: z.enum(EbitdaRange) }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitda: input.ebitda },
      })
    ),
  removeEbitda: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { ebitda: null },
      })
    ),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) =>
      prisma.mergerAndAcquisition.findUniqueOrThrow({
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
        prisma.mergerAndAcquisition.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            name: { contains: search, mode: "insensitive" },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.mergerAndAcquisition.count({
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
