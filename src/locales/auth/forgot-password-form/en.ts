export default {
  title: "Forgot Password",
  description:
    "Enter your email address and we'll send you a temporary password.",
  emailPlaceholder: "m@example.com",
  submit: "Send temporary password",
  submitting: "Sending...",
  backToLogin: "Back to login",
  successMessage:
    "If this email is registered, you will receive a temporary password shortly.",
  errorMessage: "Something went wrong. Please try again.",

  schemaMessages: {
    email: "Please enter a valid email address",
  },
} as const;
