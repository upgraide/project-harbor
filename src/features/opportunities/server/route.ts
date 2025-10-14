import { generateSlug } from "random-word-slugs";
import z from "zod";
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
      prisma.opportunity.findUnique({
        where: { id: input.id },
      })
    ),
  getMany: protectedProcedure.query(() => prisma.opportunity.findMany({})),
});
