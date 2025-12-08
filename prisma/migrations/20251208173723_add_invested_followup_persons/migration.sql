-- Add optional person fields for deal closing
-- invested_person_id: person who invested/bought
-- followup_person_id: person responsible for follow-up

-- Add the columns
ALTER TABLE "opportunity_analytics" ADD COLUMN "invested_person_id" TEXT;
ALTER TABLE "opportunity_analytics" ADD COLUMN "followup_person_id" TEXT;

-- Create indexes for foreign key lookups
CREATE INDEX "opportunity_analytics_invested_person_id_idx" ON "opportunity_analytics"("invested_person_id");
CREATE INDEX "opportunity_analytics_followup_person_id_idx" ON "opportunity_analytics"("followup_person_id");

-- Add foreign key constraints with SET NULL on delete
ALTER TABLE "opportunity_analytics" ADD CONSTRAINT "opportunity_analytics_invested_person_id_fkey" 
  FOREIGN KEY ("invested_person_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "opportunity_analytics" ADD CONSTRAINT "opportunity_analytics_followup_person_id_fkey" 
  FOREIGN KEY ("followup_person_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;