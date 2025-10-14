import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Sentry from "@sentry/nextjs";
import { generateText } from "ai";
import { inngest } from "./client";

const google = createGoogleGenerativeAI();

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
