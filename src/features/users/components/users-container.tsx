import { EntityContainer } from "@/components/entity-components";
import { UsersHeader } from "./users-header";
import { UsersPagination } from "./users-pagination";
import { UsersSearch } from "./users-search";

type UsersContainerProps = {
  children: React.ReactNode;
};

export const UsersContainer = ({ children }: UsersContainerProps) => (
  <div className="h-full w-full overflow-x-hidden p-4 md:px-10 md:py-6">
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-y-8 overflow-hidden">
      <UsersHeader />
      <div className="flex h-full min-w-0 flex-col gap-y-4 overflow-hidden">
        <UsersSearch />
        <div className="flex min-w-0 flex-col gap-y-4 overflow-hidden">{children}</div>
      </div>
    </div>
  </div>
);
