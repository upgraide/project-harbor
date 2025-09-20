"use client";

import type { ReactNode } from "react";
import { I18nProviderClient } from "@/locales/client";
import { ConvexClientProvider } from "./convex-client-provider";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return (
    <I18nProviderClient locale={locale}>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </I18nProviderClient>
  );
}
