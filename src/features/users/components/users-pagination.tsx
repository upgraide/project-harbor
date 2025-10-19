"use client";

import { EntityPagination } from "@/components/entity-components";
import { useSuspenseUsers } from "../hooks/use-users";
import { useUsersParams } from "../hooks/use-users-params";

export const UsersPagination = () => {
  const users = useSuspenseUsers();
  const [params, setParams] = useUsersParams();

  return (
    <EntityPagination
      disabled={users.isFetching}
      onPageChange={(page) => setParams({ ...params, page })}
      page={users.data.page}
      totalPages={users.data.totalPages}
    />
  );
};
