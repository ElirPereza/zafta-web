"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Tag, Loader2, Check, X, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryProps {
  shippingCost?: number;
  customerEmail?: string; // Email to check if code was already used
  shippingLocation?: {
    city: string;
    department: string;
  } | null;
  onDiscountApplied?: (discount: {
    code: string;
    percent: number;
    amount: number;
  }) => void;
}

export function OrderSummary({
  shippingCost = 0,
  customerEmail,
  shippingLocation,
  onDiscountApplied,
}: OrderSummaryProps) {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotalPrice());

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percent: number;
    amount: number;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freeShippingQualified, setFreeShippingQualified] = useState<{
    qualifies: boolean;
    rule: { id: string; name: string; type: string } | null;
  } | null>(null);

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const actualShippingCost = freeShippingQualified?.qualifies
    ? 0
    : shippingCost;
  const total = subtotal + actualShippingCost - discountAmount;

  // Check for free shipping whenever location or subtotal changes
  useEffect(() => {
    const checkFreeShipping = async () => {
      // Don't check if location is missing or subtotal is 0
      if (!shippingLocation?.city || !shippingLocation?.department || subtotal <= 0) {
        setFreeShippingQualified(null);
        return;
      }

      try {
        const response = await fetch("/api/free-shipping/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subtotal,
            city: shippingLocation.city,
            department: shippingLocation.department,
          }),
        });

        const data = await response.json();
        setFreeShippingQualified(data);
      } catch (error) {
        console.error("[FREE SHIPPING] Error checking free shipping:", error);
        setFreeShippingQualified(null);
      }
    };

    checkFreeShipping();
  }, [shippingLocation, subtotal]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setError("Ingresa un código de descuento");
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await fetch("/api/discount-popup/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: discountCode.trim(),
          customerEmail: customerEmail || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Código inválido");
        setIsValidating(false);
        return;
      }

      const discountValue = Math.round(
        (subtotal * data.discount.percent) / 100,
      );

      const discount = {
        code: data.discount.code,
        percent: data.discount.percent,
        amount: discountValue,
      };

      setAppliedDiscount(discount);
      setError(null);
      onDiscountApplied?.(discount);
    } catch (err) {
      setError("Error al validar el código");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setError(null);
    onDiscountApplied?.(null as any);
  };

  return (
    <Card className="p-6 sticky top-32">
      <h2 className="text-2xl mb-6">Resumen del Pedido</h2>

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
              <p
                className="text-sm text-primary font-semibold mt-1"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Discount Code Section */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
          <Tag className="h-4 w-4" />
          <span>¿Tienes un código de descuento?</span>
        </div>

        {!appliedDiscount ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Ej: BIENVENIDA10"
                className="flex-1 font-sans"
                disabled={isValidating}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyDiscount();
                  }
                }}
              />
              <Button
                onClick={handleApplyDiscount}
                disabled={isValidating || !discountCode.trim()}
                variant="outline"
                size="sm"
                className="px-4"
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Aplicar"
                )}
              </Button>
            </div>
            {error && (
              <p className="text-xs text-red-600 font-sans flex items-center gap-1">
                <X className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-sans font-medium text-green-900">
                  {appliedDiscount.code}
                </p>
                <p className="text-xs font-sans text-green-700">
                  {appliedDiscount.percent}% de descuento aplicado
                </p>
              </div>
            </div>
            <Button
              onClick={handleRemoveDiscount}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-green-700 hover:text-green-900 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center gap-3 text-sm font-sans">
          <span className="text-muted-foreground shrink-0">Subtotal</span>
          <span
            className="font-medium text-right min-w-0 overflow-hidden text-ellipsis"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            {formatPrice(subtotal)}
          </span>
        </div>

        {appliedDiscount && (
          <div className="flex justify-between items-center gap-3 text-sm font-sans">
            <span className="text-green-600 shrink-0">
              Descuento ({appliedDiscount.percent}%)
            </span>
            <span
              className="font-medium text-green-600 text-right min-w-0 overflow-hidden text-ellipsis"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              -{formatPrice(appliedDiscount.amount)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center gap-3 text-sm font-sans">
          <span className="text-muted-foreground flex items-center gap-2 shrink-0">
            Envío
            {freeShippingQualified?.qualifies && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-300 font-sans text-xs"
              >
                <Truck className="h-3 w-3 mr-1" />
                ¡Gratis!
              </Badge>
            )}
          </span>
          <span
            className="font-medium text-right min-w-0 overflow-hidden text-ellipsis"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            {freeShippingQualified?.qualifies
              ? formatPrice(0)
              : shippingCost > 0
                ? formatPrice(shippingCost)
                : "Por calcular"}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between items-center gap-3 text-lg font-sans">
          <span className="font-semibold shrink-0">Total</span>
          <span
            className="font-bold text-primary text-xl text-right min-w-0 overflow-hidden text-ellipsis"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 p-4 bg-primary/30 rounded-lg">
        <p className="text-xs font-sans text-muted-foreground leading-relaxed">
          El costo de envío se calculará automáticamente según tu dirección.
        </p>
      </div>
    </Card>
  );
}
