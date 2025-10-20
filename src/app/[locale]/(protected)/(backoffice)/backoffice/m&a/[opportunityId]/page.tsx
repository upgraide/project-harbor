import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Editor,
  EditorError,
  EditorLoading,
} from "@/features/editor/components/m&a-editor";
import { EditorHeader } from "@/features/editor/components/m&a-editor-header";
import { prefetchMAOpportunity } from "@/features/opportunities/server/prefetch";
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
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader opportunityId={opportunityId} />
          <main className="flex-1">
            <Editor opportunityId={opportunityId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
