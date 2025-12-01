-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'COLD_OUTREACH', 'NETWORKING_EVENT', 'LINKEDIN', 'EMAIL_CAMPAIGN', 'PARTNER', 'EXISTING_CLIENT', 'ACCESS_REQUEST', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION', 'CONVERTED', 'LOST', 'ON_HOLD', 'NURTURE');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK', 'DEAL_VIEWED', 'DEAL_INTERESTED', 'DEAL_NOT_INTERESTED', 'STATUS_CHANGE', 'ASSIGNMENT_CHANGE', 'FOLLOW_UP_SCHEDULED', 'OTHER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "commissionNotes" TEXT,
ADD COLUMN     "commissionRate" DOUBLE PRECISION,
ADD COLUMN     "convertedAt" TIMESTAMP(3),
ADD COLUMN     "leadPriority" "LeadPriority" DEFAULT 'MEDIUM',
ADD COLUMN     "leadScore" INTEGER DEFAULT 0,
ADD COLUMN     "leadSource" "LeadSource",
ADD COLUMN     "leadStatus" "LeadStatus" DEFAULT 'NEW',
ADD COLUMN     "lostAt" TIMESTAMP(3),
ADD COLUMN     "lostReason" TEXT,
ADD COLUMN     "nextFollowUpDate" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "lead_activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "relatedUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lead_activity" ADD CONSTRAINT "lead_activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
