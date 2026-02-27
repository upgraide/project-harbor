import { AccessRequestsPage } from "@/features/access-requests/components/access-requests-page";
import { requireTeam } from "@/lib/auth-utils";
import { getScopedI18n } from "@/locales/server";

const Page = async () => {
  await requireTeam();
  const t = await getScopedI18n("backoffice.accessRequests");

  return (
    <div className="h-full w-full overflow-x-hidden p-4 md:px-10 md:py-6">
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-y-8 overflow-hidden">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <AccessRequestsPage />
      </div>
    </div>
  );
};

export default Page;
