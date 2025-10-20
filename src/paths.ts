export const indexPath = () => "/";
export const requestAccessPath = () => "/request-access";
export const loginPath = () => "/login";

// Protected paths

// Dashboard paths
export const dashboardPath = () => "/dashboard";
export const dashboardSettingsPath = () => "/dashboard/settings";

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
