"use client";

import { useState } from "react";
import Hero from "@/components/sections/Hero";
import ProductGallery from "@/components/sections/ProductGallery";
import HowToBuy from "@/components/sections/HowToBuy";
import InstagramSection from "@/components/sections/InstagramSection";
import OrderSidebar from "@/components/sections/OrderSidebar";
import { AdminRedirect } from "@/components/auth/AdminRedirect";

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
    <>
      <AdminRedirect />
      <div className="overflow-x-hidden">
        <Hero />
        <HowToBuy />
        <ProductGallery onOpenOrder={handleOpenOrder} />
        <InstagramSection onOpenOrder={() => handleOpenOrder()} />
        <OrderSidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          initialProduct={selectedProduct}
        />
      </div>
    </>
  );
}
