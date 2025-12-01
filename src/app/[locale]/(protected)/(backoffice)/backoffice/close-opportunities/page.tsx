import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  CloseOpportunitiesError,
  CloseOpportunitiesList,
  CloseOpportunitiesLoading,
} from "@/features/close-opportunities/components/close-opportunities-list";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireTeam();

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<CloseOpportunitiesError />}>
        <Suspense fallback={<CloseOpportunitiesLoading />}>
          <CloseOpportunitiesList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
