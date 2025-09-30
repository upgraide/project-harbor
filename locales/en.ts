export default {
  ladingPage: {
    title: {
      firstRow: "YOUR TRUSTED",
      secondRow: "PARTNER FOR",
      thirdRow: "STRATEGIC GROWTH",
    },
    description:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients.",
    buttons: {
      requestAccess: "Request access",
      membershipLogin: "Membership login",
    },
  },
  signInPage: {
    title: "Sign in to your account",
    description:
      "Insert your email and password below to sign in to your account",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    buttons: {
      signIn: "Sign in",
      requestAccess: "Request access",
      back: "Back",
      membershipLogin: "Membership login",
    },
    forgotPassword: "Forgot your password?",
    emailPlaceholder: "m@example.com",
    passwordPlaceholder: "Password",
    toastSuccess: "Signed in successfully! Redirecting to dashboard...",
    toastError: "Failed to sign in. Please try again.",
    toastInvalidCredentials: "Invalid email or password",
    toastResetPasswordSuccess: "Check your email for the reset password link!",
    toastResetPasswordError:
      "Failed to send reset password link. Please try again.",
  },
  themeSwitcher: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  resetPasswordPage: {
    invalidLinkCard: {
      title: "Invalid Link",
      description:
        "This password reset link is invalid or has expired. Please request a new one.",
    },
    resetPasswordCard: {
      title: "Reset Your Password",
      description: "Insert your new password below to reset your password",
    },
    schemaMessages: {
      password: {
        min: "Password must be at least 8 characters",
        label: "New Password",
        placeholder: "********",
        description: "Enter your new password",
      },
      confirmPassword: {
        min: "Confirm password must be at least 8 characters",
        match: "Passwords do not match",
        label: "Confirm Password",
        placeholder: "********",
        description: "Confirm your new password",
      },
      error: {
        default: "Failed to reset password. Please try again.",
      },
    },
    buttons: {
      submit: "Reset Your Password",
    },
  },
  dashboard: {
    header: {
      title: "Dashboard",
      description: "Welcome to your dashboard",
    },
    navigation: {
      dashboard: "Dashboard",
      settings: "Settings",
      theme: "Theme",
      language: "Language",
      logout: "Logout",
      toastLogoutSuccess: "Logged out successfully!",
      toastLogoutError: "Failed to log out. Please try again.",
    },
    settings: {
      general: "General",
      updateAvatarCard: {
        title: "Your Avatar",
        description:
          "This is your avatar. It will be displayed on your profile.",
        uploadHint:
          "Click on the avatar to upload a custom one from your files.",
        resetButton: "Reset",
        uploadToast: {
          success: "Avatar updated successfully!",
          error: "Failed to update avatar. Please try again.",
          loading: "Updating avatar...",
        },
        removeToast: {
          success: "Avatar removed successfully!",
          error: "Failed to remove avatar. Please try again.",
          loading: "Removing avatar...",
        },
      },
      updateNameCard: {
        title: "Your Name",
        description: "This is your name. It will be displayed on your profile.",
        label: "First & Last Name",
        placeholder: "First and Last name",
        warning: "Please use 32 characters at maximum.",
        saveButton: "Save",
        toast: {
          success: "Name updated successfully!",
          error: "Failed to update name. Please try again.",
          loading: "Updating name...",
        },
      },
    },
  },
  backoffice: {
    sidebar: {
      navigationItems: {
        opportunitiesMA: "Opportunities M&A",
        opportunitiesRealEstate: "Opportunities Real Estate",
        investors: "Investors",
        team: "Team",
      },
      searchPlaceholder: "Type to search...",
    },
    mergersAndAcquisitions: {
      create: {
        breadcrumb: {
          title: "Mergers and Acquisitions",
          create: "Create",
        },
      },
    },
  },
  requestAccessPage: {
    title: "Request Access",
    description: "Insert your details below to request access to the platform",
    message: {
      label: "Message",
      placeholder: "Why are you interested?",
    },
    name: {
      label: "Name",
      placeholder: "Insert your name",
    },
    email: {
      label: "Email",
      placeholder: "example@example.com",
    },
    company: {
      label: "Company",
      placeholder: "Insert your company's name",
    },
    position: {
      label: "Position",
      placeholder: "Insert your position at this company",
    },
    phone: {
      label: "Phone",
      placeholder: "Insert your phone number",
    },
    buttons: {
      submit: "Request access",
    },
    schemaMessages: {
      name: {
        required: "Name is required",
      },
      email: {
        invalid: "Invalid email",
      },
      company: {
        required: "Company is required",
      },
      phone: {
        required: "Phone is required",
        min: "Phone must be at least 9 digits",
        max: "Phone must be exactly 9 digits",
      },
      position: {
        required: "Position is required",
      },
      message: {
        required: "Message is required",
        min: "Message must be at least 3 characters",
        max: "Message must be less than 1000 characters",
      },
    },
  },
  backofficeMergersAndAcquisitionsOpportunityPage: {
    breadcrumbs: {
      mergersAndAcquisitionsOpportunities:
        "Mergers and Acquisitions Opportunities",
    },
    imagesCard: {
      title: "Images",
      buttons: {
        add: "Add Image",
      },
    },
    descriptionCard: {
      title: "Description",
      buttons: {
        edit: "Edit Description",
      },
    },
    financialPerformanceCard: {
      title: "Financial Performance",
      graphRowsCard: {
        title: "Graph Rows",
        buttons: {
          add: "Add Graph Row",
        },
        table: {
          year: "Year",
          revenue: "Revenue",
          ebitda: "EBITDA",
          buttons: {
            edit: "Edit",
            delete: "Delete",
          },
        },
      },
    },
    preNDAInformationCard: {
      title: "Pre-NDA Information",
      table: {
        buttons: {
          edit: "Edit",
          delete: "Delete",
        },
        metric: "Metric",
        value: "Value",
        actions: "Actions",
        type: "Type",
        typeDetails: "Type Details",
        industry: "Industry",
        industrySubsector: "Industry Subsector",
        dimension: "Dimension",
        sales: "Sales",
        ebitda: "EBITDA",
        ebitdaNormalized: "EBITDA (Normalized)",
        netDebt: "Net Debt",
        cagr: "CAGR",
        salesCAGR: "Sales CAGR",
        ebitdaCAGR: "EBITDA CAGR",
        asset: "Asset",
        assetIncluded: "Asset Included",
        estimatedAssetValue: "Estimated Asset Value",
        assetIncludedYes: "Yes",
        assetIncludedNo: "No",
      },
    },
    shareholderInformationCard: {
      title: "Shareholder Structure",
      buttons: {
        add: "Add Shareholder Structure",
      },
    },
    postNDAInformationCard: {
      title: "Post-NDA Information",
      table: {
        metric: "Metric",
        value: "Value",
        actions: "Actions",
        im: "IM",
        entrepriseValue: "Entreprise Value",
        equityValue: "Equity Value",
        evDashEbitdaEntry: "EV/EBITDA Entry",
        evDashEbitdaExit: "EV/EBITDA Exit",
        ebitdaMargin: "EBITDA Margin",
        fcf: "FCF",
        netDebtDashEbitda: "Net Debt/EBITDA",
        capexIntensity: "Capex Intensity (Capex/EBITDA)",
        workingCapitalNeeds: "Working Capital Needs",
      },
    },
    limitedPartnerInformationCard: {
      title: "Limited Partner Information",
      table: {
        metric: "Metric",
        value: "Value",
        actions: "Actions",
        coInvestment: "Co-Investment",
        equityContribution: "Equity Contribution",
        grossIRR: "Gross IRR",
        netIRR: "Net IRR",
        moic: "MOIC",
        cashOnCashReturn: "Cash On Cash Return",
        cashConvertion: "Cash Convertion",
        entryMultiple: "Entry Multiple",
        exitExpectedMultiple: "Exit Expected Multiple",
        holdPeriod: "Hold Period",
      },
    },
    editOpportunityTypeDialog: {
      title: "Edit Opportunity Type",
      description: "Edit the opportunity type",
      toastSuccess: "Opportunity type updated successfully",
      toastError: "Failed to update opportunity type",
      toastLoading: "Updating opportunity type",
      selectPlaceholder: "Select a type",
      label: "Type",
      buyIn: "Buy In",
      buyOut: "Buy Out",
      buyInBuyOut: "Buy In/Buy Out",
      updateButton: "Update Type",
    },
    deleteOpportunityTypeDialog: {
      title: "Delete Opportunity Type",
      description:
        "Are you sure you want to delete the opportunity type? This action cannot be undone.",
      toastSuccess: "Opportunity type deleted successfully",
      toastError: "Failed to delete opportunity type",
      toastLoading: "Deleting opportunity type",
      deleteButton: "Delete",
      cancelButton: "Cancel",
    },
    editOpportunityTypeDetailsDialog: {
      title: "Edit Opportunity Type Details",
      description: "Edit the opportunity type details",
      toastSuccess: "Opportunity type details updated successfully",
      toastError: "Failed to update opportunity type details",
      toastLoading: "Updating opportunity type details",
      selectPlaceholder: "Select a type details",
      label: "Type Details",
      majoritarian: "Majoritarian",
      minority: "Minority",
      hundredPercent: "100%",
      updateButton: "Update Type Details",
    },
    deleteOpportunityTypeDetailsDialog: {
      title: "Delete Opportunity Type Details",
      description:
        "Are you sure you want to delete the opportunity type details? This action cannot be undone.",
      toastSuccess: "Opportunity type details deleted successfully",
      toastError: "Failed to delete opportunity type details",
      toastLoading: "Deleting opportunity type details",
      deleteButton: "Delete",
      cancelButton: "Cancel",
    },
    editOpportunityIndustryDialog: {
      title: "Edit Opportunity Industry",
      description: "Edit the opportunity industry",
      toastSuccess: "Opportunity industry updated successfully",
      toastError: "Failed to update opportunity industry",
      toastLoading: "Updating opportunity industry",
      label: "Industry",
      selectPlaceholder: "Select an option",
      industrySubsectorLabel: "Industry Subsector",
      updateButton: "Update Industry",
      content: {
        industry: {
          services: "Services",
          transformationindustry: "Transformation Industry",
          trading: "Trading",
          energyandinfrastructure: "Energy & Infrastructure",
          fitness: "Fitness",
          healthcareandpharmaceuticals: "Healthcare & Pharmaceuticals",
          it: "IT",
          tmt: "TMT (Technology, Media & Telecom)",
          transports: "Transports",
        },
        industrySubsector: {
          businessservices: "Business Services",
          financialservices: "Financial Services",
          constructionandmaterials: "Construction & Materials",
          foodandbeverages: "Food & Beverages",
          others: "Others",
        },
      },
    },
  },
  dashboardCard: {
    viewOpportunity: "View Opportunity",
    createdAt: "Created",
    ago: "ago",
  },
  dashboardMergersAndAcquisitionsOpportunityPage: {
    description: "Description",
    financialPerformanceCard: {
      title: "Financial Performance",
    },
    financialInformationCard: {
      title: "Financial Information",
      table: {
        metric: "Metric",
        value: "Value",
        type: "Type",
        typeDetails: "Type Details",
        industry: "Industry",
        industrySubsector: "Industry Subsector",
        dimension: "Dimension",
        sales: "Sales",
        ebitda: "EBITDA",
        ebitdaNormalized: "EBITDA (Normalized)",
        netDebt: "Net Debt",
        cagr: "CAGR",
        salesCAGR: "Sales CAGR",
        ebitdaCAGR: "EBITDA CAGR",
        asset: "Asset",
        assetIncluded: "Asset Included",
        estimatedAssetValue: "Estimated Asset Value",
        yes: "Yes",
        no: "No",
      },
    },
  },
} as const;
