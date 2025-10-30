export default {
  title: "Change Your Password",
  description:
    "For security reasons, please change your password before continuing.",
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmPassword: "Confirm New Password",
  submit: "Change Password",
  cancel: "Cancel",
  schemaMessages: {
    currentPassword: {
      required: "Current password is required",
    },
    newPassword: {
      required: "New password is required",
      minLength: "Password must be at least 8 characters",
    },
    confirmPassword: {
      required: "Please confirm your new password",
      match: "Passwords do not match",
    },
  },
};
