import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { prefetchMAOpportunity } from "@/features/opportunities/server/prefetch";
import {
  Viewer,
  ViewerError,
  ViewerLoading,
} from "@/features/viewer/components/m&a-viewer";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type PageProps = {
  params: Promise<{
    opportunityId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { opportunityId } = await params;
  prefetchMAOpportunity(opportunityId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ViewerError />}>
        <Suspense fallback={<ViewerLoading />}>
          <main className="flex-1">
            <Viewer opportunityId={opportunityId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
