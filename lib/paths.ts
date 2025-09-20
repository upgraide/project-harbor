export const homePath = () => "/";

// (Auth) - Localized
export const signInPath = (locale: string = "pt") => `/${locale}/sign-in`;
export const signUpPath = (locale: string = "pt") => `/${locale}/sign-up`;
export const requestAccessPath = (locale: string = "pt") =>
  `/${locale}/request-access`;

// (Dashboard) - User Facing (Protected) - Localized
export const dashboardPath = (locale: string = "pt") => `/${locale}/dashboard`;
