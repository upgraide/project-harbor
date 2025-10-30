import { createI18nServer } from "next-international/server";

const {
  getI18n: getI18nRaw,
  getScopedI18n: getScopedI18nRaw,
  getStaticParams,
} = createI18nServer({
  en: () => import("./en"),
  pt: () => import("./pt"),
});

// Wrapper to avoid TypeScript excessive complexity when comparing translation types
export const getScopedI18n = async (scope: string) => {
  // biome-ignore lint/suspicious/noExplicitAny: Type escape needed for i18n scope flexibility
  const t = await getScopedI18nRaw(scope as any);
  return t as (key: string) => string;
};

export const getI18n = async () => {
  // biome-ignore lint/suspicious/noExplicitAny: Type escape needed for i18n function return
  const t = (await getI18nRaw()) as any;
  return {
    t: t as (key: string) => string,
  };
};

export { getStaticParams };
