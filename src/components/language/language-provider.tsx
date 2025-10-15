import { I18nProviderClient } from "@/locales/client";

function LanguageProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}

export { LanguageProvider };
