"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPusherClient } from "@/lib/pusher-client";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

type AccessRequestNotification = {
  accessRequestId: string;
  name: string;
  email: string;
  company: string;
  timestamp: string;
};

export default function NotificationsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useScopedI18n("backoffice.notifications");
  const [statusFilter, setStatusFilter] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | undefined
  >(undefined);

  const { data, isLoading } = useQuery(
    trpc.accessRequest.getMany.queryOptions({
      page: 1,
      pageSize: 100,
      status: statusFilter,
    })
  );

  const updateStatusMutation = useMutation(
    trpc.accessRequest.updateStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.accessRequest.getMany.queryOptions({
            page: 1,
            pageSize: 100,
            status: statusFilter,
          })
        );
      },
    })
  );

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("notifications");

    const handleAccessRequest = (
      notificationData: AccessRequestNotification
    ) => {
      toast.success(
        `New access request from ${notificationData.name} (${notificationData.company})`,
        {
          description: notificationData.email,
          duration: 5000,
        }
      );

      // Refresh the list
      queryClient.invalidateQueries(
        trpc.accessRequest.getMany.queryOptions({
          page: 1,
          pageSize: 100,
          status: statusFilter,
        })
      );
    };

    channel.bind("access-request", handleAccessRequest);

    return () => {
      channel.unbind("access-request", handleAccessRequest);
      pusher.unsubscribe("notifications");
    };
  }, [queryClient, trpc, statusFilter]);

  const handleStatusChange = async (
    id: string,
    status: "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    await updateStatusMutation.mutateAsync({ id, status });
    toast.success(`Request ${status.toLowerCase()}`);
  };

  const getStatusBadgeVariant = (
    status: "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    switch (status) {
      case "PENDING":
        return "default";
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "secondary";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Select
          onValueChange={(value) =>
            setStatusFilter(
              value === "all" ? undefined : (value as typeof statusFilter)
            )
          }
          value={statusFilter ?? "all"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("filter.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.all")}</SelectItem>
            <SelectItem value="PENDING">{t("filter.pending")}</SelectItem>
            <SelectItem value="APPROVED">{t("filter.approved")}</SelectItem>
            <SelectItem value="REJECTED">{t("filter.rejected")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {data?.items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t("empty")}
            </CardContent>
          </Card>
        ) : (
          data?.items.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{request.name}</CardTitle>
                    <CardDescription>{request.email}</CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t("fields.company")}:</span>{" "}
                    {request.company}
                  </div>
                  <div>
                    <span className="font-medium">{t("fields.position")}:</span>{" "}
                    {request.position}
                  </div>
                  <div>
                    <span className="font-medium">{t("fields.phone")}:</span>{" "}
                    {request.phone}
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("fields.createdAt")}:
                    </span>{" "}
                    {new Date(request.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium">{t("fields.message")}:</span>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {request.message}
                  </p>
                </div>
                {request.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      disabled={updateStatusMutation.isPending}
                      onClick={() => handleStatusChange(request.id, "APPROVED")}
                      size="sm"
                    >
                      {t("actions.approve")}
                    </Button>
                    <Button
                      disabled={updateStatusMutation.isPending}
                      onClick={() => handleStatusChange(request.id, "REJECTED")}
                      size="sm"
                      variant="outline"
                    >
                      {t("actions.reject")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
