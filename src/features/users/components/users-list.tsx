"use client";

import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { useSuspenseUsers } from "../hooks/use-users";

export const UsersList = () => {
  const users = useSuspenseUsers();
  const locale = useCurrentLocale();
  const t = useScopedI18n("backoffice.users");

  if (users.data.items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">{t("emptyMessage")}</p>
      </div>
    );
  }

  type UserItem = (typeof users.data.items)[number];
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead>{t("table.joinedDate")}</TableHead>
            <TableHead>{t("table.lastLogin")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data.items.map((user: UserItem) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {formatDistanceToNow(user.createdAt, {
                  addSuffix: true,
                  locale: locale === "pt" ? pt : undefined,
                })}
              </TableCell>
              <TableCell>
                {user.lastLoginAt
                  ? formatDistanceToNow(user.lastLoginAt, {
                      addSuffix: true,
                      locale: locale === "pt" ? pt : undefined,
                    })
                  : t("table.neverLoggedIn")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
