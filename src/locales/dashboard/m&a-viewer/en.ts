export default {
  breadcrumb: "Mergers and Acquisition Opportunities",
  loadingMessage: "Loading opportunity...",
  errorMessage: "Error loading opportunity...",
  saveButtonText: "Save",
  cancelButtonText: "Cancel",
  description: "Description",
  editDescription: "Edit description",
  editButtonText: "Edit",
  financialInformationCard: {
    title: "Financial Information",
    table: {
      header: {
        metric: "Metric",
        value: "Value",
        actions: "Actions",
      },
      body: {
        type: {
          label: "Type",
          placeholder: "Select the type of the opportunity",
          values: {
            BUY_IN: "Buy In",
            BUY_OUT: "Buy Out",
            BUY_IN_BUY_OUT: "Buy In / Buy Out",
          },
          description: "Select the type of the opportunity",
        },
        typeDetails: {
          label: "Type Details",
          placeholder: "Select the type details of the opportunity",
          values: {
            MAIORITARIO: "Majority",
            MINORITARIO: "Minority",
            FULL_OWNERSHIP: "100%",
          },
          description: "Select the type details of the opportunity",
        },
        industry: {
          label: "Industry",
          placeholder: "Select the industry of the opportunity",
          values: {
            SERVICES: "Services",
            TRANSFORMATION_INDUSTRY: "Transformation Industry",
            TRADING: "Trading",
            ENERGY_INFRASTRUCTURE: "Energy Infrastructure",
            FITNESS: "Fitness",
            HEALTHCARE_PHARMACEUTICALS: "Healthcare and Pharmaceutical",
            IT: "Information Technology",
            TMT: "TMT (Technology, Media and Telecom)",
            TRANSPORTS: "Transport",
          },
          description: "Select the industry of the opportunity",
        },
        industrySubsector: {
          label: "Industry Subsector",
          placeholder: "Select the industry subsector of the opportunity",
          values: {
            BUSINESS_SERVICES: "Business Services",
            FINANCIAL_SERVICES: "Financial Services",
            CONSTRUCTION_MATERIALS: "Construction Materials",
            FOOD_BEVERAGES: "Food and Beverages",
            OTHERS: "Others",
          },
          description: "Select the industry subsector of the opportunity",
        },
        sales: {
          label: "Sales",
          placeholder: "Select the sales of the opportunity",
          values: {
            RANGE_0_5: "€0-5M ",
            RANGE_5_10: "€5-10M",
            RANGE_10_15: "€10-15M",
            RANGE_20_30: "€20-30M",
            RANGE_30_PLUS: "€30M+",
          },
          description: "Select the sales range of the opportunity",
        },
        ebitda: {
          label: "EBITDA",
          placeholder: "Select the ebitda of the opportunity",
          values: {
            RANGE_1_2: "€1-2M",
            RANGE_2_3: "€2-3M",
            RANGE_3_5: "€3-5M",
            RANGE_5_PLUS: "€5M+",
          },
          description: "Select the ebitda range of the opportunity",
        },
        ebitdaNormalized: {
          label: "EBITDA (Normalized)",
          placeholder: "Enter the EBITDA (Normalized) value in euros (example: 150000)",
          description: "Enter the absolute EBITDA (Normalized) value of the opportunity",
          units: "€",
        },
        dimension: {
          label: "Dimension",
        },
        netDebt: {
          label: "Net Debt",
          placeholder: "Enter the Net Debt value (example: 3.2)",
          description: "Enter the Net Debt value of the opportunity",
          prefix: "€",
          units: "M",
        },
        CAGRs: {
          label: "CAGRs",
        },
        salesCAGR: {
          label: "Sales CAGR",
          placeholder: "Enter the Sales CAGR value (example: 22)",
          description: "Enter the Sales CAGR value of the opportunity",
          units: "%",
        },
        ebitdaCAGR: {
          label: "EBITDA CAGR",
          placeholder: "Enter the EBITDA CAGR value (example: 22)",
          description: "Enter the EBITDA CAGR value of the opportunity",
          units: "%",
        },
        asset: {
          label: "Asset",
        },
        assetIncluded: {
          label: "Asset Included",
          yes: "Yes",
          no: "No",
          description: "Select if the asset is included in the opportunity",
          placeholder: "Select if the asset is included",
        },
        estimatedAssetValue: {
          label: "Estimated Asset Value",
          placeholder: "Enter the Estimated Asset Value value (example: 3.2)",
          description:
            "Enter the Estimated Asset Value value of the opportunity",
          prefix: "€",
          units: "M",
        },
      },
    },
  },
  graphCard: {
    title: "Graph Data",
    addRowButtonText: "Add Row",
    table: {
      header: {
        year: "Year",
        revenue: "Revenue (M€)",
        ebitda: "EBITDA (M€)",
        ebitdaMargin: "EBITDA Margin (%)",
        actions: "Actions",
      },
    },
    noDataMessage: "No graph data yet. Click 'Add Row' to get started.",
    openMenuText: "Open menu",
    editButtonText: "Edit",
    editGraphRowTitle: "Edit Graph Row",
    cancelButtonText: "Cancel",
    saveButtonText: "Save",
    year: "Year",
    revenue: "Revenue (M€)",
    ebitda: "EBITDA (M€)",
    ebitdaMargin: "EBITDA Margin (%)",
    actions: "Actions",
    deleteButtonText: "Delete",
  },
  imagesCard: {
    title: "Images",
    uploadSuccess: "Images uploaded successfully",
    noImages: "No images uploaded yet",
    maxImagesError: "Cannot exceed 10 images total",
  },
  postNDACard: {
    title: "Further Information",
    table: {
      header: {
        metric: "Metric",
        value: "Value",
        actions: "Actions",
      },
      body: {
        im: {
          label: "IM",
          description: "Enter the Information Memorandum link/URL",
          placeholder: "Enter the IM link (e.g., Google Drive URL)",
        },
        enterpriseValue: {
          label: "Enterprise Value (EV)",
          placeholder: "Enter the Enterprise Value (example: 50)",
          description: "Enter the Enterprise Value of the opportunity",
          prefix: "€",
          units: "M",
        },
        equityValue: {
          label: "Equity Value",
          placeholder: "Enter the Equity Value (example: 30)",
          description: "Enter the Equity Value of the opportunity",
          prefix: "€",
          units: "M",
        },
        evDashEbitdaEntry: {
          label: "EV/EBITDA (Entry)",
          placeholder: "Enter the EV/EBITDA (Entry) multiple (example: 8.5)",
          description:
            "Enter the EV/EBITDA (Entry) multiple of the opportunity",
          units: "x",
        },
        evDashEbitdaExit: {
          label: "EV/EBITDA (Exit/Comps)",
          placeholder:
            "Enter the EV/EBITDA (Exit/Comps) multiple (example: 12.5)",
          description:
            "Enter the EV/EBITDA (Exit/Comps) multiple of the opportunity",
          units: "x",
        },
        ebitdaMargin: {
          label: "EBITDA Margin (%)",
          placeholder: "Enter the EBITDA Margin (example: 25.5)",
          description: "Enter the EBITDA Margin of the opportunity",
          units: "%",
        },
        fcf: {
          label: "Free Cash Flow (FCF)",
          placeholder: "Enter the Free Cash Flow (example: 5.2)",
          description: "Enter the Free Cash Flow of the opportunity",
          prefix: "€",
          units: "M",
        },
        netDebtDashEbitda: {
          label: "Net Debt/EBITDA",
          placeholder: "Enter the Net Debt/EBITDA multiple (example: 3.5)",
          description: "Enter the Net Debt/EBITDA multiple of the opportunity",
          units: "x",
        },
        capexItensity: {
          label: "Capex Intensity (Capex/EBITDA)",
          placeholder: "Enter the Capex Intensity (example: 8.5)",
          description: "Enter the Capex Intensity of the opportunity",
          units: "%",
        },
        workingCapitalNeeds: {
          label: "Working Capital Needs (% Revenue)",
          placeholder: "Enter the Working Capital Needs (example: 2.5)",
          description: "Enter the Working Capital Needs of the opportunity",
          units: "%",
        },
      },
    },
  },
  shareholderStructureCard: {
    title: "Shareholder Structure",
    uploadSuccess: "Shareholder structure images uploaded successfully",
    noImages: "No shareholder structure images uploaded yet",
  },
  coInvestmentCard: {
    title: "Limited Partner Information",
    table: {
      header: {
        metric: "Metric",
        value: "Value",
        actions: "Actions",
      },
      body: {
        coInvestment: {
          label: "Co-Investment",
          yes: "Yes",
          no: "No",
          description: "Select if there is co-investment in this opportunity",
          placeholder: "Select co-investment status",
        },
        equityContribution: {
          label: "Equity Contribution",
          placeholder: "Enter the Equity Contribution (example: 25)",
          description: "Enter the Equity Contribution of the opportunity",
          units: "%",
        },
        grossIRR: {
          label: "Gross IRR",
          placeholder: "Enter the Gross IRR (example: 25)",
          description: "Enter the Gross IRR of the opportunity",
          units: "%",
        },
        netIRR: {
          label: "Net IRR",
          placeholder: "Enter the Net IRR (example: 20)",
          description: "Enter the Net IRR of the opportunity",
          units: "%",
        },
        moic: {
          label: "MOIC (Multiple on Invested Capital)",
          placeholder: "Enter the MOIC (example: 2.5)",
          description: "Enter the MOIC of the opportunity",
          units: "x",
        },
        cashOnCashReturn: {
          label: "Cash-on-Cash Return",
          placeholder: "Enter the Cash-on-Cash Return (example: 18)",
          description: "Enter the Cash-on-Cash Return of the opportunity",
          units: "%",
        },
        cashConvertion: {
          label: "Cash Conversion (FCF/EBITDA)",
          placeholder: "Enter the Cash Conversion (example: 85)",
          description: "Enter the Cash Conversion of the opportunity",
          units: "%",
        },
        entryMultiple: {
          label: "Entry Multiple",
          placeholder: "Enter the Entry Multiple (example: 8.5)",
          description: "Enter the Entry Multiple of the opportunity",
          units: "x",
        },
        exitExpectedMultiple: {
          label: "Exit Expected Multiple",
          placeholder: "Enter the Exit Expected Multiple (example: 12.5)",
          description: "Enter the Exit Expected Multiple of the opportunity",
          units: "x",
        },
        holdPeriod: {
          label: "Hold Period (Years)",
          placeholder: "Enter the Hold Period (example: 5)",
          description: "Enter the Hold Period of the opportunity",
          units: "years",
        },
      },
    },
  },
  buttons: {
    markInterested: "Mark as Interested",
    markInterestedDone: "Interested",
    notInterested: "Not Interested",
    notInterestedDone: "Not Interested",
    signNDA: "Sign NDA",
    signNDADone: "NDA Signed",
    submit: "Submit",
    cancel: "Cancel",
  },
  notInterestedDialog: {
    title: "Why are you not interested?",
    description:
      "Please tell us why you're not interested in this opportunity. This helps us improve our offerings.",
    placeholder: "Enter your reason...",
  },
  teamAssignmentCard: {
    title: "Team Assignment",
    clientAcquisitioner: {
      label: "Investor Acquisition",
    },
    accountManagers: {
      label: "Client Follow-up",
    },
  },
} as const;
