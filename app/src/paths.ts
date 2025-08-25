// Default Path
export const homePath = () => "/";

// Authentication Paths
export const loginPath = () => "/login";
export const registerPath = () => "/register";
export const privacyPath = () => "/privacy";
export const termsPath = () => "/terms";

// Dashboard Paths
export const dashboardPath = () => "/dashboard";

// Admin Dashboard Paths
export const adminDashboardPath = () => "/admin";

// Admin Investments Part
export const adminInvestmentsPath = () => "/admin/investments";
export const adminInvestmentDetailsPath = (id: string) =>
  `/admin/investments/${id}`;
export const adminInvestmentCreatePath = () => "/admin/investments/create";
