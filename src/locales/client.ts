"use client";

import { createI18nClient } from "next-international/client";

const {
  useI18n: useI18nRaw,
  useScopedI18n: useScopedI18nRaw,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient({
  en: () => import("./en"),
  pt: () => import("./pt"),
});

// Wrapper to avoid TypeScript excessive complexity when comparing translation types
export const useScopedI18n = (scope: string) => {
  // biome-ignore lint/suspicious/noExplicitAny: Type escape needed for i18n scope flexibility
  const t = useScopedI18nRaw(scope as any);
  return t as (key: string) => string;
};

export const useI18n = () => {
  // biome-ignore lint/suspicious/noExplicitAny: Type escape needed for i18n function return
  const t = useI18nRaw() as any;
  return {
    t: t as (key: string) => string,
  };
};

export { I18nProviderClient, useChangeLocale, useCurrentLocale };
