import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Harbor - Modern Web Application",
    template: "%s | Harbor",
  },
  description:
    "Harbor is a modern web application built with Next.js, featuring authentication, dashboard management, and admin capabilities.",
  keywords: ["Harbor"],
  authors: [{ name: "Harbor Team" }],
  creator: "Harbor Team",
  publisher: "Harbor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Harbor - Web Application",
    description: "",
    type: "website",
    locale: "pt_PT",
    url: "/",
    siteName: "Harbor",
    images: [
      {
        url: "/og-image.png",
        width: 800,
        height: 200,
        alt: "Harbor -Web Application",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harbor - Web Application",
    description:
      "Harbor is a modern web application built with Next.js, featuring authentication, dashboard management, and admin capabilities.",
    images: ["/og-image.png"],
    creator: "@harbor",
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
