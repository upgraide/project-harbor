import {
  NotificationType,
  OpportunityType,
  Role,
} from "@/generated/prisma";
import prisma from "@/lib/db";
import { getPusherServer } from "@/lib/pusher";

type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  opportunityId?: string;
  opportunityType?: OpportunityType;
  relatedUserId?: string;
};

/**
 * Safely triggers a Pusher event. Fire-and-forget — never throws or blocks the caller.
 * Pusher failures are logged as warnings and silently ignored.
 */
function safePusherTrigger(
  channels: string | string[],
  event: string,
  data: Record<string, unknown>
): void {
  try {
    const pusher = getPusherServer();
    pusher.trigger(channels, event, data).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      // biome-ignore lint/suspicious/noConsole: Expected Pusher warning
      console.warn(`[Pusher] Event delivery failed: ${message}`);
    });
  } catch {
    // Pusher initialization failed — silently skip real-time delivery
  }
}

/**
 * Creates a notification in the database.
 * Optionally broadcasts a real-time Pusher event (enabled by default for standalone calls,
 * disabled when called from batch functions that handle broadcasting themselves).
 */
export async function createNotification(
  input: CreateNotificationInput,
  options?: { broadcast?: boolean }
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        opportunityId: input.opportunityId ?? null,
        opportunityType: input.opportunityType ?? null,
        relatedUserId: input.relatedUserId ?? null,
      },
    });

    // Fire-and-forget real-time push (broadcast by default for standalone calls)
    if (options?.broadcast !== false) {
      safePusherTrigger("notifications", "notification", {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        opportunityId: notification.opportunityId,
        opportunityType: notification.opportunityType,
        createdAt: notification.createdAt.toISOString(),
      });
    }

    return notification;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Logging notification DB errors
    console.error("[Notification] Failed to save to database:", error);
    // Don't throw - notification failure shouldn't break the main operation
  }
}

/**
 * Creates notifications for multiple users at once.
 * DB writes happen in parallel; a single Pusher broadcast is sent at the end.
 */
export async function createNotifications(
  inputs: CreateNotificationInput[]
) {
  if (inputs.length === 0) return [];

  // Create DB records without per-notification broadcasting
  const results = await Promise.allSettled(
    inputs.map((input) => createNotification(input, { broadcast: false }))
  );

  // Send a single broadcast to the shared channel so the notifications page refreshes
  const first = inputs[0];
  safePusherTrigger("notifications", "notification", {
    type: first.type,
    title: first.title,
    message: first.message,
    opportunityId: first.opportunityId ?? null,
    opportunityType: first.opportunityType ?? null,
    createdAt: new Date().toISOString(),
  });

  return results;
}

/**
 * Send notification to all admin users
 */
export async function notifyAdmins(
  input: Omit<CreateNotificationInput, "userId">
) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: Role.ADMIN, disabled: false },
      select: { id: true },
    });

    const notifications = admins.map((admin) => ({
      ...input,
      userId: admin.id,
    }));

    return createNotifications(notifications);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Logging notification errors
    console.error("Failed to notify admins:", error);
  }
}

/**
 * Send notification to all team members and admins
 */
export async function notifyTeamAndAdmins(
  input: Omit<CreateNotificationInput, "userId">
) {
  try {
    const teamMembers = await prisma.user.findMany({
      where: {
        role: { in: [Role.ADMIN, Role.TEAM] },
        disabled: false,
      },
      select: { id: true },
    });

    const notifications = teamMembers.map((member) => ({
      ...input,
      userId: member.id,
    }));

    return createNotifications(notifications);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Logging notification errors
    console.error("Failed to notify team and admins:", error);
  }
}

/**
 * Get users involved in an opportunity's commissions
 * Used to notify them when the opportunity is concluded or commissions resolved
 */
export async function getOpportunityInvolvedUsers(
  opportunityId: string,
  opportunityType: OpportunityType
): Promise<string[]> {
  const userIds = new Set<string>();

  if (opportunityType === OpportunityType.MNA) {
    const opp = await prisma.mergerAndAcquisition.findUnique({
      where: { id: opportunityId },
      select: {
        clientAcquisitionerId: true,
        clientOriginatorId: true,
        analytics: {
          select: {
            invested_person_id: true,
            followup_person_id: true,
          },
        },
      },
    });
    if (opp?.clientAcquisitionerId) userIds.add(opp.clientAcquisitionerId);
    if (opp?.clientOriginatorId) userIds.add(opp.clientOriginatorId);
    if (opp?.analytics?.followup_person_id)
      userIds.add(opp.analytics.followup_person_id);
  } else {
    const opp = await prisma.realEstate.findUnique({
      where: { id: opportunityId },
      select: {
        clientAcquisitionerId: true,
        clientOriginatorId: true,
        analytics: {
          select: {
            invested_person_id: true,
            followup_person_id: true,
          },
        },
      },
    });
    if (opp?.clientAcquisitionerId) userIds.add(opp.clientAcquisitionerId);
    if (opp?.clientOriginatorId) userIds.add(opp.clientOriginatorId);
    if (opp?.analytics?.followup_person_id)
      userIds.add(opp.analytics.followup_person_id);
  }

  // Account managers
  const accountManagers = await prisma.opportunityAccountManager.findMany({
    where: { opportunityId, opportunityType },
    select: { userId: true },
  });
  for (const am of accountManagers) {
    userIds.add(am.userId);
  }

  return Array.from(userIds);
}
