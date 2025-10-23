export default {
  title: "Settings",
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
  updateAvatarCard: {
    title: "Your Avatar",
    description: "This is your avatar. It will be displayed on your profile.",
    uploadHint: "Click on the avatar to upload a custom one from your files.",
    resetButton: "Reset",
    uploadToast: {
      success: "Avatar updated successfully!",
      error: "Failed to update avatar. Please try again.",
      loading: "Updating avatar...",
    },
    removeToast: {
      success: "Avatar removed successfully!",
      error: "Failed to remove avatar. Please try again.",
      loading: "Removing avatar...",
    },
  },
} as const;
