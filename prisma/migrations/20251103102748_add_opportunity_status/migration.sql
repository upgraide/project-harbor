-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CONCLUDED');

-- AlterTable
ALTER TABLE "MergerAndAcquisition" ADD COLUMN     "status" "OpportunityStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "real_estate" ADD COLUMN     "status" "OpportunityStatus" NOT NULL DEFAULT 'ACTIVE';
