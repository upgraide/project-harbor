export default {
  title: "Request access",
  description: "Please enter your informations to request access.",
  emailPlaceholder: "m@example.com",
  submit: "Request access",
  haveAccount: "Already have an account?",
  login: "Login",

  schemaMessages: {
    email: "Please enter a valid email address",
    name: {
      required: "Name is required",
      max: "Name must be less than 100 characters",
    },
    company: {
      required: "Company is required",
      max: "Company must be less than 100 characters",
    },
    phone: "Please enter a valid phone number",
    position: {
      required: "Position is required",
      max: "Position must be less than 1000 characters",
    },
    message: {
      required: "Message must be at least 10 characters",
      max: "Message must be less than 1000 characters",
    },
  },

  labels: {
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    position: "Position",
    message: "Message",
  },

  placeholders: {
    name: "Enter your name",
    email: "m@example.com",
    company: "Enter your company",
    phone: "+351 912 345 678",
    position: "Enter your position",
    message: "Enter your message",
  },
} as const;
