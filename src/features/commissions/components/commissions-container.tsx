"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserRole } from "@/features/users/hooks/use-current-user-role";
import { Role } from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";
import { AdminOverview } from "./admin-overview";
import { MyCommissions } from "./my-commissions";

export const CommissionsContainer = () => {
  const t = useScopedI18n("crm.commissions");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: currentUserRole, isLoading } = useCurrentUserRole();
  const isAdmin = currentUserRole === Role.ADMIN;
  const isTeam = currentUserRole === Role.TEAM;

  // Get view mode from URL or default to "my"
  const viewMode = (searchParams.get("view") as "my" | "admin") || "my";

  const handleViewChange = (value: "my" | "admin") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);
    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {isAdmin && (
          <Select onValueChange={handleViewChange} value={viewMode}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="my">
                {t("viewSelector.myCommissions")}
              </SelectItem>
              <SelectItem value="admin">
                {t("viewSelector.adminOverview")}
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        }
      >
        {viewMode === "my" ? <MyCommissions /> : <AdminOverview />}
      </Suspense>
    </div>
  );
};
