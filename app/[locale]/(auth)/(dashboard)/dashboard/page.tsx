import { getScopedI18n } from "@/locales/server";
import Header from "@/modules/dashboard/ui/components/header";

const Page = async () => {
  const t = await getScopedI18n("dashboard.header");

  return (
    <div>
      <Header description={t("description")} title={t("title")} />
    </div>
  );
};

export default Page;
