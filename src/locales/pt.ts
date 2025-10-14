import loginForm from "./auth/login-form/pt";
import requestAccessForm from "./auth/request-access-form/pt";
import sidebar from "./backoffice/sidebar/pt";
import languageSwitcher from "./language-switcher/pt";
import index from "./pages/index/pt";
import themeSwitcher from "./theme-switcher/pt";

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
