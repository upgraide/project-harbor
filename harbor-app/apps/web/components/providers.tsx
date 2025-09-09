"use client";

import { Toaster } from "@harbor-app/ui/components/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { ConvexClientProvider } from "./convex-client-provider";
import { DevMessage } from "./dev-message";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
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
    </ConvexClientProvider>
  );
}
