"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { DiscountPopup } from "@/components/ui/discount-popup";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Inicio page has its own gradient wrapper implementation
  const isInicioPage = pathname === "/inicio";

  return (
    <>
      <Navigation />
      {isInicioPage ? (
        // Inicio page handles its own gradient and footer
        <main className="min-h-screen">{children}</main>
      ) : (
        // All other pages use Aurora background wrapper with same gradient as inicio
        <AuroraBackground>
          <main>{children}</main>
          <Footer />
        </AuroraBackground>
      )}
      <FloatingWhatsApp />
      <DiscountPopup />
    </>
  );
}
