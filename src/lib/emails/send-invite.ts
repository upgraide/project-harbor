import { render } from "@react-email/components";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { InviteEmail } from "./invite-email";

const resend = new Resend(env.RESEND_API_KEY);

type SendInviteEmailParams = {
  userEmail: string;
  password: string;
  language: "en" | "pt";
  inviteLink?: string;
};

export const sendInviteEmail = async ({
  userEmail,
  password,
  language,
  inviteLink,
}: SendInviteEmailParams) => {
  try {
    const emailSubject =
      language === "en"
        ? "Exclusive Invite - Access to Harbor Investment Opportunities"
        : "Convite Exclusivo - Acesso à Harbor Exclusive Investment Opportunities";

    const emailHtml = await render(
      InviteEmail({ userEmail, password, language, inviteLink })
    );

    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Replace with your verified email
      to: userEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send invite email: ${error.message}`);
    }
    throw error;
  }
};
