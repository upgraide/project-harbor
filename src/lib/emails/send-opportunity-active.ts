import { render } from "@react-email/components";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { OpportunityActiveEmail } from "./opportunity-active-email";

const resend = new Resend(env.RESEND_API_KEY);
const TRAILING_SLASH_RE = /\/$/;

/** Strips trailing slash from a URL */
function baseUrl(): string {
  return env.BETTER_AUTH_URL.replace(TRAILING_SLASH_RE, "");
}

type SendOpportunityActiveEmailParams = {
  investorEmail: string;
  investorName: string;
  opportunityName: string;
  opportunityType: "MA" | "REAL_ESTATE";
  coverImageUrl?: string;
  dealPageUrl: string;
  language: "en" | "pt";
};

export const sendOpportunityActiveEmail = async ({
  investorEmail,
  investorName,
  opportunityName,
  opportunityType,
  coverImageUrl,
  dealPageUrl,
  language,
}: SendOpportunityActiveEmailParams) => {
  try {
    const appBaseUrl = baseUrl();
    const logoUrl = `${appBaseUrl}/assets/logo-dark.png`;

    const subject =
      language === "en"
        ? `New investment opportunity available: ${opportunityName}`
        : `Nova oportunidade de investimento disponível: ${opportunityName}`;

    const emailHtml = await render(
      OpportunityActiveEmail({
        investorName,
        opportunityName,
        opportunityType,
        coverImageUrl,
        dealPageUrl,
        language,
        logoUrl,
      })
    );

    const result = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: investorEmail,
      subject,
      html: emailHtml,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send opportunity email: ${error.message}`);
    }
    throw error;
  }
};
