import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@harbor-app/ui/globals.css";
import { DevMessage } from "@/components/dev-message";
import { Providers } from "@/components/providers";
import { baseUrl } from "./sitemap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Harbor Partners | Investment Platform",
    template: "%s | Harbor Partners",
  },
  description:
    "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients. Specialized in Mergers & Acquisitions (M&A) and Commercial Real Estate investments",
  openGraph: {
    title: "Harbor Partners | Investment Platform",
    description:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients. Specialized in Mergers & Acquisitions (M&A) and Commercial Real Estate investments",
    url: baseUrl,
    siteName:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients. Specialized in Mergers & Acquisitions (M&A) and Commercial Real Estate investments",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "",
        width: 800,
        height: 600,
      },
      {
        url: "",
        width: 1800,
        height: 1600,
      },
    ],
  },
  twitter: {
    title: "Harbor Partners | Investment Platform",
    description:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients. Specialized in Mergers & Acquisitions (M&A) and Commercial Real Estate investments",
    images: [
      {
        url: "",
        width: 800,
        height: 600,
      },
      {
        url: "",
        width: 1800,
        height: 1600,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <DevMessage />
        </Providers>
      </body>
    </html>
  );
}
