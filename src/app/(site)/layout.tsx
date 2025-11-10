import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp";
import { AdminFloatingButton } from "@/components/admin/AdminFloatingButton";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <AdminFloatingButton />
    </>
  );
}
