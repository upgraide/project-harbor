import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@harbor-app/ui/globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://app.harborpartners.com"), //TODO: Change to the correct URL
  title: "Harbor Partners | Investment Platform",
  description:
    "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients. Specialized in Mergers & Acquisitions (M&A) and Commercial Real Estate investments",
  twitter: {
    title: "Harbor Partners | Investment Platform",
    description:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients. Specialized in Mergers & Acquisitions (M&A) and Commercial Real Estate investments",
    images: [
      {
        url: "", //TODO: Change to the correct URL
        width: 800,
        height: 600,
      },
      {
        url: "", //TODO: Change to the correct URL
        width: 1800,
        height: 1600,
      },
    ],
  },
  openGraph: {
    title: "Harbor Partners | Investment Platform",
    description:
      "Harbor Partners is a Lisbon based, Investment Advisory Firm, dedicated to providing holistic and integrated services to institutional and high net worth individual clients. Specialized in Mergers & Acquisitions (M&A) and Commercial Real Estate investments",
    url: "", //TODO: Change to the correct URL
    siteName: "Harbor Partners",
    images: [
      {
        url: "", //TODO: Change to the correct URL
        width: 800,
        height: 600,
      },
      {
        url: "", //TODO: Change to the correct URL
        width: 1800,
        height: 1600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers locale={locale}>{children}</Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
