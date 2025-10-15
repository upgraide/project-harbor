export const indexPath = () => "/";
export const requestAccessPath = () => "/request-access";
export const loginPath = () => "/login";

// Protected paths
export const dashboardPath = () => "/dashboard";
export const backofficePath = () => "/backoffice";

export const backofficeMergeAndAcquisitionPath = () => "/backoffice/m&a";
export const backofficeRealEstatePath = () => "/backoffice/real-estate";

export const backofficeMergeAndAcquisitionOpportunityPath = (id: string) =>
  `/backoffice/m&a/${id}`;
export const backofficeMergeAndAcquisitionOpportunityCreatePath = () =>
  "/backoffice/m&a/create";

export const backofficeRealEstateOpportunityPath = (id: string) =>
  `/backoffice/real-estate/${id}`;
