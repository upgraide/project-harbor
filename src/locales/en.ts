import loginForm from "./auth/login-form/en";
import requestAccessForm from "./auth/request-access-form/en";
import sidebar from "./backoffice/sidebar/en";
import languageSwitcher from "./language-switcher/en";
import index from "./pages/index/en";
import themeSwitcher from "./theme-switcher/en";

export default {
  index,
  languageSwitcher,
  themeSwitcher,
  auth: {
    loginForm,
    requestAccessForm,
  },
  backoffice: {
    sidebar,
  },
} as const;
