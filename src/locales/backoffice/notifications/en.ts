export default {
  title: "Notifications",
  description: "Manage access requests and view notifications",
  empty: "No access requests found",
  filter: {
    status: "Filter by status",
    all: "All",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  },
  fields: {
    company: "Company",
    position: "Position",
    phone: "Phone",
    createdAt: "Created at",
    message: "Message",
  },
  actions: {
    approve: "Approve",
    reject: "Reject",
  },
} as const;
