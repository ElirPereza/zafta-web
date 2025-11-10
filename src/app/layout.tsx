import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Zafta Brand Fonts (del BrandBook)

// Lust - Font Principal (tipografía con alto contraste para títulos)
// Nota: Lust es una fuente comercial del BrandBook
const lust = localFont({
  src: [
    {
      path: "../../public/fonts/lust/fonnts.com-Lust-Fine-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/lust/fonnts.com-Lust-Display-Italic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/lust/fonnts.com-Lust-Didone-Fine-.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lust",
  display: "swap",
  fallback: ["Didot", "Bodoni MT", "Playfair Display", "serif"],
});

// Fredoka - Font Secundaria (Light, Regular, Medium, Semibold, Bold)
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Light, Regular, Medium, Semibold, Bold
  display: "swap",
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
      <html lang="es" className={`${lust.variable} ${fredoka.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
        </head>
        <body className="antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
