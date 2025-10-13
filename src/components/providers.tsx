import type { ReactNode } from "react";
import { LanguageProvider } from "./language/language-provider";
import { ThemeProvider } from "./theme/theme-provider";

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
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}
