/*
  Warnings:

  - You are about to drop the column `status` on the `MergerAndAcquisition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MergerAndAcquisition" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."MnaStatus";
