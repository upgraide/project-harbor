import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    async onSignIn({ user }: { user: { id: string } }) {
      // Check if user account is disabled
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { disabled: true },
      });

      if (dbUser?.disabled) {
        throw new Error("Account has been disabled. Please contact an administrator.");
      }

      return user;
    },
  },
});
