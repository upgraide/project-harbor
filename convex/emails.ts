import { Resend } from "@convex-dev/resend";
import { pretty, render } from "@react-email/render";
import { ConvexError, v } from "convex/values";
import React from "react";
import { InviteUserEmailEn } from "@/emails/invite-user-en";
import { InviteUserEmailPt } from "@/emails/invite-user-pt";
import { ResetPasswordEmailEn } from "@/emails/reset-password-en";
import { components } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string): boolean => emailRegex.test(email);

export const sendTestEmail = internalMutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    try {
      await resend.sendEmail(ctx, {
        from: "Acme <onboarding@resend.dev>",
        to: "rodrigorafaelsantos7@icloud.com",
        subject: "Test Email - Harbor Partners",
        html: "This is a test email from Harbor Partners",
      });
    } catch {
      throw new ConvexError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send test email",
      });
    }
    return;
  },
});

export const sendInviteUserEmail = action({
  args: {
    toEmail: v.string(),
    toName: v.string(),
    toPassword: v.string(),
    inviteLink: v.string(),
    locale: v.union(v.literal("en"), v.literal("pt")),
  },
  handler: async (ctx, args) => {
    try {
      const EmailComponent =
        args.locale === "en" ? InviteUserEmailEn : InviteUserEmailPt;
      const html = await pretty(
        await render(
          React.createElement(EmailComponent, {
            toEmail: args.toEmail,
            toName: args.toName,
            toPassword: args.toPassword,
            inviteLink: args.inviteLink,
          })
        )
      );

      await resend.sendEmail(ctx, {
        from: "Acme <onboarding@resend.dev>",
        to: "rodrigorafaelsantos7@icloud.com",
        subject:
          args.locale === "en"
            ? "Exclusive Invitation - Access to Harbor Exclusive Investment Opportunities"
            : "Convite Exclusivo - Acesso à Harbor Exclusive Investment Opportunities",
        html,
      });
    } catch {
      throw new ConvexError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send invite email",
      });
    }

    return;
  },
});

export const sendResetPasswordEmail = action({
  args: {
    toName: v.string(),
    toEmail: v.string(),
    resetPasswordLink: v.string(),
    locale: v.union(v.literal("en"), v.literal("pt")),
  },
  handler: async (ctx, args) => {
    if (!isValidEmail(args.toEmail)) {
      throw new ConvexError({
        code: "INVALID_ARGUMENT",
        message: "Invalid email format",
      });
    }

    try {
      const html = await pretty(
        await render(
          React.createElement(ResetPasswordEmailEn, {
            toName: args.toName,
            resetPasswordLink: args.resetPasswordLink,
          })
        )
      );

      await resend.sendEmail(ctx, {
        from: "Acme <onboarding@resend.dev>",
        to: "rodrigorafaelsantos7@icloud.com",
        subject:
          args.locale === "en"
            ? "Password Reset - Harbor Exclusive Investment Opportunities"
            : "Redefinição de palavra-passe - Harbor Exclusive Investment Opportunities",
        html,
      });
    } catch {
      throw new ConvexError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send reset password email",
      });
    }

    return;
  },
});
