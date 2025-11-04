"use client";

import { useCartStore } from "@/store/cartStore";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const [shippingCost, setShippingCost] = useState(0);

  // Redirect to products if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/productos");
    }
  }, [items, router]);

  if (items.length === 0) {
    return (
      <div className="pt-32 min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-serif italic mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-8 font-sans">
              Agrega algunos productos antes de proceder al pago
            </p>
            <Link href="/productos">
              <Button size="lg">Ver Productos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif italic mb-4 text-foreground">
            Finalizar Pedido
          </h1>
          <p className="text-lg text-muted-foreground font-sans">
            Completa tus datos para procesar tu pedido
          </p>
        </div>

        {/* Checkout Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column: Forms */}
          <div>
            <CheckoutForm onShippingCostChange={setShippingCost} />
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <OrderSummary shippingCost={shippingCost} />
          </div>
        </div>
      </div>
    </div>
  );
}
