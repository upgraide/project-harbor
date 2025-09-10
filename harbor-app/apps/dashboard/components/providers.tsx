"use client";

import { Toaster } from "@harbor-app/ui/components/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { I18nProviderClient } from "@/locales/client";
import { ConvexClientProvider } from "./convex-client-provider";
import { DevMessage } from "./dev-message";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return (
    <ConvexClientProvider>
      <I18nProviderClient locale={locale}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableColorScheme
          enableSystem
        >
          {children}
          <DevMessage />
          <Toaster />
        </NextThemesProvider>
      </I18nProviderClient>
    </ConvexClientProvider>
  );
}
