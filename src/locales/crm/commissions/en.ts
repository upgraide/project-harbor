export default {
  title: "Commissions",
  description: "Manage commission rates and view commission-eligible projects",
  
  viewSelector: {
    myCommissions: "My Commissions",
    adminOverview: "Admin Overview",
  },

  summary: {
    title: "Commission Summary",
    byRole: "By Role",
    totalProjects: "Total Projects",
    pendingCommissions: "Pending",
    completedCommissions: "Completed",
  },

  roles: {
    ACCOUNT_MANAGER: "Account Manager",
    CLIENT_ACQUISITION: "Client Acquisition",
    DEAL_SUPPORT: "Deal Support",
  },

  projects: {
    title: "Commission-Eligible Projects",
    emptyState: "No commission-eligible projects",
    emptyStateDescription: "Projects where you have commission roles will appear here",
    
    card: {
      role: "Role",
      project: "Project",
      finalValue: "Final Value",
      commissionStatus: "Commission Status",
      viewDetails: "View Details",
    },

    status: {
      pending: "Pending",
      concluded: "Concluded",
      notFinished: "Project not finished",
    },

    details: {
      title: "Commission Details",
      projectNotFinished: "Project not finished — commission pending",
      finalAmount: "Final Amount",
      commissionableAmount: "Commissionable Amount",
      commissionPercentage: "Commission Percentage",
      estimatedCommission: "Estimated Commission",
      closedAt: "Closed At",
    },
  },

  admin: {
    overview: {
      title: "Employee Commission Overview",
      emptyState: "No team members found",
      table: {
        employee: "Employee",
        totalProjects: "Total Projects",
        commissionRoles: "Commission Roles",
        actions: "Actions",
        viewDetails: "View Details",
      },
    },

    management: {
      title: "Commission Management",
      subtitle: "Set commission percentages for team members by role",
      table: {
        employee: "Employee",
        role: "Role",
        commissionPercentage: "Commission %",
        actions: "Actions",
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
        edit: "Edit",
      },
      validation: {
        invalidPercentage: "Percentage must be between 0 and 100",
        saveFailed: "Failed to save commission percentage",
        saveSuccess: "Commission percentage updated successfully",
      },
      emptyState: "No team members available",
      emptyStateDescription: "Add team members to set up commissions",
    },

    employeeDetails: {
      title: "Employee Commission Details",
      backToOverview: "Back to Overview",
      commissionRates: "Commission Rates",
      projectsByRole: "Projects by Role",
      noCommissions: "No commission rates set",
      noProjects: "No projects assigned",
    },
  },

  detail: {
    title: "Commission Detail",
    backToCommissions: "Back to Commissions",
    
    breakdown: {
      title: "Commission Breakdown",
      project: "Project",
      role: "Role",
      rolesAndCommissions: "Roles & Commission Rates",
      commissionPercentage: "Commission Rate",
      commissionee: "Commissionee",
      projectStatus: "Project Status",
    },

    totalValue: {
      title: "Total Commission Value",
      finalAmount: "Final Project Amount",
      commissionableAmount: "Commissionable Amount",
      commissionPercentage: "Commission Percentage",
      totalCommission: "Total Commission",
      notCalculated: "Not calculated",
      calculationPending: "Commission calculation pending until project completion",
    },

    paymentSchedule: {
      title: "Payment Schedule",
      installment: "Installment",
      paymentDate: "Payment Date",
      paymentAmount: "Payment Amount",
      status: "Status",
      totalPaid: "Total Paid",
      totalRemaining: "Total Remaining",
      
      installmentNumber: {
        first: "First Installment",
        second: "Second Installment",
        third: "Third Installment",
      },

      statusValues: {
        pending: "Pending",
        scheduled: "Scheduled",
        paid: "Paid",
        notSet: "Not Set",
      },

      actions: {
        editSchedule: "Edit Schedule",
        saveSchedule: "Save Schedule",
        cancel: "Cancel",
        saving: "Saving...",
      },

      validation: {
        invalidAmount: "Amount must be greater than 0",
        dateRequired: "Date is required when amount is set",
        amountRequired: "Amount is required when date is set",
        saveFailed: "Failed to save payment schedule",
        saveSuccess: "Payment schedule updated successfully",
      },

      emptyState: "Payment schedule not configured",
      emptyStateDescription: "Admins can set up the payment schedule after project completion",
    },
  },
} as const;
