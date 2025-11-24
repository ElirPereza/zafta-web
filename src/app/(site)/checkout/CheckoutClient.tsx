"use client";

import { useCartStore } from "@/store/cartStore";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDeliveryTimeInfo } from "@/lib/holidays";

export default function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const [shippingCost, setShippingCost] = useState(0);
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingLocation, setShippingLocation] = useState<{
    city: string;
    department: string;
  } | null>(null);
  const [discount, setDiscount] = useState<{
    code: string;
    percent: number;
    amount: number;
  } | null>(null);

  // Get delivery time info
  const deliveryInfo = getDeliveryTimeInfo();

  // Redirect to products if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/productos");
    }
  }, [items, router]);

  if (items.length === 0) {
    return (
      <div className="pt-32 min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl mb-4">Tu carrito está vacío</h1>
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
    <div className="pt-32 min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            Finalizar Pedido
          </h1>
          <p className="text-lg text-muted-foreground font-sans">
            Completa tus datos para procesar tu pedido
          </p>
        </div>

        {/* Important Notice */}
        <div className="max-w-3xl mx-auto mb-6 md:mb-8 px-4 sm:px-0 space-y-4">
          {/* Dynamic delivery time message */}
          <Alert
            className={
              deliveryInfo.canOrderToday
                ? "border-green-500 bg-green-50"
                : "border-amber-500 bg-amber-50"
            }
          >
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
            <AlertTitle className="font-sans font-semibold text-foreground text-sm sm:text-base">
              Estado de tu Pedido
            </AlertTitle>
            <AlertDescription className="font-sans text-xs sm:text-sm text-muted-foreground mt-2">
              <p className="leading-relaxed font-medium">
                {deliveryInfo.message}
              </p>
            </AlertDescription>
          </Alert>

          {/* General delivery info */}
          <Alert className="border-primary/50 bg-primary/10">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
            <AlertTitle className="font-sans font-semibold text-foreground text-sm sm:text-base">
              Información de Entregas
            </AlertTitle>
            <AlertDescription className="font-sans text-xs sm:text-sm text-muted-foreground space-y-1.5 mt-2">
              <p className="leading-relaxed">
                • Las entregas se realizan en un día hábil:
              </p>
              <p className="leading-relaxed pl-4">
                – Si haces tu pedido en la mañana, llega al día siguiente en la
                mañana.
              </p>
              <p className="leading-relaxed pl-4">
                – Si lo haces en la tarde, llega al día siguiente en la tarde.
              </p>
              <p className="leading-relaxed">
                • No realizamos entregas los domingos ni días festivos.
              </p>
              <p className="leading-relaxed">
                • Los sábados despachamos hasta las 12:00 p.m.
              </p>
            </AlertDescription>
          </Alert>
        </div>

        {/* Checkout Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column: Forms */}
          <div>
            <CheckoutForm
              onShippingCostChange={setShippingCost}
              onEmailChange={setCustomerEmail}
              onLocationChange={setShippingLocation}
              discount={discount}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <OrderSummary
              shippingCost={shippingCost}
              customerEmail={customerEmail}
              shippingLocation={shippingLocation}
              onDiscountApplied={setDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
