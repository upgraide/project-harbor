import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });
    return { success: true, message: "Job queued for AI execution" };
  }),
  getOpportunities: protectedProcedure.query(async () =>
    prisma.opportunity.findMany({})
  ),
  createOpportunity: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "email@example.com",
      },
    });

    return { success: true, message: "Opportunity queued" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
