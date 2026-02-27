export default {
  title: "Commissions",
  description: "Manage commission rates and view commission-eligible projects",

  viewSelector: {
    myCommissions: "My Commissions",
    adminOverview: "Admin Overview",
  },

  paymentStats: {
    totalReceived: "Total Received",
    totalReceivedDescription: "Total commissions paid to date",
    totalYetToReceive: "Yet to Receive",
    totalYetToReceiveDescription: "Total pending commission payments",
  },

  summary: {
    title: "Commission Summary",
    byRole: "By Role",
    totalProjects: "Total Projects",
    pendingCommissions: "Pending",
    completedCommissions: "Completed",
  },

  roles: {
    ACCOUNT_MANAGER: "Client Follow-up",
    CLIENT_ACQUISITION: "Client Acquisition",
    CLIENT_ORIGINATOR: "Investor Acquisition",
    DEAL_SUPPORT: "Investor Follow-up",
  },

  projects: {
    title: "Commission-Eligible Projects",
    tabs: {
      pendingPayments: "Pending Payments",
      pending: "Pending Projects",
      concluded: "Concluded Projects",
    },
    emptyState: "No commission-eligible projects",
    emptyStateDescription:
      "Projects where you have commission roles will appear here",
    noConcludedProjects: "No concluded projects with commissions",
    noConcludedProjectsDescription:
      "Concluded projects with configured commissions will appear here",
    noPendingPayments: "No pending payments",
    noPendingPaymentsDescription:
      "All your commission payments have been received",

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
      notSetUp: "Not Set Up",
      pendingPayment: "Pending Payment",
    },

    details: {
      title: "Commission Details",
      projectNotFinished: "Project not finished — commission pending",
      finalAmount: "Final Amount",
      commissionableAmount: "Commissionable Amount",
      commissionPercentage: "Commission Percentage",
      estimatedCommission: "Estimated Commission",
      closedAt: "Closed At",
      myCommission: "My Commission",
      totalPaid: "Total Paid",
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
        totalReceived: "Total Received",
        totalYetToReceive: "Yet to Receive",
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
      calculationPending:
        "Commission calculation pending until project completion",
    },

    paymentSchedule: {
      title: "Payment Schedule",
      installment: "Installment",
      paymentDate: "Payment Date",
      paymentAmount: "Payment Amount",
      status: "Status",
      totalPaid: "Total Paid",
      totalRemaining: "Total Remaining",
      totalScheduled: "Total Scheduled",
      markAsPaid: "Mark as Paid",
      markAsUnpaid: "Mark as Unpaid",
      actualPaidDate: "Actual Paid Date",
      editPaidDate: "Edit Paid Date",

      installmentNumber: {
        first: "1º Installment",
        second: "2º Installment",
        third: "3º Installment",
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
        markingPaid: "Marking as paid...",
        markingUnpaid: "Marking as unpaid...",
      },

      summary: {
        title: "Payment Summary",
        totalCommission: "Total Commission",
        totalPaidAmount: "Total Paid",
        totalRemainingAmount: "Total Remaining",
        percentagePaid: "Percentage Paid",
      },

      toasts: {
        paymentMarkedPaid: "Payment marked as paid",
        paymentMarkedUnpaid: "Payment marked as unpaid",
        updateFailed: "Failed to update payment status",
      },

      validation: {
        invalidAmount: "Amount must be greater than 0",
        dateRequired: "Date is required when amount is set",
        amountRequired: "Amount is required when date is set",
        saveFailed: "Failed to save payment schedule",
        saveSuccess: "Payment schedule updated successfully",
      },

      emptyState: "Payment schedule not configured",
      emptyStateDescription:
        "Admins can set up the payment schedule after project completion",
    },
  },

  resolution: {
    title: "Resolve Commissions",
    backButton: "Back",
    retry: "Retry",
    alreadyResolved: "Already Resolved",
    loadingDetails: "Loading commission details...",

    opportunityDetails: {
      title: "Opportunity Details",
      status: "Status",
      finalAmount: "Final Amount",
      commissionableAmount: "Commissionable Amount",
    },

    recipients: {
      title: "Commission Recipients",
      description: "Calculated commissions based on current rates",
      emptyState:
        "No commission recipients found. Make sure users have commission rates configured.",
      totalCommission: "Total Commission",
      rate: "Rate",
      amount: "Amount",
      grandTotal: "Grand Total",
      halvedTooltip:
        "Percentage halved due to 2 Client Follow-up roles on this opportunity",
    },

    paymentSchedule: {
      title: "Payment Schedule",
      description:
        "Define payment dates and percentages. The same schedule will apply to all {count} recipient{plural}.",
      editDescription: "Edit the payment schedule for this opportunity",
      addPayment: "Add Payment",
      installment: "Payment {number}",
      percentage: "Percentage",
      paymentDate: "Payment Date",
      total: "Total",
      mustEqual100: "(must equal 100%)",
      cancel: "Cancel",
      save: "Resolve Commissions",
      update: "Update Commission Schedule",
      saving: "Saving...",
      updating: "Updating...",
    },

    toasts: {
      resolveSuccess: "Commissions resolved successfully!",
      resolveFailed: "Failed to resolve commissions",
    },
  },

  pendingResolution: {
    title: "Opportunities Pending Commission Resolution",
    description:
      "Concluded opportunities that need commission schedules set up",
    emptyState: "All concluded opportunities have their commissions resolved",
    table: {
      name: "Name",
      type: "Type",
      finalAmount: "Final Amount",
      commissionable: "Commissionable",
      actions: "Actions",
      setupButton: "Set Up Commissions",
    },
  },

  resolvedList: {
    title: "Resolved Commissions",
    titlePendingPayments: "Commissions with Pending Payments",
    titleFullyPaid: "Fully Paid Commissions",
    description: "All opportunities with resolved commission schedules",
    descriptionPendingPayments:
      "Opportunities with outstanding commission payments",
    descriptionFullyPaid:
      "Opportunities where all commission payments have been completed",
    emptyTitle: "No resolved commissions yet",
    emptyMessage:
      "Resolve commissions for concluded opportunities to see them here",
    emptyPendingPayments: "No pending payments",
    emptyPendingPaymentsMessage: "All commissions have been fully paid",
    emptyFullyPaid: "No fully paid commissions yet",
    emptyFullyPaidMessage:
      "Commissions will appear here once all payments are completed",
    table: {
      name: "Name",
      type: "Type",
      recipients: "Recipients",
      finalAmount: "Final Amount",
      commissionable: "Commissionable",
      totalPaid: "Total Paid",
      resolvedDate: "Resolved",
      actions: "Actions",
      viewButton: "View",
    },
  },

  tabs: {
    pendingResolution: "Pending Resolution",
    resolvedCommissions: "Resolved Commissions",
    teamMembers: "Team Members",
    commissionRates: "Commission Rates",
  },

  loading: {
    commissionData: "Loading commission data...",
    employeeCommissions: "Loading employee commissions...",
  },

  errorPage: {
    title: "Commission Not Set Up",
    description:
      "This opportunity's commission schedule has not been configured yet.",
    message:
      "Only administrators can set up commission schedules. Once configured, the commission details will be visible here.",
    backButton: "Back to Commissions",
  },

  opportunityTypes: {
    MNA: "M&A",
    REAL_ESTATE: "Real Estate",
  },
} as const;
