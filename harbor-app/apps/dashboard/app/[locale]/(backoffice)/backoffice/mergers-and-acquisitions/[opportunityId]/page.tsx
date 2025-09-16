import { api } from "@harbor-app/backend/convex/_generated/api";
import { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";

const Page = async ({
  params,
}: {
  params: Promise<{ opportunityId: Id<"opportunitiesMergersAndAcquisitions"> }>;
}) => {
  const { opportunityId } = await params;

  const opportunity = await fetchQuery(api.private.mergersAndAcquisitionsOpportunities.getById, { opportunityId: opportunityId as Id<"opportunitiesMergersAndAcquisitions"> });

  return <div>Opportunity ID {opportunityId}</div>;
};

export default Page;