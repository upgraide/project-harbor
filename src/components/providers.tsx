import type { ReactNode } from "react";
import { LanguageProvider } from "@/components/language/language-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TRPCReactProvider } from "@/trpc/client";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return (
    <LanguageProvider locale={locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
