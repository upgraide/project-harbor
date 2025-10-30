export const indexPath = () => "/";
export const requestAccessPath = () => "/request-access";
export const loginPath = () => "/login";

// Protected paths

// Dashboard paths
export const dashboardPath = () => "/dashboard";
export const dashboardSettingsPath = () => "/settings";
export const dashboardMergerAndAcquisitionOpportunityPath = (id: string) =>
  `/dashboard/m&a/${id}`;
export const dashboardRealEstateOpportunityPath = (id: string) =>
  `/dashboard/real-estate/${id}`;

// Backoffice paths
export const backofficePath = () => "/backoffice";

export const backofficeMergeAndAcquisitionPath = () => "/backoffice/m&a";
export const backofficeRealEstatePath = () => "/backoffice/real-estate";
export const backofficeUsersPath = () => "/backoffice/users";

export const backofficeMergeAndAcquisitionOpportunityPath = (id: string) =>
  `/backoffice/m&a/${id}`;
export const backofficeMergeAndAcquisitionOpportunityCreatePath = () =>
  "/backoffice/m&a/create";

export const backofficeRealEstateOpportunityPath = (id: string) =>
  `/backoffice/real-estate/${id}`;
export const backofficeRealEstateOpportunityCreatePath = () =>
  "/backoffice/real-estate/create";

export const backofficeAnalyticsPath = () => "/backoffice/analytics";
export const backofficeInvestmentInterestsPath = () =>
  "/backoffice/investment-interests";
export const backofficeInvestorsPath = () => "/backoffice/investors";
export const backofficeNotificationsPath = () => "/backoffice/notifications";
