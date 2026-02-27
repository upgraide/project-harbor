"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellOff,
  CheckCheck,
  Eye,
  FileText,
  Handshake,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
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
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPusherClient } from "@/lib/pusher-client";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

type NotificationType =
  | "ACCESS_REQUEST"
  | "OPPORTUNITY_INTEREST"
  | "OPPORTUNITY_NOT_INTERESTED"
  | "OPPORTUNITY_NDA_SIGNED"
  | "OPPORTUNITY_CONCLUDED"
  | "OPPORTUNITY_STATUS_CHANGE"
  | "COMMISSION_RESOLVED"
  | "LEAD_STATUS_CHANGE"
  | "LEAD_FOLLOW_UP"
  | "NEW_USER_REGISTERED";

type PusherNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  opportunityId?: string;
  opportunityType?: string;
  createdAt: string;
};

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "ACCESS_REQUEST":
      return <UserPlus className="h-4 w-4" />;
    case "OPPORTUNITY_INTEREST":
      return <ThumbsUp className="h-4 w-4" />;
    case "OPPORTUNITY_NOT_INTERESTED":
      return <ThumbsDown className="h-4 w-4" />;
    case "OPPORTUNITY_NDA_SIGNED":
      return <FileText className="h-4 w-4" />;
    case "OPPORTUNITY_CONCLUDED":
      return <Handshake className="h-4 w-4" />;
    case "OPPORTUNITY_STATUS_CHANGE":
      return <TrendingUp className="h-4 w-4" />;
    case "COMMISSION_RESOLVED":
      return <ShieldCheck className="h-4 w-4" />;
    case "LEAD_STATUS_CHANGE":
      return <Users className="h-4 w-4" />;
    case "LEAD_FOLLOW_UP":
      return <Eye className="h-4 w-4" />;
    case "NEW_USER_REGISTERED":
      return <UserPlus className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

function getNotificationBadgeVariant(type: NotificationType) {
  switch (type) {
    case "OPPORTUNITY_NOT_INTERESTED":
      return "secondary" as const;
    case "OPPORTUNITY_STATUS_CHANGE":
    case "LEAD_STATUS_CHANGE":
    case "LEAD_FOLLOW_UP":
      return "outline" as const;
    default:
      return "default" as const;
  }
}

function NotificationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

