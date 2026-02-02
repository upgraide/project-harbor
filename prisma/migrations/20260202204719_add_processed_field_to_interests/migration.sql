-- AlterTable
ALTER TABLE "user_m_and_a_interest" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_real_estate_interest" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;
