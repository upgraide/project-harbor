import { UsersIcon } from "lucide-react";
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
import { crmLeadsPath } from "@/paths";

const Page = async () => {
  const t = await getScopedI18n("crm.main");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("welcome")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="size-5" />
              {t("features.leads.title")}
            </CardTitle>
            <CardDescription>{t("features.leads.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={crmLeadsPath()}>
              <Button className="w-full">{t("features.leads.action")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
