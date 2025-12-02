import { getScopedI18n } from "@/locales/server";
import { LeadsListContainer } from "@/features/crm/components/leads-list-container";

const Page = async () => {
  const t = await getScopedI18n("crm.leads");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <LeadsListContainer />
    </div>
  );
};

export default Page;
