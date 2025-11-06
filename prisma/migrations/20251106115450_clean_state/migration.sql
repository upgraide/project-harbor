-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('MNA', 'REAL_ESTATE');

-- AlterTable
ALTER TABLE "MergerAndAcquisition" ADD COLUMN     "clientAcquisitionerId" TEXT;

-- AlterTable
ALTER TABLE "real_estate" ADD COLUMN     "clientAcquisitionerId" TEXT;

-- CreateTable
CREATE TABLE "opportunity_account_manager" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "opportunityType" "OpportunityType" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunity_account_manager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_account_manager_opportunityId_opportunityType_u_key" ON "opportunity_account_manager"("opportunityId", "opportunityType", "userId");

-- AddForeignKey
ALTER TABLE "MergerAndAcquisition" ADD CONSTRAINT "MergerAndAcquisition_clientAcquisitionerId_fkey" FOREIGN KEY ("clientAcquisitionerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estate" ADD CONSTRAINT "real_estate_clientAcquisitionerId_fkey" FOREIGN KEY ("clientAcquisitionerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_account_manager" ADD CONSTRAINT "opportunity_account_manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
