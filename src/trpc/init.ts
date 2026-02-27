import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { Role } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return await { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({ ctx: { ...ctx, auth: session } });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await prisma.user.findUnique({
    where: { id: ctx.auth.user.id },
    select: { role: true },
  });

  if (!user || user.role !== Role.ADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only admin users can perform this action",
    });
  }

  return next({ ctx });
});

export const teamOrAdminProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.auth.user.id },
      select: { role: true },
    });

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.TEAM)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only team members and admins can perform this action",
      });
    }

    return next({ ctx });
  }
);
