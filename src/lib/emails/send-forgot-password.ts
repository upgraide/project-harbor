import { render } from "@react-email/components";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { ForgotPasswordEmail } from "./forgot-password-email";

const resend = new Resend(env.RESEND_API_KEY);

/** Strips trailing slash from a URL */
function baseUrl(): string {
  return env.BETTER_AUTH_URL.replace(/\/$/, "");
}

type SendForgotPasswordEmailParams = {
  userEmail: string;
  password: string;
  language: "en" | "pt";
};

export const sendForgotPasswordEmail = async ({
  userEmail,
  password,
  language,
}: SendForgotPasswordEmailParams) => {
  try {
    const appBaseUrl = baseUrl();
    const loginLink = `${appBaseUrl}/login`;
    const logoUrl = `${appBaseUrl}/assets/logo-dark.png`;

    const emailSubject =
      language === "en"
        ? "Password Reset - Harbor Partners"
        : "Redefinição de Password - Harbor Partners";

    const emailHtml = await render(
      ForgotPasswordEmail({ userEmail, password, language, loginLink, logoUrl })
    );

    const result = await resend.emails.send({
      from: env.EMAIL_FROM,
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
      throw new Error(`Failed to send forgot password email: ${error.message}`);
    }
    throw error;
  }
};
