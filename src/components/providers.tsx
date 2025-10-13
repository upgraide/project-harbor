"use client";

import type { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { I18nProviderClient } from "@/locales/client";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return (
    <I18nProviderClient fallback={<Spinner />} locale={locale}>
      {children}
    </I18nProviderClient>
  );
}
