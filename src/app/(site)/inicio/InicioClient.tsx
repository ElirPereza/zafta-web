"use client";

import { useState } from "react";
import Hero from "@/components/sections/Hero";
import ProductGallery from "@/components/sections/ProductGallery";
import HowToBuy from "@/components/sections/HowToBuy";
import InstagramSection from "@/components/sections/InstagramSection";
import EventosSection from "@/components/sections/EventosSection";
import OrderSidebar from "@/components/sections/OrderSidebar";
import Footer from "@/components/layout/Footer";

export default function InicioClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleOpenOrder = (product?: any) => {
    setSelectedProduct(product || null);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="overflow-x-hidden">
      <Hero />
      {/* Aurora Dream ZAFTA - Seamless gradient wrapper for all sections including Footer */}
      <div
        className="relative"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 35%, rgba(229, 176, 151, 0.40), transparent 70%),
            radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 180, 162, 0.35), transparent 68%),
            radial-gradient(ellipse 65% 50% at 85% 70%, rgba(255, 225, 217, 0.38), transparent 65%),
            radial-gradient(ellipse 60% 48% at 75% 15%, rgba(244, 168, 159, 0.32), transparent 68%),
            radial-gradient(ellipse 55% 45% at 20% 80%, rgba(128, 1, 31, 0.15), transparent 70%),
            linear-gradient(135deg, #FFFBEF 0%, #FFF5ED 100%)
          `,
        }}
      >
        <HowToBuy />
        <ProductGallery onOpenOrder={handleOpenOrder} />
        <InstagramSection onOpenOrder={() => handleOpenOrder()} />
        <EventosSection />
        <Footer />
      </div>
      <OrderSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        initialProduct={selectedProduct}
      />
    </div>
  );
}