export default function NotificationsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useScopedI18n("backoffice.notifications");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">(
    "all"
  );

  const { data, isLoading } = useQuery(
    trpc.notifications.getMany.queryOptions({
      page: 1,
      pageSize: 50,
      readFilter,
    })
  );

  const { data: unreadData } = useQuery(
    trpc.notifications.getUnreadCount.queryOptions()
  );

  const markAsReadMutation = useMutation(
    trpc.notifications.markAsRead.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.notifications.getMany.queryOptions({
            page: 1,
            pageSize: 50,
            readFilter,
          })
        );
        queryClient.invalidateQueries(
          trpc.notifications.getUnreadCount.queryOptions()
        );
      },
    })
  );

  const markAllAsReadMutation = useMutation(
    trpc.notifications.markAllAsRead.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.notifications.getMany.queryOptions({
            page: 1,
            pageSize: 50,
            readFilter,
          })
        );
        queryClient.invalidateQueries(
          trpc.notifications.getUnreadCount.queryOptions()
        );
        toast.success(t("allMarkedRead"));
      },
    })
  );

  // Subscribe to real-time notifications via Pusher
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("notifications");

    const handleNotification = (notificationData: PusherNotification) => {
      toast.info(notificationData.title, {
        description: notificationData.message,
        duration: 5000,
      });

      queryClient.invalidateQueries(
        trpc.notifications.getMany.queryOptions({
          page: 1,
          pageSize: 50,
          readFilter,
        })
      );
      queryClient.invalidateQueries(
        trpc.notifications.getUnreadCount.queryOptions()
      );
    };

    channel.bind("notification", handleNotification);
    channel.bind("access-request", handleNotification);

    return () => {
      channel.unbind("notification", handleNotification);
      channel.unbind("access-request", handleNotification);
      pusher.unsubscribe("notifications");
    };
  }, [queryClient, trpc, readFilter]);

  const handleMarkAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync({ id });
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 1) return t("timeAgo.justNow");
    if (minutes < 60)
      return t("timeAgo.minutes").replace("{count}", String(minutes));
    if (hours < 24) return t("timeAgo.hours").replace("{count}", String(hours));
    if (days < 7) return t("timeAgo.days").replace("{count}", String(days));
    return d.toLocaleDateString();
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case "ACCESS_REQUEST":
        return t("types.accessRequest");
      case "OPPORTUNITY_INTEREST":
        return t("types.interest");
      case "OPPORTUNITY_NOT_INTERESTED":
        return t("types.notInterested");
      case "OPPORTUNITY_NDA_SIGNED":
        return t("types.ndaSigned");
      case "OPPORTUNITY_CONCLUDED":
        return t("types.concluded");
      case "OPPORTUNITY_STATUS_CHANGE":
        return t("types.statusChange");
      case "COMMISSION_RESOLVED":
        return t("types.commissionResolved");
      case "LEAD_STATUS_CHANGE":
        return t("types.leadStatusChange");
      case "LEAD_FOLLOW_UP":
        return t("types.leadFollowUp");
      case "NEW_USER_REGISTERED":
        return t("types.newUser");
      default:
        return type;
    }
  };

  const unreadCount = unreadData?.count ?? 0;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        {unreadCount > 0 && (
          <Button
            disabled={markAllAsReadMutation.isPending}
            onClick={handleMarkAllAsRead}
            size="sm"
            variant="outline"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            {t("markAllRead")}
            <Badge className="ml-2" variant="default">
              {unreadCount}
            </Badge>
          </Button>
        )}
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={(value) =>
          setReadFilter(value as "all" | "unread" | "read")
        }
        value={readFilter}
      >
        <TabsList>
          <TabsTrigger value="all">{t("filter.all")}</TabsTrigger>
          <TabsTrigger value="unread">
            <Bell className="mr-1.5 h-3.5 w-3.5" />
            {t("filter.unread")}
            {unreadCount > 0 && (
              <Badge className="ml-1.5" variant="default">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">
            <BellOff className="mr-1.5 h-3.5 w-3.5" />
            {t("filter.read")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={readFilter}>
          {isLoading ? (
            <div className="grid gap-4">
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </div>
          ) : data?.items.length === 0 ? (
            <Empty>
              <EmptyTitle>
                {readFilter === "unread"
                  ? t("emptyUnread")
                  : readFilter === "read"
                    ? t("emptyRead")
                    : t("empty")}
              </EmptyTitle>
              <EmptyDescription>
                {readFilter === "unread"
                  ? t("emptyUnreadDescription")
                  : readFilter === "read"
                    ? t("emptyReadDescription")
                    : t("emptyDescription")}
              </EmptyDescription>
            </Empty>
          ) : (
            <div className="grid gap-3">
              {data?.items.map((notification) => (
                <Card
                  className={cn(
                    "transition-colors",
                    !notification.read && "border-primary/20 bg-primary/[0.02]"
                  )}
                  key={notification.id}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            notification.read
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {getNotificationIcon(
                            notification.type as NotificationType
                          )}
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm leading-tight">
                            {notification.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {formatDate(notification.createdAt)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant={getNotificationBadgeVariant(
                            notification.type as NotificationType
                          )}
                        >
                          {getTypeLabel(notification.type as NotificationType)}
                        </Badge>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-end justify-between gap-4">
                      <p className="text-muted-foreground text-sm">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Button
                          className="shrink-0"
                          disabled={markAsReadMutation.isPending}
                          onClick={() => handleMarkAsRead(notification.id)}
                          size="sm"
                          variant="ghost"
                        >
                          <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                          {t("markRead")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
