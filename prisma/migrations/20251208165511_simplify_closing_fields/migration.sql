-- Simplify closing fields: remove commission fields and finalSalePrice
-- Rename closingDate to closed_at
-- Add final_amount field

-- Add the new final_amount column
ALTER TABLE "opportunity_analytics" ADD COLUMN "final_amount" DOUBLE PRECISION;

-- Add the new closed_at column
ALTER TABLE "opportunity_analytics" ADD COLUMN "closed_at" TIMESTAMP(3);

-- Copy data from old columns to new ones
UPDATE "opportunity_analytics" SET "closed_at" = "closingDate" WHERE "closingDate" IS NOT NULL;
UPDATE "opportunity_analytics" SET "final_amount" = "finalSalePrice" WHERE "finalSalePrice" IS NOT NULL;

-- Drop the old columns
ALTER TABLE "opportunity_analytics" DROP COLUMN "finalSalePrice";
ALTER TABLE "opportunity_analytics" DROP COLUMN "commissionRate";
ALTER TABLE "opportunity_analytics" DROP COLUMN "commissionAmount";
ALTER TABLE "opportunity_analytics" DROP COLUMN "closingDate";