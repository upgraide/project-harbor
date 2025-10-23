import { Inngest } from "inngest";
import { env } from "@/lib/env";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "harbor001",
  apiBaseUrl: env.INNGEST_API_BASE_URL,
  eventKey: env.INNGEST_EVENT_KEY,
});
