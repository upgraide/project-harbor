export default {
  updateProfileCard: {
    title: "Your Name",
    description: "This is your name. It will be displayed on your profile.",
    placeholder: "First & Last Name",
    warning: "Please use 32 characters at maximum.",
    saveButton: "Save Changes",
    toast: {
      success: "Name updated successfully!",
      error: "Failed to update name. Please try again.",
      loading: "Updating name...",
    },
  },
} as const;
