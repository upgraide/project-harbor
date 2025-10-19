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
  },
} as const;
