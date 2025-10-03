"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { I18nProviderClient } from "@/locales/client";
import { ConvexClientProvider } from "./convex-client-provider";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return (
    <I18nProviderClient locale={locale}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableColorScheme
        enableSystem
      >
        <ConvexClientProvider>
          {children}
          <Toaster richColors />
        </ConvexClientProvider>
      </NextThemesProvider>
    </I18nProviderClient>
  );
}
