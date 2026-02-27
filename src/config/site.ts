export const siteConfig = {
  name: "Harbor Partners | Web Application",
  applicationName: "Harbor Partners",
  template: "%s | Harbor Partners",
  url: "https://harbor001-iota.vercel.app",
  generator: "Next.js",
  description:
    "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients.",
  keywords: ["Harbor Partners", "Web Application", "Harbor Partners"],
  links: {
    email: "",
  },
  authors: [
    {
      name: "Rodrigo Santos",
      url: "https://rodrigosantos.dev",
    },
    {
      name: "Diogo Babo",
      email: "diogo.babo@gmail.com",
    },
  ],
  alternates: {
    canonical: "https://harbor001-iota.vercel.app",
    languages: {
      "en-US": "https://harbor001-iota.vercel.app/en",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Harbor Partners | Web Application",
    description:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients.",
    url: "https://harbor001-iota.vercel.app",
    siteName: "Harbor Partners | Web Application",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "https://harbor001-iota.vercel.app/assets/logo-dark.png",
        width: 4501,
        height: 4501,
        alt: "Harbor Partners | Web Application",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harbor Partners | Web Application",
    description:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients.",
    images: ["https://harbor001-iota.vercel.app/assets/logo-dark.png"],
  },
  manifest: "/site.webmanifest",
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
