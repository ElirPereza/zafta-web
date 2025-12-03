import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
// Zafta Brand Fonts (del BrandBook)

// Fredoka - Font Secundaria (Light, Regular, Medium, Semibold, Bold)
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Light, Regular, Medium, Semibold, Bold
  display: "swap",
});

// Gotham - Font para Títulos (h1, h2)
const gotham = localFont({
  src: [
    {
      path: "../../public/fonts/Gotham/gotham_medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/gotham_bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gotham/gotham_black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gotham",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

import {
  generateMetadata as genMetadata,
  generateOrganizationSchema,
} from "@/lib/metadata";

export const metadata: Metadata = genMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <ClerkProvider localization={esES}>
      <html lang="es" className={`${fredoka.variable} ${gotham.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
        </head>
        <body>
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
