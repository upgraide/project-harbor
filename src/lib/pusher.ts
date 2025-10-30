import Pusher from "pusher";
import { env } from "./env";

let pusherServer: Pusher | null = null;

function getPusherServer(): Pusher {
  if (pusherServer) {
    return pusherServer;
  }

  pusherServer = new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
    useTLS: true,
  });

  return pusherServer;
}

type AccessRequestNotificationData = {
  accessRequestId: string;
  name: string;
  email: string;
  company: string;
};

const ADMIN_EMAILS = [
  "goncalo.almeida@harborpartners.pt",
  "rodrigo.almeida@harborpartners.pt",
  "rodrigo.santos@upgraide.ai",
];

export async function sendAccessRequestNotification(
  data: AccessRequestNotificationData
) {
  try {
    const pusher = getPusherServer();

    // Send notification to all admin users via Pusher
    // In a real scenario, you'd look up users by email and send to their user IDs
    // For now, we'll broadcast to a channel that admins subscribe to
    await pusher.trigger("notifications", "access-request", {
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Also trigger for specific user channels if we have their user IDs
    // This is a placeholder - you'd need to query users by email first
    for (const email of ADMIN_EMAILS) {
      await pusher.trigger(`user-${email}`, "access-request", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Logging Pusher errors
    console.error("Failed to send Pusher notification:", error);
    // Don't throw - notification failure shouldn't break the request creation
  }
}
