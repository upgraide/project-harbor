"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity, Phone, Mail, Calendar, FileText, CheckSquare, Eye, Heart, XCircle, RefreshCw, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";
import { ActivityType } from "@/generated/prisma";

type InvestorActivitiesProps = {
  investorId: string;
};

const activityIcons: Record<ActivityType, React.ElementType> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Calendar,
  NOTE: FileText,
  TASK: CheckSquare,
  DEAL_VIEWED: Eye,
  DEAL_INTERESTED: Heart,
  DEAL_NOT_INTERESTED: XCircle,
  STATUS_CHANGE: RefreshCw,
  ASSIGNMENT_CHANGE: UserPlus,
  FOLLOW_UP_SCHEDULED: Calendar,
  OTHER: Activity,
};

const activityLabels: Record<ActivityType, string> = {
  CALL: "Call",
  EMAIL: "Email",
  MEETING: "Meeting",
  NOTE: "Note",
  TASK: "Task",
  DEAL_VIEWED: "Deal Viewed",
  DEAL_INTERESTED: "Interested in Deal",
  DEAL_NOT_INTERESTED: "Not Interested in Deal",
  STATUS_CHANGE: "Status Change",
  ASSIGNMENT_CHANGE: "Assignment Change",
  FOLLOW_UP_SCHEDULED: "Follow-up Scheduled",
  OTHER: "Other",
};

export const InvestorActivities = ({ investorId }: InvestorActivitiesProps) => {
  const trpc = useTRPC();

  const { data: activities } = useSuspenseQuery(
    trpc.investors.getActivities.queryOptions({ userId: investorId })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Timeline ({activities.length})
        </CardTitle>
        <CardDescription>
          Complete history of interactions and activities with this investor
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activities recorded</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.activityType];
              return (
                <div
                  key={activity.id}
                  className="flex gap-4 border-l-2 border-muted pl-4 pb-4 last:pb-0 relative"
                >
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                    <Icon className="h-2 w-2" />
                  </div>
                  <div className="flex-1 space-y-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {activityLabels[activity.activityType]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(activity.createdAt), "PPp")}
                      </span>
                    </div>
                    <h4 className="font-medium">{activity.title}</h4>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
