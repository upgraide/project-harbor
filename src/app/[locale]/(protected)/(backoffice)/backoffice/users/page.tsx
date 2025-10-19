import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UsersContainer } from "@/features/users/components/users-container";
import { UsersList } from "@/features/users/components/users-list";
import {
  UsersError,
  UsersLoading,
} from "@/features/users/components/users-states";
import { usersParamsLoader } from "@/features/users/server/params-loader";
import { prefetchUsers } from "@/features/users/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();
  const params = await usersParamsLoader(searchParams);
  prefetchUsers(params);
  return (
    <UsersContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<UsersError />}>
          <Suspense fallback={<UsersLoading />}>
            <UsersList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </UsersContainer>
  );
};

export default Page;
