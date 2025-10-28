-- CreateTable
CREATE TABLE "user_m_and_a_interest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mergerAndAcquisitionId" TEXT NOT NULL,
    "interested" BOOLEAN NOT NULL DEFAULT false,
    "ndaSigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_m_and_a_interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_real_estate_interest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "realEstateId" TEXT NOT NULL,
    "interested" BOOLEAN NOT NULL DEFAULT false,
    "ndaSigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_real_estate_interest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_m_and_a_interest_userId_mergerAndAcquisitionId_key" ON "user_m_and_a_interest"("userId", "mergerAndAcquisitionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_real_estate_interest_userId_realEstateId_key" ON "user_real_estate_interest"("userId", "realEstateId");

-- AddForeignKey
ALTER TABLE "user_m_and_a_interest" ADD CONSTRAINT "user_m_and_a_interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_m_and_a_interest" ADD CONSTRAINT "user_m_and_a_interest_mergerAndAcquisitionId_fkey" FOREIGN KEY ("mergerAndAcquisitionId") REFERENCES "MergerAndAcquisition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_real_estate_interest" ADD CONSTRAINT "user_real_estate_interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_real_estate_interest" ADD CONSTRAINT "user_real_estate_interest_realEstateId_fkey" FOREIGN KEY ("realEstateId") REFERENCES "real_estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
