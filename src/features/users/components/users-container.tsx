import { EntityContainer } from "@/components/entity-components";
import { UsersHeader } from "./users-header";
import { UsersPagination } from "./users-pagination";
import { UsersSearch } from "./users-search";

type UsersContainerProps = {
  children: React.ReactNode;
};

export const UsersContainer = ({ children }: UsersContainerProps) => (
  <EntityContainer
    header={<UsersHeader />}
    pagination={<UsersPagination />}
    search={<UsersSearch />}
  >
    {children}
  </EntityContainer>
);
