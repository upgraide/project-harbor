import { FormDescription } from "@/components/ui/form";

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
    toastInvalidCredentials: "Invalid email or password",
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
  dashboard: {
    header: {
      title: "Dashboard",
      description: "Welcome to your dashboard",
    },
    navigation: {
      dashboard: "Dashboard",
      settings: "Settings",
      theme: "Theme",
      language: "Language",
      logout: "Logout",
      toastLogoutSuccess: "Logged out successfully!",
      toastLogoutError: "Failed to log out. Please try again.",
    },
    settings: {
      general: "General",
      updateAvatarCard: {
        title: "Your Avatar",
        description:
          "This is your avatar. It will be displayed on your profile.",
        uploadHint:
          "Click on the avatar to upload a custom one from your files.",
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
      updateNameCard: {
        title: "Your Name",
        description: "This is your name. It will be displayed on your profile.",
        label: "First & Last Name",
        placeholder: "First and Last name",
        warning: "Please use 32 characters at maximum.",
        saveButton: "Save",
        toast: {
          success: "Name updated successfully!",
          error: "Failed to update name. Please try again.",
          loading: "Updating name...",
        },
      },
    },
  },
  backoffice: {
    sidebar: {
      navigationItems: {
        opportunitiesMA: "Opportunities M&A",
        opportunitiesRealEstate: "Opportunities Real Estate",
        investors: "Investors",
        team: "Team",
      },
    },
  },
} as const;
