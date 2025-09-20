"use client";

import { createI18nClient } from "next-international/client";

export const languages = ["en", "pt"];

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
}: ReturnType<typeof createI18nClient> = createI18nClient({
  en: () => import("./en"),
  pt: () => import("./pt"),
});
