import changePasswordDialog from "./auth/change-password-dialog/en";
import forgotPasswordForm from "./auth/forgot-password-form/en";
import loginForm from "./auth/login-form/en";
import requestAccessForm from "./auth/request-access-form/en";
import accessRequests from "./backoffice/access-requests/en";
import analytics from "./backoffice/analytics/en";
import closeOpportunities from "./backoffice/close-opportunities/en";
import entityComponents from "./backoffice/entity-components/en";
import investmentInterests from "./backoffice/investment-interests/en";
import investors from "./backoffice/investors/en";
import backofficeMain from "./backoffice/main/en";
import mergersAndAcquisitionOpportunites from "./backoffice/mergers-and-acquisition-opportunites/en";
import mergersAndAcquisitionCreatePage from "./backoffice/mergers-and-acquisitions-create-page/en";
import mergersAndAcquisitionOpportunityPage from "./backoffice/mergers-and-acquisitions-opportunity-page/en";
import notifications from "./backoffice/notifications/en";
import realEstateCreatePage from "./backoffice/real-estate-create-page/en";
import realEstateOpportunities from "./backoffice/real-estate-opportunities/en";
import realEstateOpportunityPage from "./backoffice/real-estate-opportunity-page/en";
import sidebar from "./backoffice/sidebar/en";
import users from "./backoffice/users/en";
import crmCommissions from "./crm/commissions/en";
import crmLeadDetails from "./crm/lead-details/en";
import crmLeads from "./crm/leads/en";
import crmMain from "./crm/main/en";
import crmSidebar from "./crm/sidebar/en";
import mAndAViewer from "./dashboard/m&a-viewer/en";
import navigation from "./dashboard/naviagation/en";
import opportunities from "./dashboard/opportunities/en";
import realEstateViewer from "./dashboard/real-estate-viewer/en";
import settings from "./dashboard/settings/en";
import languageSwitcher from "./language-switcher/en";
import index from "./pages/index/en";
import themeSwitcher from "./theme-switcher/en";

export default {
  index,
  languageSwitcher,
  themeSwitcher,
  auth: {
    loginForm,
    forgotPasswordForm,
    requestAccessForm,
    changePasswordDialog,
  },
  backoffice: {
    sidebar,
    main: backofficeMain,
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
    investors,
    notifications,
    closeOpportunities,
    accessRequests,
  },
  dashboard: {
    navigation,
    opportunities,
    realEstateViewer,
    mAndAViewer,
    settings,
  },
  crm: {
    sidebar: crmSidebar,
    leads: crmLeads,
    leadDetails: crmLeadDetails,
    main: crmMain,
    commissions: crmCommissions,
  },
} as const;
