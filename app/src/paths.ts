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

// Admin Investments Parths
export const adminProjectsPath = () => "/admin/projects";
export const adminProjectDetailsPath = (id: string) => `/admin/projects/${id}`;
export const adminProjectCreatePath = () => "/admin/projects/create";
