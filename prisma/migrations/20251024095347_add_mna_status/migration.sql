-- CreateEnum
CREATE TYPE "MnaStatus" AS ENUM ('LIVE', 'OFFLINE');

-- AlterTable
ALTER TABLE "MergerAndAcquisition" ADD COLUMN     "status" "MnaStatus" NOT NULL DEFAULT 'LIVE';
