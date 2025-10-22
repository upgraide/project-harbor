/*
  Warnings:

  - The values [Agnostic,Mixed,Hospitality,Logistics_And_Industrial,Office,Residential,Senior_Living,Shopping_Center,Street_Retail,Student_Housing] on the enum `RealEstateAssetType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Lease_And_Operation,S_And_L,Core,Fix_And_Flip,Refurbishment,Value_Add,Opportunistic,Development] on the enum `RealEstateInvestmentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RealEstateAssetType_new" AS ENUM ('AGNOSTIC', 'MIXED', 'HOSPITALITY', 'LOGISTICS_AND_INDUSTRIAL', 'OFFICE', 'RESIDENTIAL', 'SENIOR_LIVING', 'SHOPPING_CENTER', 'STREET_RETAIL', 'STUDENT_HOUSING');
ALTER TABLE "real_estate" ALTER COLUMN "asset" TYPE "RealEstateAssetType_new" USING ("asset"::text::"RealEstateAssetType_new");
ALTER TYPE "RealEstateAssetType" RENAME TO "RealEstateAssetType_old";
ALTER TYPE "RealEstateAssetType_new" RENAME TO "RealEstateAssetType";
DROP TYPE "public"."RealEstateAssetType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RealEstateInvestmentType_new" AS ENUM ('LEASE_AND_OPERATION', 'S_AND_L', 'CORE', 'FIX_AND_FLIP', 'REFURBISHMENT', 'VALUE_ADD', 'OPPORTUNISTIC', 'DEVELOPMENT');
ALTER TABLE "real_estate" ALTER COLUMN "investment" TYPE "RealEstateInvestmentType_new" USING ("investment"::text::"RealEstateInvestmentType_new");
ALTER TYPE "RealEstateInvestmentType" RENAME TO "RealEstateInvestmentType_old";
ALTER TYPE "RealEstateInvestmentType_new" RENAME TO "RealEstateInvestmentType";
DROP TYPE "public"."RealEstateInvestmentType_old";
COMMIT;
