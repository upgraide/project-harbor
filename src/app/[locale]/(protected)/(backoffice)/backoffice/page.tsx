import { ClipboardCheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getScopedI18n } from "@/locales/server";
import { backofficeCloseOpportunitiesPath } from "@/paths";

const Page = async () => {
  const t = await getScopedI18n("backoffice.closeOpportunities");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backoffice</h1>
        <p className="text-muted-foreground">
          Welcome to the backoffice management area
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheckIcon className="size-5" />
              {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={backofficeCloseOpportunitiesPath()}>
              <Button className="w-full">Access Feature</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
