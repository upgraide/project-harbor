export default {
  title: "Investment Interests",
  description:
    "View and manage investor interests in M&A and Real Estate opportunities",
  searchPlaceholder: "Search by opportunity or client name...",
  errorMessage: "Failed to load investment interests. Please try again.",
  emptyTitle: "No Investment Interests",
  emptyMessage: "No investment interests found matching your filters.",
  noMoreItems: "All interests loaded",
  filters: {
    type: {
      placeholder: "Type",
      all: "All Types",
      "m&a": "M&A",
      "real-estate": "Real Estate",
    },
    status: {
      placeholder: "Status",
      all: "All Statuses",
      pending: "Pending",
      processed: "Processed",
    },
  },
  table: {
    clientName: "Client Name",
    project: "Project",
    interestType: "Interest Type",
    interestStatus: "Interest",
    date: "Date",
    status: "Status",
    actions: "Actions",
  },
  interestType: {
    "m&a": "M&A",
    "real-estate": "Real Estate",
  },
  interestStatus: {
    interested: "Interested",
    notInterested: "Not Interested",
  },
  status: {
    pending: "Pending",
    processed: "Processed",
  },
  actions: {
    viewDetails: "View Details",
    markAsProcessed: "Mark as Processed",
    markAsUnprocessed: "Mark as Unprocessed",
    sendDocuments: "Send Documents",
  },
} as const;
