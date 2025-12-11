-- DropIndex
DROP INDEX "public"."opportunity_analytics_followup_person_id_idx";

-- DropIndex
DROP INDEX "public"."opportunity_analytics_invested_person_id_idx";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;
