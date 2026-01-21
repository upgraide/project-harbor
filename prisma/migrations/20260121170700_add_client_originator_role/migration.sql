-- AlterEnum
ALTER TYPE "CommissionRole" ADD VALUE 'CLIENT_ORIGINATOR';

-- AlterTable
ALTER TABLE "MergerAndAcquisition" ADD COLUMN     "clientOriginatorId" TEXT;

-- AlterTable
ALTER TABLE "real_estate" ADD COLUMN     "clientOriginatorId" TEXT;

-- AddForeignKey
ALTER TABLE "MergerAndAcquisition" ADD CONSTRAINT "MergerAndAcquisition_clientOriginatorId_fkey" FOREIGN KEY ("clientOriginatorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estate" ADD CONSTRAINT "real_estate_clientOriginatorId_fkey" FOREIGN KEY ("clientOriginatorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
