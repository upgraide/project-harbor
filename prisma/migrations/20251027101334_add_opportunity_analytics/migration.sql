-- CreateTable
CREATE TABLE "opportunity_analytics" (
    "id" TEXT NOT NULL,
    "mergerAndAcquisitionId" TEXT,
    "realEstateId" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_analytics_mergerAndAcquisitionId_key" ON "opportunity_analytics"("mergerAndAcquisitionId");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_analytics_realEstateId_key" ON "opportunity_analytics"("realEstateId");

-- AddForeignKey
ALTER TABLE "opportunity_analytics" ADD CONSTRAINT "opportunity_analytics_mergerAndAcquisitionId_fkey" FOREIGN KEY ("mergerAndAcquisitionId") REFERENCES "MergerAndAcquisition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_analytics" ADD CONSTRAINT "opportunity_analytics_realEstateId_fkey" FOREIGN KEY ("realEstateId") REFERENCES "real_estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
