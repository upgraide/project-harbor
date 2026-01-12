import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RealEstateInterests, OpportunitiesLoading, OpportunitiesError } from "@/features/investment-interests/components/real-estate-interests";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type PageProps = {
  params: Promise<{
    opportunityId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  await requireTeam();
  const { opportunityId } = await params;

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<OpportunitiesError message="Failed to load interests" />}>
        <Suspense fallback={<OpportunitiesLoading />}>
          <RealEstateInterests opportunityId={opportunityId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
