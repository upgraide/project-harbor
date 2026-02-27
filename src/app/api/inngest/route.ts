import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  execute,
  notifyInvestorsOnOpportunityActive,
  translateDescription,
} from "@/inngest/functions";

// Serve all Inngest functions via this API route
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    execute,
    translateDescription,
    notifyInvestorsOnOpportunityActive,
  ],
});
