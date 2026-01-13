-- AlterTable
ALTER TABLE "opportunity_analytics" ADD COLUMN     "closingDate" TIMESTAMP(3),
ADD COLUMN     "commissionAmount" DOUBLE PRECISION,
ADD COLUMN     "commissionRate" DOUBLE PRECISION,
ADD COLUMN     "finalSalePrice" DOUBLE PRECISION;
