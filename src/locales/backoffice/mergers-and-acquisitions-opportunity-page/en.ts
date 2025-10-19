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
    title: "Financial Information (Pre-NDA)",
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
          placeholder: "Enter the EBITDA (Normalized) value (example: 1.5)",
          description: "Enter the EBITDA (Normalized) value of the opportunity",
          units: "x",
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
    title: "Further Information (Post-NDA)",
    table: {
      header: {
        metric: "Metric",
        value: "Value",
        actions: "Actions",
      },
      body: {
        im: {
          label: "IM",
          description: "Enter the IM of the opportunity",
          placeholder: "Enter the IM value ",
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
      },
    },
  },
  shareholderStructureCard: {
    title: "Shareholder Structure",
    uploadSuccess: "Shareholder structure images uploaded successfully",
    noImages: "No shareholder structure images uploaded yet",
  },
} as const;
