import { getScopedI18n } from "@/locales/server";

export default async function Home() {
  const t = await getScopedI18n("dashboard");

  return <h1>{t("title")}</h1>;
}
