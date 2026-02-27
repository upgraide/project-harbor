import changePasswordDialog from "./auth/change-password-dialog/pt";
import forgotPasswordForm from "./auth/forgot-password-form/pt";
import loginForm from "./auth/login-form/pt";
import requestAccessForm from "./auth/request-access-form/pt";
import accessRequests from "./backoffice/access-requests/pt";
import analytics from "./backoffice/analytics/pt";
import closeOpportunities from "./backoffice/close-opportunities/pt";
import entityComponents from "./backoffice/entity-components/pt";
import investmentInterests from "./backoffice/investment-interests/pt";
import investors from "./backoffice/investors/pt";
import backofficeMain from "./backoffice/main/pt";
import mergersAndAcquisitionOpportunites from "./backoffice/mergers-and-acquisition-opportunites/pt";
import mergersAndAcquisitionCreatePage from "./backoffice/mergers-and-acquisitions-create-page/pt";
import mergersAndAcquisitionOpportunityPage from "./backoffice/mergers-and-acquisitions-opportunity-page/pt";
import notifications from "./backoffice/notifications/pt";
import realEstateCreatePage from "./backoffice/real-estate-create-page/pt";
import realEstateOpportunities from "./backoffice/real-estate-opportunities/pt";
import realEstateOpportunityPage from "./backoffice/real-estate-opportunity-page/pt";
import sidebar from "./backoffice/sidebar/pt";
import users from "./backoffice/users/pt";
import crmCommissions from "./crm/commissions/pt";
import crmLeadDetails from "./crm/lead-details/pt";
import crmLeads from "./crm/leads/pt";
import crmMain from "./crm/main/pt";
import crmSidebar from "./crm/sidebar/pt";
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
