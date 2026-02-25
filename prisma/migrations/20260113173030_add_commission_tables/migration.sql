-- CreateEnum
CREATE TYPE "CommissionRole" AS ENUM ('ACCOUNT_MANAGER', 'CLIENT_ACQUISITION', 'DEAL_SUPPORT');

-- CreateTable
CREATE TABLE "commission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleType" "CommissionRole" NOT NULL,
    "commissionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commission_userId_roleType_key" ON "commission"("userId", "roleType");

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;