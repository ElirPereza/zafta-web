"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShippingForm } from "./ShippingForm";
import { WompiCheckout } from "./WompiCheckout";
import { DeliveryDatePicker } from "./DeliveryDatePicker";
import {
  DeliveryMethodSelector,
  type DeliveryMethodType,
  STORE_INFO,
} from "./DeliveryMethodSelector";
import { useCartStore } from "@/store/cartStore";
import {
  Loader2,
  User,
  Mail,
  Phone,
  CreditCard,
  CalendarDays,
  IdCard,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ShippingData {
  address: string;
  department: string;
  city: string;
  notes: string;
  shippingCost: number;
}

interface CheckoutFormProps {
  onShippingCostChange?: (cost: number) => void;
  onEmailChange?: (email: string) => void;
  onLocationChange?: (location: { city: string; department: string }) => void;
  discount?: {
    code: string;
    percent: number;
    amount: number;
  } | null;
}

export function CheckoutForm({
  onShippingCostChange,
  onEmailChange,
  onLocationChange,
  discount,
}: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Guest User Information
  const [name, setName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethodType>("DELIVERY");

  // Shipping Information (solo para DELIVERY)
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

  // Delivery Date
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();

  // Payment Method - Solo Wompi
  const paymentMethod = "wompi";

  const handleDeliveryMethodChange = (method: DeliveryMethodType) => {
    setDeliveryMethod(method);
    if (method === "PICKUP") {
      // Cuando es recogida en tienda, el costo de envío es 0
      if (onShippingCostChange) {
        onShippingCostChange(0);
      }
      if (onLocationChange) {
        onLocationChange({
          city: STORE_INFO.city,
          department: STORE_INFO.department,
        });
      }
      // Limpiar datos de envío
      setShippingData(null);
    }
  };

  const handleShippingChange = (data: ShippingData) => {
    setShippingData(data);
    if (onShippingCostChange) {
      onShippingCostChange(data.shippingCost);
    }
    if (onLocationChange) {
      onLocationChange({
        city: data.city,
        department: data.department,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación
    if (!name || !documentId || !email || !phone) {
      setError("Por favor completa todos los campos de información personal");
      return;
    }

    // Validar formato de cédula colombiana (6-10 dígitos)
    const cedulaRegex = /^\d{6,10}$/;
    if (!cedulaRegex.test(documentId.replace(/\s/g, ""))) {
      setError("La cédula de ciudadanía debe tener entre 6 y 10 dígitos");
      return;
    }

    // Solo validar dirección de envío si es DELIVERY
    if (deliveryMethod === "DELIVERY") {
      if (
        !shippingData ||
        !shippingData.address ||
        !shippingData.department ||
        !shippingData.city
      ) {
        setError("Por favor completa todos los campos de dirección de envío");
        return;
      }

      if (shippingData.shippingCost === 0) {
        setError("Esperando cálculo del costo de envío");
        return;
      }
    }

    if (!deliveryDate) {
      setError("Por favor selecciona una fecha de entrega");
      return;
    }

    setLoading(true);

    try {
      // Calculate totals
      const subtotal = getTotalPrice;
      const discountAmount = discount ? discount.amount : 0;
      const shippingCost =
        deliveryMethod === "PICKUP" ? 0 : shippingData?.shippingCost || 0;
      const total = subtotal + shippingCost - discountAmount;

      console.log("📦 Creating order with:", {
        itemsCount: items.length,
        deliveryMethod,
        subtotal,
        shippingCost,
        discount: discount
          ? `${discount.code} (${discount.percent}%)`
          : "No discount",
        discountAmount,
        total,
      });

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          customerName: name,
          customerDocumentId: documentId.replace(/\s/g, ""),
          customerPhone: phone,
          deliveryMethod,
          // Datos de envío solo si es DELIVERY
          shippingAddress:
            deliveryMethod === "DELIVERY" ? shippingData?.address : null,
          shippingCity:
            deliveryMethod === "DELIVERY"
              ? shippingData?.city
              : STORE_INFO.city,
          shippingDepartment:
            deliveryMethod === "DELIVERY"
              ? shippingData?.department
              : STORE_INFO.department,
          deliveryDate: deliveryDate.toISOString(),
          deliveryNotes:
            deliveryMethod === "PICKUP"
              ? "RECOGIDA EN LOCAL"
              : shippingData?.notes,
          shippingCost,
          subtotal,
          total,
          discountCode: discount?.code,
          discountAmount: discountAmount,
          items: items.map((item) => ({
            productId: item.productId || item.id,
            name: item.name,
            sizeName: item.sizeName,
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
        throw new Error(
          errorData.error || errorData.details || "Error al crear el pedido",
        );
      }

      const order = await orderResponse.json();

      // Show Wompi payment widget
      setCreatedOrderId(order.id);
      setLoading(false);
    } catch (err) {
      console.error("Error processing order:", err);
      setError(
        "Hubo un error al procesar tu pedido. Por favor intenta nuevamente.",
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
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6 text-center">
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Personal Information */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
          <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
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
            <Label htmlFor="documentId" className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              Cédula de Ciudadanía *
            </Label>
            <Input
              id="documentId"
              type="text"
              inputMode="numeric"
              value={documentId}
              onChange={(e) => {
                // Solo permitir números
                const value = e.target.value.replace(/\D/g, "");
                setDocumentId(value);
              }}
              placeholder="1234567890"
              maxLength={10}
              required
            />
            <p className="text-xs text-muted-foreground font-sans">
              Solo números, sin puntos ni espacios
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                onEmailChange?.(e.target.value);
              }}
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

      {/* Delivery Method */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          ¿Cómo deseas recibir tu pedido?
        </h2>
        <DeliveryMethodSelector
          value={deliveryMethod}
          onChange={handleDeliveryMethodChange}
        />
      </Card>

      {/* Shipping Address - Solo si es DELIVERY */}
      {deliveryMethod === "DELIVERY" && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Dirección de Envío
          </h2>
          <ShippingForm onShippingChange={handleShippingChange} />
        </Card>
      )}

      {/* Delivery Date */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Fecha de Entrega
        </h2>
        <DeliveryDatePicker value={deliveryDate} onChange={setDeliveryDate} />
      </Card>

      {/* Payment Method */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Método de Pago
        </h2>
        <div className="p-3 sm:p-4 border rounded-lg bg-accent/50">
          <div className="font-medium text-sm sm:text-base">
            Pago en Línea (Wompi)
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Tarjeta de crédito, débito, PSE, Nequi, Daviplata y más
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-sans text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full font-sans text-base sm:text-lg py-5 sm:py-6"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            Procesando...
          </>
        ) : (
          "Ir a Pagar"
        )}
      </Button>

      <p className="text-center text-xs sm:text-sm text-muted-foreground font-sans">
        Al confirmar tu pedido, aceptas nuestro{" "}
        <a
          href="/aviso-de-privacidad"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Aviso de Privacidad
        </a>{" "}
        y nuestra{" "}
        <a
          href="/politica-de-datos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Política de Datos
        </a>
      </p>
    </form>
  );
}
