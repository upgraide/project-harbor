import { NextResponse } from "next/server";
import { notifyTeamAndAdmins } from "@/features/notifications/server/notifications";
import { NotificationType, OpportunityType } from "@/generated/prisma";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { getDocumentDetails } from "@/lib/pandadocs";
import { getPusherServer } from "@/lib/pusher";

function verifyWebhook(body: string, sharedKey: string): boolean {
  // PandaDocs webhook verification: the payload contains the shared key
  // that was configured when setting up the webhook
  try {
    const parsed = JSON.parse(body);
    return parsed[0]?.data?.shared_key === sharedKey;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const body = await request.text();

  if (!verifyWebhook(body, env.PANDADOCS_WEBHOOK_KEY)) {
    return NextResponse.json({ error: "Invalid webhook key" }, { status: 401 });
  }

  let events: Array<{
    event: string;
    data: { id: string; shared_key?: string };
  }>;
  try {
    events = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  for (const entry of events) {
    const { event, data } = entry;
    const documentId = data.id;

    if (event === "document_state_changed") {
      try {
        const doc = await getDocumentDetails(documentId);

        const userId = doc.metadata?.userId;
        const opportunityId = doc.metadata?.opportunityId;
        const opportunityType = doc.metadata?.opportunityType as
          | OpportunityType
          | undefined;

        if (!(userId && opportunityId && opportunityType)) {
          // biome-ignore lint/suspicious/noConsole: Logging webhook errors
          console.warn(
            `[PandaDocs Webhook] Missing metadata on document ${documentId}`
          );
          continue;
        }

        if (doc.status === "document.completed") {
          await handleDocumentCompleted(userId, opportunityId, opportunityType);
        } else if (doc.status === "document.declined") {
          await handleDocumentDeclined(userId);
        }
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: Logging webhook errors
        console.error(
          `[PandaDocs Webhook] Error processing document ${documentId}:`,
          error
        );
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}

async function handleDocumentCompleted(
  userId: string,
  opportunityId: string,
  opportunityType: OpportunityType
) {
  if (opportunityType === OpportunityType.MNA) {
    const existing = await prisma.userMergerAndAcquisitionInterest.findFirst({
      where: { userId, mergerAndAcquisitionId: opportunityId },
    });

    if (existing) {
      await prisma.userMergerAndAcquisitionInterest.update({
        where: { id: existing.id },
        data: { ndaSigned: true, interested: true },
      });
    } else {
      await prisma.userMergerAndAcquisitionInterest.create({
        data: {
          userId,
          mergerAndAcquisitionId: opportunityId,
          ndaSigned: true,
          interested: true,
        },
      });
    }

    const [user, opp] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      }),
      prisma.mergerAndAcquisition.findUnique({
        where: { id: opportunityId },
        select: { name: true },
      }),
    ]);

    await notifyTeamAndAdmins({
      type: NotificationType.OPPORTUNITY_NDA_SIGNED,
      title: `${user?.name ?? "User"} signed NDA`,
      message: `${user?.name ?? "User"} signed NDA for ${opp?.name ?? "opportunity"} (M&A)`,
      opportunityId,
      opportunityType: OpportunityType.MNA,
      relatedUserId: userId,
    });

    if (user?.email) {
      triggerPusherUpdate(user.email, "completed");
    }
  } else {
    const existing = await prisma.userRealEstateInterest.findFirst({
      where: { userId, realEstateId: opportunityId },
    });

    if (existing) {
      await prisma.userRealEstateInterest.update({
        where: { id: existing.id },
        data: { ndaSigned: true, interested: true },
      });
    } else {
      await prisma.userRealEstateInterest.create({
        data: {
          userId,
          realEstateId: opportunityId,
          ndaSigned: true,
          interested: true,
        },
      });
    }

    const [user, opp] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      }),
      prisma.realEstate.findUnique({
        where: { id: opportunityId },
        select: { name: true },
      }),
    ]);

    await notifyTeamAndAdmins({
      type: NotificationType.OPPORTUNITY_NDA_SIGNED,
      title: `${user?.name ?? "User"} signed NDA`,
      message: `${user?.name ?? "User"} signed NDA for ${opp?.name ?? "opportunity"} (Real Estate)`,
      opportunityId,
      opportunityType: OpportunityType.REAL_ESTATE,
      relatedUserId: userId,
    });

    if (user?.email) {
      triggerPusherUpdate(user.email, "completed");
    }
  }
}

async function handleDocumentDeclined(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (user?.email) {
    triggerPusherUpdate(user.email, "declined");
  }
}

function triggerPusherUpdate(email: string, status: "completed" | "declined") {
  try {
    const pusher = getPusherServer();
    pusher
      .trigger(`user-${email}`, "nda-status-update", {
        status,
        timestamp: new Date().toISOString(),
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        // biome-ignore lint/suspicious/noConsole: Logging Pusher errors
        console.warn(`[Pusher] NDA status update failed: ${message}`);
      });
  } catch {
    // Pusher initialization failed — silently skip
  }
}
