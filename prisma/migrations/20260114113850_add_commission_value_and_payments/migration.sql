-- CreateTable
CREATE TABLE "commission_value" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "opportunityType" "OpportunityType" NOT NULL,
    "totalCommissionValue" DOUBLE PRECISION,
    "commissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_payment" (
    "id" TEXT NOT NULL,
    "commissionValueId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "paymentAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commission_value_opportunityId_opportunityType_commissionId_key" ON "commission_value"("opportunityId", "opportunityType", "commissionId");

-- CreateIndex
CREATE UNIQUE INDEX "commission_payment_commissionValueId_installmentNumber_key" ON "commission_payment"("commissionValueId", "installmentNumber");

-- AddForeignKey
ALTER TABLE "commission_value" ADD CONSTRAINT "commission_value_commissionId_fkey" FOREIGN KEY ("commissionId") REFERENCES "commission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_payment" ADD CONSTRAINT "commission_payment_commissionValueId_fkey" FOREIGN KEY ("commissionValueId") REFERENCES "commission_value"("id") ON DELETE CASCADE ON UPDATE CASCADE;