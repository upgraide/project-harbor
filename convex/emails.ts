import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { render, pretty } from "@react-email/render";
import { InviteUserEmailEn } from "@/emails/invite-user-en";
import React from "react";
import { InviteUserEmailPt } from "@/emails/invite-user-pt";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});

export const sendTestEmail = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: "Acme <onboarding@resend.dev>",
      to: "rodrigorafaelsantos7@icloud.com",
      subject: "Hi there",
      html: "This is a test email",
    });
    return null;
  },
});

export const sendInviteUserEmail = action({
  args: {
    toEmail: v.string(),
    toName: v.string(),
    toPassword: v.string(),
    inviteLink: v.string(),
    locale: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const EmailComponent =
      args.locale === "en" ? InviteUserEmailEn : InviteUserEmailPt;
    const html = await pretty(
      await render(
        React.createElement(EmailComponent, {
          toEmail: args.toEmail,
          toName: args.toName,
          toPassword: args.toPassword,
          inviteLink: args.inviteLink,
        }),
      ),
    );

    await resend.sendEmail(ctx, {
      from: "Acme <onboarding@resend.dev>",
      to: "rodrigorafaelsantos7@icloud.com",
      subject:
        "Convite Exclusivo - Acesso à Harbor Exclusive Investment Opportunities",
      html: html,
    });

    return null;
  },
});
