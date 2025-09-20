export const siteConfig = {
  name: "Harbor Partners | Web Application",
  applicationName: "Harbor Partners",
  template: "%s | Harbor Partners",
  url: "https://app.harborpartners.pt",
  generator: "Next.js",
  description: "Harbor Partners Web Application",
  keywords: ["Harbor Partners", "Web Application", "Harbor Partners"],
  links: {
    email: "support@harborpartners.pt",
  },
  authors: [
    {
      name: "Rodrigo Santos",
      url: "https://rodrigosantos.dev",
    },
  ],
  alternates: {
    canonical: "https://app.harborpartners.pt",
    languages: {
      "en-US": "https://app.harborpartners.pt/en",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Harbor Partners | Web Application",
    description: "Harbor Partners Web Application",
    url: "https://app.harborpartners.pt",
    siteName: "Harbor Partners | Web Application",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "", // TODO: Add image
        width: 4501,
        height: 4501,
        alt: "Harbor Partners | Web Application",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harbor Partners | Web Application",
    description: "Harbor Partners Web Application",
    images: [""], // TODO: Add image
  },
  manifest: "https://app.harborpartners.pt/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
};

export type SiteConfig = typeof siteConfig;
