import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@harbor-app/ui/components/card";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";

const Page = async ({
  params,
}: {
  params: Promise<{ opportunityId: Id<"opportunitiesMergersAndAcquisitions"> }>;
}) => {
  const { opportunityId } = await params;

  const opportunity = await fetchQuery(
    api.private.mergersAndAcquisitionsOpportunities.getById,
    {
      opportunityId: opportunityId as Id<"opportunitiesMergersAndAcquisitions">,
    },
    { token: await convexAuthNextjsToken() },
  );

  return (
    <div className="w-full mx-auto my-auto">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{opportunity.name}</p>
          <p>{opportunity.description}</p>
          <p>{opportunity.sales}</p>
          <p>{opportunity.ebitda}</p>
          <p>{opportunity.industry}</p>
          <p>{opportunity.subIndustry}</p>
          <p>{opportunity.type}</p>
          <p>{opportunity.typeDetails}</p>
          <p>{opportunity.status}</p>
          <p>{opportunity.createdBy?.name}</p>
          <p>{opportunity.createdBy?.email}</p>
          <p>{opportunity.createdBy?.avatarURL}</p>
        </CardContent>
      </Card>
      {opportunity.imagesURLs.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {opportunity.imagesURLs.map((image) => (
            <Image
              alt="Opportunity Image"
              height={1250}
              key={image}
              src={image}
              width={1250}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
