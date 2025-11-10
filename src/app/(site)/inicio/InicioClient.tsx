"use client";

import { useState } from "react";
import Hero from "@/components/sections/Hero";
import ProductGallery from "@/components/sections/ProductGallery";
import HowToBuy from "@/components/sections/HowToBuy";
import InstagramSection from "@/components/sections/InstagramSection";
import EventosSection from "@/components/sections/EventosSection";
import TikTokSection from "@/components/sections/TikTokSection";
import OrderSidebar from "@/components/sections/OrderSidebar";

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
      <HowToBuy />
      <ProductGallery onOpenOrder={handleOpenOrder} />
      <InstagramSection onOpenOrder={() => handleOpenOrder()} />
      <EventosSection />
      <TikTokSection />
      <OrderSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        initialProduct={selectedProduct}
      />
    </div>
  );
}
