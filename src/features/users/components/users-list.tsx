"use client";

import { TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useScopedI18n } from "@/locales/client";
import { useDeleteUser } from "../hooks/use-delete-user";
import { useSuspenseUsers } from "../hooks/use-users";

export const UsersList = () => {
  const users = useSuspenseUsers();
  const t = useScopedI18n("backoffice.users");
  const deleteUser = useDeleteUser();

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

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead className="w-12">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data.items.map((user: UserItem) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
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
                      {t("deleteDialog.description", { name: user.name })}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
