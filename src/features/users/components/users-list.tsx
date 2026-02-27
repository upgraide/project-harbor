"use client";

import { CheckCircle, EditIcon, TrashIcon, XCircle } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { backofficeUsersPath } from "@/paths";
import { useActivateUser } from "../hooks/use-activate-user";
import { useCurrentUserRole } from "../hooks/use-current-user-role";
import { useDeactivateUser } from "../hooks/use-deactivate-user";
import { useDeleteUser } from "../hooks/use-delete-user";
import { useSuspenseUsers } from "../hooks/use-users";
import { UsersPagination } from "./users-pagination";

export const UsersContent = () => (
  <>
    <UsersList />
    <UsersPagination />
  </>
);

export const UsersList = () => {
  const users = useSuspenseUsers();
  const t = useScopedI18n("backoffice.users");
  const deleteUser = useDeleteUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const { data: currentUserRole } = useCurrentUserRole();
  const isAdmin = currentUserRole === Role.ADMIN;
  const isTeam = currentUserRole === Role.TEAM;

  if (users.data.items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">{t("emptyMessage")}</p>
      </div>
    );
  }

  type UserItem = (typeof users.data.items)[number];

  const handleDelete = (userId: string) => {
    deleteUser.mutate({ id: userId });
  };

  const handleActivate = (userId: string) => {
    activateUser.mutate({ id: userId });
  };

  const handleDeactivate = (userId: string) => {
    deactivateUser.mutate({ id: userId });
  };

  // Check if current user can edit a specific user
  const canEditUser = (user: UserItem) => {
    if (isAdmin) return true;
    if (isTeam && user.role === Role.USER) return true;
    return false;
  };

  // Check if current user can change status of a specific user
  const canChangeStatus = (user: UserItem) => {
    if (isAdmin) return true;
    if (isTeam && user.role === Role.USER) return true;
    return false;
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return t("table.roleAdmin");
      case Role.TEAM:
        return t("table.roleTeam");
      case Role.USER:
        return t("table.roleUser");
      default:
        return role;
    }
  };

  return (
    <div className="max-h-[calc(100vh-16rem)] overflow-auto rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead>{t("table.role")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            {(isAdmin || isTeam) && (
              <TableHead className="w-32">{t("table.actions")}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data.items.map((user: UserItem) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === Role.ADMIN ? "default" : "secondary"}
                >
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? t("table.active") : t("table.inactive")}
                </Badge>
              </TableCell>
              {(isAdmin || isTeam) && (
                <TableCell>
                  <div className="flex items-center gap-1">
                    {canEditUser(user) && (
                      <Button
                        asChild
                        size="sm"
                        title={t("table.edit")}
                        variant="ghost"
                      >
                        <Link href={`${backofficeUsersPath()}/${user.id}/edit`}>
                          <EditIcon className="size-4" />
                        </Link>
                      </Button>
                    )}
                    {canChangeStatus(user) &&
                      (user.isActive ? (
                        <Button
                          disabled={deactivateUser.isPending}
                          onClick={() => handleDeactivate(user.id)}
                          size="sm"
                          title={t("table.deactivate")}
                          variant="ghost"
                        >
                          <XCircle className="size-4" />
                        </Button>
                      ) : (
                        <Button
                          disabled={activateUser.isPending}
                          onClick={() => handleActivate(user.id)}
                          size="sm"
                          title={t("table.activate")}
                          variant="ghost"
                        >
                          <CheckCircle className="size-4" />
                        </Button>
                      ))}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={deleteUser.isPending}
                          size="sm"
                          variant="ghost"
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>
                          {t("deleteDialog.title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("deleteDialog.description").replace(
                            "{name}",
                            user.name
                          )}
                        </AlertDialogDescription>
                        <div className="flex justify-end gap-2">
                          <AlertDialogCancel>
                            {t("deleteDialog.cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDelete(user.id)}
                          >
                            {t("deleteDialog.confirm")}
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
