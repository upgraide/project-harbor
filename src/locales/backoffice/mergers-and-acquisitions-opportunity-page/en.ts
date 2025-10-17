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
      },
    },
  },
} as const;
