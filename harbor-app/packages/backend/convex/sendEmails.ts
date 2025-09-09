import { Resend, vEmailEvent, vEmailId } from "@convex-dev/resend";
import { components, internal } from "./_generated/api.js";
import { internalMutation } from "./_generated/server.js";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
  onEmailEvent: internal.sendEmails.handleEmailEvent,
});

export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: "Acme <onboarding@resend.dev>",
      to: "rodrigorafaelsantos7@icloud.com",
      subject: "Hi there",
      html: "This is a test email",
    });
  },
});

export const handleEmailEvent = internalMutation({
  args: {
    id: vEmailId,
    event: vEmailEvent,
  },
  handler: async (ctx, args): Promise<null> => {
    console.log("Email event received", args);
    return null;
  },
});
