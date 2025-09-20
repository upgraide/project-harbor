"use client";

import type { ReactNode } from "react";
import { I18nProviderClient } from "@/locales/client";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}
