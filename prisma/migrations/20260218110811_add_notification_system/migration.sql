-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ACCESS_REQUEST', 'OPPORTUNITY_INTEREST', 'OPPORTUNITY_NOT_INTERESTED', 'OPPORTUNITY_NDA_SIGNED', 'OPPORTUNITY_CONCLUDED', 'OPPORTUNITY_STATUS_CHANGE', 'COMMISSION_RESOLVED', 'LEAD_STATUS_CHANGE', 'LEAD_FOLLOW_UP', 'NEW_USER_REGISTERED');

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "opportunityId" TEXT,
    "opportunityType" "OpportunityType",
    "relatedUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_userId_read_idx" ON "notification"("userId", "read");

-- CreateIndex
CREATE INDEX "notification_userId_createdAt_idx" ON "notification"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
