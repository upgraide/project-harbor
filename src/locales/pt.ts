import loginForm from "./auth/login-form/pt";
import requestAccessForm from "./auth/request-access-form/pt";
import entityComponents from "./backoffice/entity-components/pt";
import mergersAndAcquisitionOpportunites from "./backoffice/mergers-and-acquisition-opportunites/pt";
import mergersAndAcquisitionCreatePage from "./backoffice/mergers-and-acquisitions-create-page/pt";
import mergersAndAcquisitionOpportunityPage from "./backoffice/mergers-and-acquisitions-opportunity-page/pt";
import realEstateOpportunities from "./backoffice/real-estate-opportunities/pt";
import sidebar from "./backoffice/sidebar/pt";
import users from "./backoffice/users/pt";
import navigation from "./dashboard/naviagation/en";
import opportunities from "./dashboard/opportunities/pt";
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
    mergersAndAcquisitionOpportunites,
    entityComponents,
    mergersAndAcquisitionOpportunityPage,
    realEstateOpportunities,
    mergersAndAcquisitionCreatePage,
    users,
  },
  dashboard: {
    navigation,
    opportunities,
  },
} as const;
