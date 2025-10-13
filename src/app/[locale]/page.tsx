import { LanguageSwitcher } from "@/components/language/language-switcher";
import {
  ThemeSwitcher,
  ThemeSwitcherHome,
} from "@/components/theme/theme-switcher";
import { getI18n, getScopedI18n } from "../../locales/server";

export default async function Page() {
  const t = await getI18n();
  const scopedT = await getScopedI18n("index");

  return (
    <div>
      <p>{t("index.hello")}</p>

      {/* Both are equivalent: */}
      <p>{t("index.hello.world")}</p>
      <p>{scopedT("hello.world")}</p>

      <p>{t("index.welcome", { name: "John" })}</p>
      <p>{t("index.welcome", { name: <strong>John</strong> })}</p>

      <LanguageSwitcher />
      <ThemeSwitcher />
      <ThemeSwitcherHome />
    </div>
  );
}
