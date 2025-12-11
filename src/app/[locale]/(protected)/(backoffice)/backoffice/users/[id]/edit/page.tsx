import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserEditContainer } from "@/features/users/components/user-edit-container";
import { UserEditContent } from "@/features/users/components/user-edit-form";
import {
  UserEditError,
  UserEditLoading,
} from "@/features/users/components/user-edit-states";
import { prefetchUser } from "@/features/users/server/prefetch";
import { requireTeam } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
};

const Page = async ({ params }: Props) => {
  await requireTeam();
  const { id } = await params;
  prefetchUser(id);
  
  return (
    <UserEditContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<UserEditError />}>
          <Suspense fallback={<UserEditLoading />}>
            <UserEditContent userId={id} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </UserEditContainer>
  );
};

export default Page;
