import type { ReactNode } from "react";
import { I18nProviderClient } from "@/locales/client";
import { Spinner } from "./ui/spinner";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return (
    <I18nProviderClient fallback={<LocationFallback />} locale={locale}>
      {children}
    </I18nProviderClient>
  );
}

const LocationFallback = () => (
  <div className="flex h-screen flex-1 items-center justify-center">
    <Spinner />
  </div>
);
