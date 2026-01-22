export default {
  title: "Create Opportunity",
  createButtonText: "Create Opportunity",
  creatingButtonText: "Creating...",
  cancelButtonText: "Cancel",
  basicInformationCard: {
    title: "Basic Information",
    name: {
      label: "Opportunity Name",
      placeholder: "Enter the opportunity name",
      description: "Give your opportunity a unique and descriptive name",
    },
    description: {
      label: "Description",
      placeholder: "Enter a detailed description of the opportunity",
      description: "Provide a comprehensive description of the opportunity",
    },
  },
  financialInformationCard: {
    title: "Financial Information (Pre-NDA)",
    preNDANotes: {
      label: "Pre-NDA Notes",
      placeholder: "Enter any notes about this opportunity before NDA",
      description: "Add any additional notes or observations",
    },
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
        netDebt: {
          label: "Net Debt",
          placeholder: "Enter the Net Debt value (example: 3.2)",
          description: "Enter the Net Debt value of the opportunity",
          prefix: "€",
          units: "M",
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
  postNDACard: {
    title: "Further Information (Post-NDA)",
    postNDANotes: {
      label: "Post-NDA Notes",
      placeholder: "Enter any notes about this opportunity after NDA",
      description: "Add any additional notes or observations after NDA",
    },
    table: {
      header: {
        metric: "Metric",
        value: "Value",
        actions: "Actions",
      },
      body: {
        im: {
          label: "IM",
          placeholder: "Enter the IM link (e.g., Google Drive URL)",
          description: "Enter the Information Memorandum link/URL",
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
  imagesCard: {
    title: "Images",
    uploadButtonText: "Upload Images",
    uploadSuccess: "Images uploaded successfully",
    maxImagesError: "Cannot exceed 10 images total",
    noImages: "No images uploaded yet",
  },
  graphCard: {
    title: "Graph Data",
    addRowButtonText: "Add Row",
    unitLabel: "Display Unit",
    millions: "Millions (M€)",
    thousands: "Thousands (K€)",
    table: {
      header: {
        year: "Year",
        revenue: "Revenue",
        ebitda: "EBITDA",
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
  teamAssignmentCard: {
    title: "Team Assignment",
    clientAcquisitioner: {
      label: "Investor Acquisition",
      placeholder: "Select investor acquisition",
      description:
        "Select the investor acquisition for this opportunity (must be a Team or Admin user)",
    },
    accountManagers: {
      label: "Client Follow-up",
      placeholder: "Select client follow-up",
      description:
        "Select 1 to 2 client follow-up for this opportunity (must be Team or Admin users)",
    },
  },
} as const;
