"use client";

import { useCartStore } from "@/store/cartStore";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  shippingCost?: number;
}

export function OrderSummary({ shippingCost = 0 }: OrderSummaryProps) {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotalPrice());
  const total = subtotal + shippingCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="p-6 sticky top-32">
      <h2 className="text-2xl font-serif italic mb-6">Resumen del Pedido</h2>

      {/* Items List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
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
              <p className="text-sm text-muted-foreground font-sans">
                Cantidad: {item.quantity}
              </p>
              <p className="font-sans text-sm text-primary font-semibold mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-sans">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm font-sans">
          <span className="text-muted-foreground">Envío</span>
          <span className="font-medium">
            {shippingCost > 0 ? formatPrice(shippingCost) : "Por calcular"}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-sans">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-primary text-xl">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
        <p className="text-xs font-sans text-muted-foreground leading-relaxed">
          El costo de envío se calculará automáticamente según tu dirección.
        </p>
      </div>
    </Card>
  );
}
