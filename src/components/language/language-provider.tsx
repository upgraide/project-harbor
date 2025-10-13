import { I18nProviderClient } from "@/locales/client";
import { LocationFallback } from "./language-provider-fallback";

function LanguageProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <I18nProviderClient fallback={<LocationFallback />} locale={locale}>
      {children}
    </I18nProviderClient>
  );
}

export { LanguageProvider };
