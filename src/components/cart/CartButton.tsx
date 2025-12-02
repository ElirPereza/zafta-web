"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={onClick}
      >
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Button>
  );
}
