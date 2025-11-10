-- CreateEnum
CREATE TYPE "InvestorClientType" AS ENUM ('ADVISOR', 'ANGEL_INVESTOR', 'BANK', 'BRAND', 'BROKER', 'BUSINESS', 'CLUB_DEAL_SYNDICATOR', 'DEBT_FUND', 'DEVELOPER', 'FAMILY_OFFICE', 'FUND_OF_FUND', 'SEARCH_FUND', 'INVESTOR', 'PENSION_FUND', 'PRIVATE_DEBT_INVESTOR', 'PRIVATE_EQUITY_FUND', 'SMALL_INVESTOR', 'START_UP', 'TEAM_MEMBER', 'VENTURE_CAPITAL_FUND', 'WEALTH_MANAGER', 'CONSTRUCTION_COMPANY', 'ASSET_MANAGER', 'PARTNER', 'ARCHITECT', 'CONSULTANT', 'PROMOTER', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestorStrategy" AS ENUM ('AGNOSTIC', 'MAJORITY_STAKES', 'MINORITY_STAKES', 'GROWTH', 'BUSINESS_OPERATOR', 'BUY_AND_HOLD', 'CONSOLIDATION', 'LEASE_AND_OPERATE', 'SALE_AND_LEASEBACK', 'CORE', 'FIX_AND_FLIP', 'REFURBISHMENT', 'VALUE_ADD', 'OPPORTUNISTIC', 'DEVELOPMENT', 'LONG_TERM_DEBT', 'MEZZ_BRIDGE_DEBT');

-- CreateEnum
CREATE TYPE "InvestorSegment" AS ENUM ('AGNOSTIC', 'BUSINESS_SERVICES', 'CONSTRUCTION_AND_REAL_ESTATE', 'CONSTRUCTION_INDUSTRY', 'CONSUMER_AND_RETAIL', 'DATA_CENTER', 'ENERGY_AND_INFRASTRUCTURE', 'FINANCIAL_SERVICES', 'FITNESS', 'FOOD_INDUSTRY', 'FOOD_RETAIL', 'HEALTHCARE_AND_PHARMACEUTICALS', 'IT', 'TMT', 'TRADING', 'TRANSFORMATION_INDUSTRY', 'TRANSPORTS', 'MIXED', 'HOSPITALITY', 'LOGISTICS_AND_INDUSTRIAL', 'OFFICE', 'RESIDENTIAL', 'SENIOR_LIVING', 'SHOPPING_CENTERS', 'STREET_RETAIL', 'STUDENT_HOUSING', 'DEBT');

-- CreateEnum
CREATE TYPE "TeamMember" AS ENUM ('MAS', 'FB', 'FC', 'FRS', 'GBA', 'JV', 'JDV', 'JG', 'LM', 'RS', 'RA', 'SM', 'TE', 'JCM');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('MNA', 'CRE', 'MNA_AND_CRE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "acceptMarketingList" BOOLEAN,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "department" "Department",
ADD COLUMN     "lastContactDate" TIMESTAMP(3),
ADD COLUMN     "lastNotes" TEXT,
ADD COLUMN     "leadMainContactId" TEXT,
ADD COLUMN     "leadMainContactTeam" "TeamMember",
ADD COLUMN     "leadResponsibleId" TEXT,
ADD COLUMN     "leadResponsibleTeam" "TeamMember",
ADD COLUMN     "location1" TEXT,
ADD COLUMN     "location2" TEXT,
ADD COLUMN     "location3" TEXT,
ADD COLUMN     "maxTicketSize" DOUBLE PRECISION,
ADD COLUMN     "minTicketSize" DOUBLE PRECISION,
ADD COLUMN     "otherFacts" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "physicalAddress" TEXT,
ADD COLUMN     "representativeName" TEXT,
ADD COLUMN     "segment1" "InvestorSegment",
ADD COLUMN     "segment2" "InvestorSegment",
ADD COLUMN     "segment3" "InvestorSegment",
ADD COLUMN     "strategy1" "InvestorStrategy",
ADD COLUMN     "strategy2" "InvestorStrategy",
ADD COLUMN     "strategy3" "InvestorStrategy",
ADD COLUMN     "targetReturnIRR" DOUBLE PRECISION,
ADD COLUMN     "type" "InvestorClientType",
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "user_note" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_leadResponsibleId_fkey" FOREIGN KEY ("leadResponsibleId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_leadMainContactId_fkey" FOREIGN KEY ("leadMainContactId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_note" ADD CONSTRAINT "user_note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_note" ADD CONSTRAINT "user_note_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
