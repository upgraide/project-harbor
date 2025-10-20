import loginForm from "./auth/login-form/en";
import requestAccessForm from "./auth/request-access-form/en";
import entityComponents from "./backoffice/entity-components/en";
import mergersAndAcquisitionOpportunites from "./backoffice/mergers-and-acquisition-opportunites/en";
import mergersAndAcquisitionCreatePage from "./backoffice/mergers-and-acquisitions-create-page/en";
import mergersAndAcquisitionOpportunityPage from "./backoffice/mergers-and-acquisitions-opportunity-page/en";
import realEstateCreatePage from "./backoffice/real-estate-create-page/en";
import realEstateOpportunities from "./backoffice/real-estate-opportunities/en";
import sidebar from "./backoffice/sidebar/en";
import users from "./backoffice/users/en";
import navigation from "./dashboard/naviagation/pt";
import opportunities from "./dashboard/opportunities/en";
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
    mergersAndAcquisitionOpportunites,
    entityComponents,
    mergersAndAcquisitionOpportunityPage,
    mergersAndAcquisitionCreatePage,
    users,
    realEstateCreatePage,
    realEstateOpportunities,
  },
  dashboard: {
    navigation,
    opportunities,
  },
} as const;
