"use client";

import { use } from "react";
import { CommissionResolution } from "@/features/commissions/components/commission-resolution";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { crmCommissionsPath } from "@/paths";
import { useScopedI18n } from "@/locales/client";

interface CommissionResolutionPageProps {
  params: Promise<{ opportunityId: string }>;
  searchParams: Promise<{ type?: string }>;
}

function CommissionResolutionError() {
  const t = useScopedI18n("crm.commissions");
  
  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>{t("errorPage.title")}</CardTitle>
          </div>
          <CardDescription>
            {t("errorPage.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t("errorPage.message")}
          </p>
          <Link href={crmCommissionsPath()}>
            <Button variant="outline">{t("errorPage.backButton")}</Button>
          </Link>
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
  const opportunityType = (search.type?.toUpperCase() || "MNA") as "MNA" | "REAL_ESTATE";

  return (
    <div className="flex flex-col gap-6 p-6">
      <CommissionResolution 
        opportunityId={opportunityId}
        opportunityType={opportunityType}
        fallback={<CommissionResolutionError />}
      />
    </div>
  );
}
