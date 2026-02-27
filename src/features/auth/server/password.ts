import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import prisma from "@/lib/db";
import { sendForgotPasswordEmail } from "@/lib/emails/send-forgot-password";
import { generatePassword } from "@/lib/generate-password";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const passwordRouter = createTRPCRouter({
  forgotPassword: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        language: z.enum(["en", "pt"]),
      })
    )
    .mutation(async ({ input }) => {
      const { email, language } = input;

      try {
        // Look up user — silently skip if not found or disabled
        const user = await prisma.user.findFirst({
          where: { email },
          select: { id: true, disabled: true },
        });

        if (!user || user.disabled) {
          return { success: true };
        }

        // Find the credential account for this user
        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            providerId: "credential",
          },
          select: { id: true },
        });

        if (!account) {
          return { success: true };
        }

        // Generate temp password and hash it using better-auth's internal hasher
        const tempPassword = generatePassword();
        const hashedPassword = await hashPassword(tempPassword);

        // Update the account password and reset the passwordChanged flag
        await prisma.$transaction([
          prisma.account.update({
            where: { id: account.id },
            data: { password: hashedPassword },
          }),
          prisma.user.update({
            where: { id: user.id },
            data: { passwordChanged: false },
          }),
        ]);

        // Send the email with the temp password
        await sendForgotPasswordEmail({
          userEmail: email,
          password: tempPassword,
          language,
        });
      } catch (error) {
        console.error("[forgotPassword] Error:", error);
      }

      // Always return success to avoid leaking whether the email exists
      return { success: true };
    }),
});
