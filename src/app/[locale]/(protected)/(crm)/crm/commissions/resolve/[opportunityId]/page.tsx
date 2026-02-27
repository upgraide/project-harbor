"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommissionResolution } from "@/features/commissions/components/commission-resolution";
import { useScopedI18n } from "@/locales/client";
import { crmCommissionsPath } from "@/paths";

interface CommissionResolutionPageProps {
  params: Promise<{ opportunityId: string }>;
  searchParams: Promise<{ type?: string; returnTab?: string }>;
}

function CommissionResolutionError({
  onRetry,
  errorMessage,
}: {
  onRetry?: () => void;
  errorMessage?: string;
}) {
  const t = useScopedI18n("crm.commissions");

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>{t("errorPage.title")}</CardTitle>
          </div>
          <CardDescription>{t("errorPage.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="font-medium text-amber-800 text-sm">
                Technical details:
              </p>
              <p className="mt-1 text-amber-700 text-sm">{errorMessage}</p>
            </div>
          )}
          <p className="mb-4 text-muted-foreground text-sm">
            {t("errorPage.message")}
          </p>
          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="default">
                Retry
              </Button>
            )}
            <Link href={crmCommissionsPath()}>
              <Button variant="outline">{t("errorPage.backButton")}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CommissionResolutionPage({
  params,
  searchParams,
}: CommissionResolutionPageProps) {
  const { opportunityId } = use(params);
  const search = use(searchParams);

  // Safely handle the type parameter - ensure it's a string before calling toUpperCase
  const typeParam = typeof search.type === "string" ? search.type : "";
  const opportunityType = (typeParam.toUpperCase() || "MNA") as
    | "MNA"
    | "REAL_ESTATE";

  return (
    <div className="flex flex-col gap-6 p-6">
      <CommissionResolution
        fallback={<CommissionResolutionError />}
        opportunityId={opportunityId}
        opportunityType={opportunityType}
      />
    </div>
  );
}
