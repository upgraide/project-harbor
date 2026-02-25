-- AlterTable
ALTER TABLE "commission_payment" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "percentage" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "opportunity_commission_schedule" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "opportunityType" "OpportunityType" NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_commission_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_payment_plan" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_payment_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_commission_schedule_opportunityId_opportunityTy_key" ON "opportunity_commission_schedule"("opportunityId", "opportunityType");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_payment_plan_scheduleId_installmentNumber_key" ON "opportunity_payment_plan"("scheduleId", "installmentNumber");

-- AddForeignKey
ALTER TABLE "opportunity_payment_plan" ADD CONSTRAINT "opportunity_payment_plan_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "opportunity_commission_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
