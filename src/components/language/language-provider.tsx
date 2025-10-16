import { I18nProviderClient } from "@/locales/client";
import { Spinner } from "../ui/spinner";

function LanguageProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <I18nProviderClient fallback={<Fallback />} locale={locale}>
      {children}
    </I18nProviderClient>
  );
}

const Fallback = () => (
  <div className="flex min-h-dvh flex-1 flex-col items-center justify-center">
    <Spinner className="size-6" />
  </div>
);

export { LanguageProvider };
