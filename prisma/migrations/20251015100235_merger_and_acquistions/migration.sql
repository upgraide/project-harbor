-- CreateEnum
CREATE TYPE "Type" AS ENUM ('BUY_IN', 'BUY_OUT', 'BUY_IN_BUY_OUT');

-- CreateEnum
CREATE TYPE "TypeDetails" AS ENUM ('MAIORITARIO', 'MINORITARIO', 'FULL_OWNERSHIP');

-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('SERVICES', 'TRANSFORMATION_INDUSTRY', 'TRADING', 'ENERGY_INFRASTRUCTURE', 'FITNESS', 'HEALTHCARE_PHARMACEUTICALS', 'IT', 'TMT', 'TRANSPORTS');

-- CreateEnum
CREATE TYPE "IndustrySubsector" AS ENUM ('BUSINESS_SERVICES', 'FINANCIAL_SERVICES', 'CONSTRUCTION_MATERIALS', 'FOOD_BEVERAGES', 'OTHERS');

-- CreateEnum
CREATE TYPE "SalesRange" AS ENUM ('RANGE_0_5', 'RANGE_5_10', 'RANGE_10_15', 'RANGE_20_30', 'RANGE_30_PLUS');

-- CreateEnum
CREATE TYPE "EbitdaRange" AS ENUM ('RANGE_1_2', 'RANGE_2_3', 'RANGE_3_5', 'RANGE_5_PLUS');

-- CreateTable
CREATE TABLE "MergerAndAcquisition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT[],
    "type" "Type",
    "typeDetails" "TypeDetails",
    "industry" "Industry",
    "industrySubsector" "IndustrySubsector",
    "sales" "SalesRange",
    "ebitda" "EbitdaRange",
    "ebitdaNormalized" DOUBLE PRECISION,
    "netDebt" DOUBLE PRECISION,
    "description" TEXT,
    "graphRows" JSONB[],
    "salesCAGR" DOUBLE PRECISION,
    "ebitdaCAGR" DOUBLE PRECISION,
    "assetIncluded" BOOLEAN,
    "estimatedAssetValue" DOUBLE PRECISION,
    "preNDANotes" TEXT,
    "shareholderStructure" TEXT[],
    "im" TEXT,
    "entrepriseValue" DOUBLE PRECISION,
    "equityValue" DOUBLE PRECISION,
    "evDashEbitdaEntry" DOUBLE PRECISION,
    "evDashEbitdaExit" DOUBLE PRECISION,
    "ebitdaMargin" DOUBLE PRECISION,
    "fcf" DOUBLE PRECISION,
    "netDebtDashEbitda" DOUBLE PRECISION,
    "capexItensity" DOUBLE PRECISION,
    "workingCapitalNeeds" DOUBLE PRECISION,
    "postNDANotes" TEXT,
    "coInvestment" BOOLEAN,
    "equityContribution" DOUBLE PRECISION,
    "grossIRR" DOUBLE PRECISION,
    "netIRR" DOUBLE PRECISION,
    "moic" DOUBLE PRECISION,
    "cashOnCashReturn" DOUBLE PRECISION,
    "cashConvertion" DOUBLE PRECISION,
    "entryMultiple" DOUBLE PRECISION,
    "exitExpectedMultiple" DOUBLE PRECISION,
    "holdPeriod" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MergerAndAcquisition_pkey" PRIMARY KEY ("id")
);
