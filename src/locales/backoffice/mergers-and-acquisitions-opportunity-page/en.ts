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
      },
    },
  },
} as const;
