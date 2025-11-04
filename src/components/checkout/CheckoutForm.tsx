"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShippingForm } from "./ShippingForm";
import { WompiCheckout } from "./WompiCheckout";
import { useCartStore } from "@/store/cartStore";
import { Loader2, User, Mail, Phone, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ShippingData {
  address: string;
  department: string;
  city: string;
  notes: string;
  shippingCost: number;
}

interface CheckoutFormProps {
  onShippingCostChange?: (cost: number) => void;
}

export function CheckoutForm({ onShippingCostChange }: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Guest User Information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Shipping Information
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("wompi");

  const handleShippingChange = (data: ShippingData) => {
    setShippingData(data);
    if (onShippingCostChange) {
      onShippingCostChange(data.shippingCost);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación
    if (!name || !email || !phone) {
      setError("Por favor completa todos los campos de información personal");
      return;
    }

    if (!shippingData || !shippingData.address || !shippingData.department || !shippingData.city) {
      setError("Por favor completa todos los campos de dirección de envío");
      return;
    }

    if (shippingData.shippingCost === 0) {
      setError("Esperando cálculo del costo de envío");
      return;
    }

    setLoading(true);

    try {
      // Calculate totals
      const subtotal = getTotalPrice;
      const total = subtotal + shippingData.shippingCost;

      console.log("📦 Creating order with:", {
        itemsCount: items.length,
        subtotal,
        shippingCost: shippingData.shippingCost,
        total,
      });

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          customerName: name,
          customerPhone: phone,
          shippingAddress: shippingData.address,
          shippingCity: shippingData.city,
          shippingDepartment: shippingData.department,
          deliveryNotes: shippingData.notes,
          shippingCost: shippingData.shippingCost,
          subtotal,
          total,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.image,
          })),
          paymentMethod,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Order creation failed:", errorData);
        throw new Error(errorData.error || errorData.details || "Error al crear el pedido");
      }

      const order = await orderResponse.json();

      // If payment is wompi, show payment widget
      if (paymentMethod === "wompi") {
        setCreatedOrderId(order.id);
        setLoading(false);
      } else {
        // For other payment methods (cash on delivery, etc.)
        clearCart();
        router.push(`/pedido-confirmado/${order.id}`);
      }
    } catch (err) {
      console.error("Error processing order:", err);
      setError(
        "Hubo un error al procesar tu pedido. Por favor intenta nuevamente."
      );
      setLoading(false);
    }
  };

  const handleWompiSuccess = () => {
    clearCart();
    if (createdOrderId) {
      router.push(`/pedido-confirmado/${createdOrderId}`);
    }
  };

  const handleWompiError = (errorMsg: string) => {
    setError(`Error en el pago: ${errorMsg}`);
    setCreatedOrderId(null);
  };

  // Si ya se creó la orden con Wompi, mostrar el widget de pago
  if (createdOrderId) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-serif italic mb-6 text-center">
          Completa tu Pago
        </h2>
        <WompiCheckout
          orderId={createdOrderId}
          onSuccess={handleWompiSuccess}
          onError={handleWompiError}
        />
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg font-sans text-sm">
            {error}
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCreatedOrderId(null)}
          className="w-full mt-4"
        >
          Volver al formulario
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Información Personal
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="María García"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="300 123 4567"
              required
            />
            <p className="text-xs text-muted-foreground font-sans">
              Número celular colombiano (sin +57)
            </p>
          </div>
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          Dirección de Envío
        </h2>
        <ShippingForm onShippingChange={handleShippingChange} />
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Método de Pago
        </h2>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="wompi" id="wompi" />
            <Label htmlFor="wompi" className="flex-1 cursor-pointer font-sans">
              <div className="font-medium">Pago en Línea (Wompi)</div>
              <div className="text-sm text-muted-foreground">
                Tarjeta de crédito, débito, PSE, Nequi, etc.
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex-1 cursor-pointer font-sans">
              <div className="font-medium">Pago Contra Entrega</div>
              <div className="text-sm text-muted-foreground">
                Paga en efectivo al recibir tu pedido
              </div>
            </Label>
          </div>
        </RadioGroup>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg font-sans text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full font-sans text-lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            {paymentMethod === "wompi" ? "Ir a Pagar" : "Confirmar Pedido"}
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground font-sans">
        Al confirmar tu pedido, aceptas nuestros términos y condiciones
      </p>
    </form>
  );
}
