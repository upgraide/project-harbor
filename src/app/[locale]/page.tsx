import { getI18n, getScopedI18n } from "@/locales/server";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getI18n();
  const scopedT = await getScopedI18n("hello");

  return (
    <div className="space-y-4 p-8">
      <p className="text-gray-500 text-sm">Current locale: {locale}</p>

      <p>{t("hello")}</p>

      {/* Both are equivalent: */}
      <p>{t("hello.world")}</p>
      <p>{scopedT("world")}</p>

      <p>{t("welcome", { name: "John" })}</p>
      <p>{t("welcome", { name: <strong>{"John"}</strong> })}</p>
    </div>
  );
}
