import loginForm from "./auth/login-form/pt";
import requestAccessForm from "./auth/request-access-form/pt";
import analytics from "./backoffice/analytics/pt";
import entityComponents from "./backoffice/entity-components/pt";
import investmentInterests from "./backoffice/investment-interests/pt";
import mergersAndAcquisitionOpportunites from "./backoffice/mergers-and-acquisition-opportunites/pt";
import mergersAndAcquisitionCreatePage from "./backoffice/mergers-and-acquisitions-create-page/pt";
import mergersAndAcquisitionOpportunityPage from "./backoffice/mergers-and-acquisitions-opportunity-page/pt";
import realEstateCreatePage from "./backoffice/real-estate-create-page/pt";
import realEstateOpportunities from "./backoffice/real-estate-opportunities/pt";
import realEstateOpportunityPage from "./backoffice/real-estate-opportunity-page/pt";
import sidebar from "./backoffice/sidebar/pt";
import users from "./backoffice/users/pt";
import mAndAViewer from "./dashboard/m&a-viewer/pt";
import navigation from "./dashboard/naviagation/pt";
import opportunities from "./dashboard/opportunities/pt";
import realEstateViewer from "./dashboard/real-estate-viewer/pt";
import settings from "./dashboard/settings/pt";
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
    mergersAndAcquisitionCreatePage,
    users,
    realEstateCreatePage,
    realEstateOpportunities,
    realEstateOpportunityPage,
    analytics,
    "investment-interests": investmentInterests,
  },
  dashboard: {
    navigation,
    opportunities,
    realEstateViewer,
    mAndAViewer,
    settings,
  },
} as const;
