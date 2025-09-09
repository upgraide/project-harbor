import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api.js";
import { internalMutation } from "./_generated/server.js";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
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
