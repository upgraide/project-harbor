"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
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
import {
  useAccessRequests,
  useApproveAccessRequest,
  useRejectAccessRequest,
} from "../hooks/use-access-requests";

export const AccessRequestsPage = () => {
  const t = useScopedI18n("backoffice.accessRequests");
  const { data, isLoading, isError } = useAccessRequests();
  const approve = useApproveAccessRequest();
  const reject = useRejectAccessRequest();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-muted-foreground">{t("errorMessage")}</p>
      </div>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-muted-foreground">{t("emptyMessage")}</p>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-16rem)] overflow-auto rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead>{t("table.company")}</TableHead>
            <TableHead>{t("table.phone")}</TableHead>
            <TableHead>{t("table.position")}</TableHead>
            <TableHead>{t("table.date")}</TableHead>
            <TableHead className="w-40">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.company}</TableCell>
              <TableCell>{request.phone}</TableCell>
              <TableCell>{request.position}</TableCell>
              <TableCell>
                {new Date(request.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    disabled={approve.isPending}
                    onClick={() => approve.mutate({ id: request.id })}
                    size="sm"
                    variant="ghost"
                    title={t("approveButton")}
                  >
                    {approve.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CheckCircle className="size-4 text-green-600" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={reject.isPending}
                        size="sm"
                        variant="ghost"
                        title={t("rejectButton")}
                      >
                        {reject.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <XCircle className="size-4 text-red-600" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>
                        {t("rejectDialog.title")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("rejectDialog.description").replace(
                          "{name}",
                          request.name
                        )}
                      </AlertDialogDescription>
                      <div className="flex justify-end gap-2">
                        <AlertDialogCancel>
                          {t("rejectDialog.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => reject.mutate({ id: request.id })}
                        >
                          {t("rejectDialog.confirm")}
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
