import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ step }) => {
    // Generating the translation for the description of the opportunity
    await step.sleep("wait-a-moment", "5s");

    // Generationg the translation for the notes of the opportunity
    await step.sleep("wait-a-moment", "5s");

    await step.run("create-opportunity", async () => {
      await prisma.opportunity.create({
        data: {
          name: "opportunity-from-inngest",
        },
      });
    });
  }
);
