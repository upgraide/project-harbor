export default {
  ladingPage: {
    title: {
      firstRow: "YOUR TRUSTED",
      secondRow: "PARTNER FOR",
      thirdRow: "STRATEGIC GROWTH",
    },
    description:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients.",
    buttons: {
      requestAccess: "Request access",
      membershipLogin: "Membership login",
    },
  },
  signInPage: {
    title: "Sign in to your account",
    description:
      "Insert your email and password below to sign in to your account",
    dontHaveAccount: "Don't have an account?",
    buttons: {
      signIn: "Sign in",
      requestAccess: "Request access",
      back: "Back",
    },
    forgotPassword: "Forgot your password?",
    emailPlaceholder: "m@example.com",
    passwordPlaceholder: "Password",
    toastSuccess: "Signed in successfully! Redirecting to dashboard...",
    toastError: "Failed to sign in. Please try again.",
    toastResetPasswordSuccess: "Check your email for the reset password link!",
    toastResetPasswordError:
      "Failed to send reset password link. Please try again.",
  },
  themeSwitcher: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  resetPasswordPage: {
    invalidLinkCard: {
      title: "Invalid Link",
      description:
        "This password reset link is invalid or has expired. Please request a new one.",
    },
    resetPasswordCard: {
      title: "Reset Your Password",
      description: "Insert your new password below to reset your password",
    },
    schemaMessages: {
      password: {
        min: "Password must be at least 8 characters",
        label: "New Password",
        placeholder: "********",
        description: "Enter your new password",
      },
      confirmPassword: {
        min: "Confirm password must be at least 8 characters",
        match: "Passwords do not match",
        label: "Confirm Password",
        placeholder: "********",
        description: "Confirm your new password",
      },
      error: {
        default: "Failed to reset password. Please try again.",
      },
    },
    buttons: {
      submit: "Reset Your Password",
    },
  },
} as const;
