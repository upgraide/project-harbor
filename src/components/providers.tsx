import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/components/language/language-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <TRPCReactProvider>
        <NuqsAdapter>
          <LanguageProvider locale={locale}>
            {children}
            <Toaster richColors />
          </LanguageProvider>
        </NuqsAdapter>
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
