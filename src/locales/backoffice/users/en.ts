export default {
  title: "Users",
  description: "Manage and view all users in the system",
  searchPlaceholder: "Search by name or email...",
  newButtonLabel: "Add User",
  errorMessage: "Failed to load users. Please try again.",
  emptyMessage: "No users found.",
  table: {
    name: "Name",
    email: "Email",
    joinedDate: "Joined",
    lastLogin: "Last Login",
    neverLoggedIn: "Never logged in",
    status: "Status",
    actions: "Actions",
    active: "Active",
    inactive: "Inactive",
  },
  deleteDialog: {
    title: "Delete User",
    description:
      "Are you sure you want to delete {name}? This action cannot be undone.",
    confirm: "Delete",
    cancel: "Cancel",
  },
  inviteDialog: {
    title: "Invite User",
    description: "Send an invitation to join the system",
    labels: {
      name: "Full Name",
      email: "Email Address",
      language: "Preferred Language",
    },
    languages: {
      english: "English",
      portuguese: "Português",
    },
    send: "Send Invitation",
    sending: "Sending...",
    cancel: "Cancel",
  },
} as const;
