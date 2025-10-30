-- CreateEnum
CREATE TYPE "InvestorType" AS ENUM ('LESS_THAN_10M', 'BETWEEN_10M_100M', 'GREATER_THAN_100M');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "investorType" "InvestorType",
ADD COLUMN     "preferredLocation" TEXT;
