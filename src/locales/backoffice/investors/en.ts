export default {
  title: "Clients / Investors",
  addNewInvestor: "Add New Investor",
  searchPlaceholder: "Search by name or email...",
  errorMessage: "Failed to load investors. Please try again.",
  emptyTitle: "No Investors",
  emptyMessage: "No investors found matching your filters.",
  filters: {
    investorType: {
      placeholder: "Investor Type",
      all: "All Types",
      "<€10M": "<€10M",
      "€10M-€100M": "€10M-€100M",
      ">€100M": ">€100M",
    },
    interestSegment: {
      placeholder: "Interest Segment",
      all: "All Segments",
      CRE: "CRE",
      "M&A": "M&A",
    },
    industry: {
      placeholder: "Industry/Subcategory",
      all: "All Industries",
    },
  },
  table: {
    name: "Name",
    email: "Email",
    investorType: "Investor Type",
    interestSegments: "Interest Segments",
    interestSubcategories: "Interest Subcategories",
    preferredLocation: "Preferred Lc",
  },
} as const;
