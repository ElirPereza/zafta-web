"use client";

import { useState } from "react";
import ProductGallery from "@/components/sections/ProductGallery";
import OrderSidebar from "@/components/sections/OrderSidebar";

export default function NuestrasTortasPage() {
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
      <div className="pt-20">
        <ProductGallery onOpenOrder={handleOpenOrder} />
      </div>
      <OrderSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        initialProduct={selectedProduct}
      />
    </>
  );
}
