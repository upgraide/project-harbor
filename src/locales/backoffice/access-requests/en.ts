export default {
  title: "Access Requests",
  description: "Manage pending access requests to the platform",
  emptyMessage: "No pending access requests",
  errorMessage: "Failed to load access requests",
  table: {
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    position: "Position",
    date: "Date",
    actions: "Actions",
  },
  approveButton: "Approve",
  rejectButton: "Reject",
  approving: "Approving...",
  rejecting: "Rejecting...",
  approveSuccess: "Access request approved and invite sent",
  rejectSuccess: "Access request rejected",
  rejectDialog: {
    title: "Reject Access Request",
    description:
      "Are you sure you want to reject this access request from {name}? This action cannot be undone.",
    confirm: "Reject",
    cancel: "Cancel",
  },
} as const;
