import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Sentry from "@sentry/nextjs";
import { generateText } from "ai";
import { z } from "zod/v4";
import { Role } from "@/generated/prisma";
import prisma from "@/lib/db";
import { sendOpportunityActiveEmail } from "@/lib/emails/send-opportunity-active";
import { env } from "@/lib/env";
import { inngest } from "./client";

const google = createGoogleGenerativeAI();
const TRAILING_SLASH_RE = /\/$/;

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ step }) => {
    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
    });
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.5-flash"),
      system: "You are a helpful assistant.",
      prompt:
        "Translate the following text from Portuguese to English, ensuring that the translation is formal and reflects the cultural nuances appropriate for an English audience. The translation should be clear and concise, maintaining the original meaning and intent.",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });
    return steps;
  }
);

export const translateDescription = inngest.createFunction(
  { id: "translate-opportunity-description" },
  { event: "opportunity/translate-description" },
  async ({ event, step }) => {
    const { opportunityId, description } = event.data;

    try {
      Sentry.logger.info("Starting translation", { opportunityId });

      // Generate English translation using Gemini
      const translation = await step.ai.wrap(
        "translate-description-to-english",
        generateText,
        {
          model: google("gemini-2.5-flash"),
          system:
            "You are a professional translator specializing in business and finance terminology. Your task is to provide a SINGLE, OBJECTIVE translation of Portuguese business text to English with formal business language suitable for M&A contexts. Do NOT provide multiple options, alternatives, or variations. Provide ONLY the direct translation without any explanations, notes, or alternative phrasings.",
          prompt: `Translate the following Portuguese description to English. Provide ONLY the translation itself, nothing else:\n\n${description}`,
          experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
          },
        }
      );

      Sentry.logger.info("Translation received", {
        opportunityId,
        hasSteps: Boolean(translation?.steps),
        stepsLength: translation?.steps?.length ?? 0,
      });

      // Extract text from the steps array structure returned by generateText
      let translatedText: string | null = null;

      // Try to get text from steps[0].content (content is already an array of content parts)
      if (translation?.steps?.[0]?.content) {
        const contentArray = translation.steps[0].content as Array<{
          text?: string;
        }>;
        const firstPart = contentArray.find(
          (part): part is { text: string } =>
            "text" in part && typeof part.text === "string"
        );
        if (firstPart) {
          translatedText = firstPart.text;
        }
      }

      if (!translatedText) {
        const errorMsg = "Could not extract text from translation response";
        Sentry.logger.error(errorMsg, {
          hasSteps: Boolean(translation?.steps),
          stepsLength: translation?.steps?.length,
        });
        throw new Error(errorMsg);
      }

      Sentry.logger.info("Text extracted", {
        opportunityId,
        translatedTextLength: translatedText.length,
      });

      // Update the opportunity with the translated description
      await step.run("update-opportunity-english-description", async () => {
        Sentry.logger.info("Updating database", { opportunityId });

        // First verify the opportunity exists in either MergerAndAcquisition or RealEstate
        const mergerAcqExisting = await prisma.mergerAndAcquisition.findUnique({
          where: { id: opportunityId },
        });

        if (mergerAcqExisting) {
          const result = await prisma.mergerAndAcquisition.update({
            where: { id: opportunityId },
            data: { englishDescription: translatedText },
          });

          Sentry.logger.info(
            "Database update successful (MergerAndAcquisition)",
            {
              opportunityId,
              newEnglishDescriptionLength:
                result.englishDescription?.length ?? 0,
            }
          );
          return;
        }

        const realEstateExisting = await prisma.realEstate.findUnique({
          where: { id: opportunityId },
        });

        if (realEstateExisting) {
          const result = await prisma.realEstate.update({
            where: { id: opportunityId },
            data: { englishDescription: translatedText },
          });

          Sentry.logger.info("Database update successful (RealEstate)", {
            opportunityId,
            newEnglishDescriptionLength: result.englishDescription?.length ?? 0,
          });
          return;
        }

        throw new Error(`Opportunity not found: ${opportunityId}`);
      });

      Sentry.logger.info("Description translated successfully", {
        opportunityId,
        translatedLength: translatedText.length,
      });

      return {
        success: true,
        opportunityId,
        translatedDescription: translatedText,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Sentry.logger.error("Translation failed", {
        opportunityId,
        error: errorMessage,
      });
      Sentry.captureException(error);
      throw error;
    }
  }
);

const opportunityActiveEventSchema = z.object({
  opportunityId: z.string().min(1),
  opportunityType: z.enum(["MA", "REAL_ESTATE"]),
});

export const notifyInvestorsOnOpportunityActive = inngest.createFunction(
  { id: "opportunity/notify-investors", retries: 3 },
  { event: "opportunity/active" },
  async ({ event, step }) => {
    const { opportunityId, opportunityType } =
      opportunityActiveEventSchema.parse(event.data);

    const opportunity = await step.run("fetch-opportunity", () => {
      if (opportunityType === "MA") {
        return prisma.mergerAndAcquisition.findUniqueOrThrow({
          where: { id: opportunityId },
          select: { id: true, name: true, images: true },
        });
      }
      return prisma.realEstate.findUniqueOrThrow({
        where: { id: opportunityId },
        select: { id: true, name: true, images: true },
      });
    });

    const investors = await step.run("fetch-investors", async () =>
      prisma.user.findMany({
        where: {
          role: Role.USER,
          disabled: false,
          acceptMarketingList: true,
        },
        select: { id: true, name: true, email: true },
      })
    );

    const appBaseUrl = env.BETTER_AUTH_URL.replace(TRAILING_SLASH_RE, "");
    const dealPath =
      opportunityType === "MA"
        ? `/dashboard/ma/${opportunity.id}`
        : `/dashboard/real-estate/${opportunity.id}`;
    const coverImageUrl = opportunity.images?.[0] ?? undefined;

    const result = await step.run("send-emails", async () => {
      let sent = 0;
      let failed = 0;

      await Promise.allSettled(
        investors.map(async (investor) => {
          try {
            await sendOpportunityActiveEmail({
              investorEmail: investor.email,
              investorName: investor.name ?? "Investor",
              opportunityName: opportunity.name,
              opportunityType,
              coverImageUrl,
              dealPageUrl: `${appBaseUrl}${dealPath}`,
              language: "pt",
            });
            sent++;
          } catch (err) {
            failed++;
            Sentry.captureException(err, {
              tags: {
                feature: "opportunity-notify",
                opportunityId,
                opportunityType,
              },
              extra: { investorId: investor.id, investorEmail: investor.email },
            });
          }
        })
      );

      return { sent, failed };
    });

    Sentry.logger.info("[opportunity/notify-investors] Done", {
      opportunityId,
      total: investors.length,
      sent: result.sent,
      failed: result.failed,
    });

    return {
      total: investors.length,
      sent: result.sent,
      failed: result.failed,
    };
  }
);
