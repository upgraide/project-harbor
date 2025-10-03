export const homePath = () => "/";

// (Auth) - (Unprotected)
export const signInPath = () => "/sign-in";
export const requestAccessPath = () => "/request-access";
export const forgotPasswordPath = () => "/reset-password";

// (Dashboard) - User Facing (Protected) -
export const dashboardPath = () => "/dashboard";
export const dashboardSettingsPath = () => "/dashboard/settings";
export const dashboardMergersAndAcquisitionOpportunityPath = (id: string) =>
  `/dashboard/mergers-and-acquisitions/${id}`;
export const dashboardRealEstateOpportunityPath = (id: string) =>
  `/dashboard/real-estate/${id}`;

// (Backoffice) - Team Facing (Protected)
export const backofficePath = () => "/backoffice";

// Mergers and Acquisitions
export const backofficeMergersAndAcquisitionsPath = () =>
  "/backoffice/mergers-and-acquisitions";
export const backofficeMergersAndAcquisitionsCreatePath = () =>
  "/backoffice/mergers-and-acquisitions/create";
export const backofficeMergersAndAcquisitionsOpportunityPath = (id: string) =>
  `/backoffice/mergers-and-acquisitions/${id}`;

// Real Estate
export const backofficeRealEstatePath = () => "/backoffice/real-estate";
export const backofficeRealEstateCreatePath = () =>
  "/backoffice/real-estate/create";
export const backofficeRealEstateOpportunityPath = (id: string) =>
  `/backoffice/real-estate/${id}`;
