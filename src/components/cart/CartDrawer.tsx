"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-sans text-2xl">Tu Carrito</SheetTitle>
          <SheetDescription className="font-sans">
            {items.length === 0
              ? "Tu carrito está vacío"
              : `${items.length} ${items.length === 1 ? "producto" : "productos"} en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-sans text-muted-foreground mb-6">
                Aún no has agregado productos
              </p>
              <Button onClick={onClose} className="font-sans">
                Explorar Productos
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border border-beige-400 rounded-lg bg-white"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-beige-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans font-medium text-sm mb-1 truncate">
                        {item.name}
                      </h4>
                      <p className="font-sans text-sm text-primary font-semibold mb-2">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-sans text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t pt-4 mt-4 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-lg font-semibold">Total</span>
                  <span className="font-sans text-2xl font-bold text-primary">
                    {formatPrice(getTotalPrice)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full font-sans" size="lg">
                    Proceder al Pago
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Button
                  variant="outline"
                  className="w-full font-sans"
                  onClick={onClose}
                >
                  Seguir Comprando
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
