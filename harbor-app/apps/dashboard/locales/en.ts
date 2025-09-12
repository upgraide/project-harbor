export default {
  dashboard: {
    title: "Our Opportunities",
    description:
      "Browse our investment opportunities and find the right one for you",

    bodyTitle: "Get Started",
    bodyDescription:
      "To get started, please select a new opportunity by clicking on it",
    bodyTip:
      "Tip: You can choose to co-invest or become a lead investor by clicking on the button below",
    documentationLink: "Learn More",

    navigation: {
      dashboard: "Dashboard",
      opportunities: "Opportunities",
      personalAccount: "Personal Account",
      investors: "Investors",
      settings: "Settings",
      help: "Help",
      logout: "Logout",
      language: "Language",
      theme: "Theme",
    },
  },
  error: {
    title: "Something went wrong",
    description:
      "An unexpected error has occurred. Please try again or contact support if the issue persists.",
    tryAgain: "Try again",
    contactUs: "Contact us",
  },
  notFound: {
    title: "Not Found",
    description: "Could not find requested resource",
    returnHome: "Return Home",
  },
  consentBanner: {
    description:
      "This site uses tracking technologies. You may opt in or opt out of the use of these technologies.",
    deny: "Deny",
    accept: "Accept",
  },
  login: {
    title: "Welcome to Harbor Partners Platform",
    description: "Enter your email and password to continue",
    footer: "By signing in, you agree to our",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    toastTitle: {
      couldNotSignIn: "Could not sign in, please try again.",
      emailRequired: "Email is required.",
      passwordRequired: "Password is required.",
    },
  },
  settings: {
    title: "Settings",
    headerTitle: "Settings",
    headerDescription: "Manage your account settings.",
    sidebar: {
      general: "General",
    },
    avatar: {
      title: "Your Avatar",
      description: "This is your avatar. It will be displayed on your profile.",
      uploadHint: "Click on the avatar to upload a custom one from your files.",
      resetButton: "Reset",
    },
    handleUpdateUserImage: {
      toast: {
        loading: "Updating user image...",
        success: "User image updated successfully!",
        error: "Failed to update user image",
      },
    },
    handleUpdateUsername: {
      toast: {
        loading: "Updating username...",
        success: "Username updated successfully!",
        error: "Failed to update username",
      },
    },
    handleRemoveUserImage: {
      toast: {
        loading: "Removing avatar...",
        success: "Avatar removed successfully!",
        error: "Failed to remove avatar",
      },
    },
    username: {
      title: "Your Username",
      description:
        "This is your username. It will be displayed on your profile.",
      saveButton: "Save",
      warning: "Please use 32 characters at maximum.",
    },
  },
} as const;
