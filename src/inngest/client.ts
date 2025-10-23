import { Inngest } from "inngest";
import { env } from "@/lib/env";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "harbor001",
  eventKey: env.INNGEST_EVENT_KEY,
});
