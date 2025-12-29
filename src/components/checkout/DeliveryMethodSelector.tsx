"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Truck, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export type DeliveryMethodType = "DELIVERY" | "PICKUP";

interface DeliveryMethodSelectorProps {
  value: DeliveryMethodType;
  onChange: (value: DeliveryMethodType) => void;
}

// Información de la tienda para recogida (sin dirección pública por privacidad)
export const STORE_INFO = {
  city: "Medellín",
  department: "Antioquia",
  whatsapp: "+57 321 759 0897",
};

export function DeliveryMethodSelector({
  value,
  onChange,
}: DeliveryMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as DeliveryMethodType)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      >
        {/* Opción: Envío a domicilio */}
        <Label
          htmlFor="delivery"
          className={cn(
            "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
            value === "DELIVERY"
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <div className="flex items-start gap-3">
            <RadioGroupItem value="DELIVERY" id="delivery" className="mt-1" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="font-semibold text-base">
                  Envío a domicilio
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                Te llevamos tu pedido a la puerta de tu casa
              </p>
            </div>
          </div>
        </Label>

        {/* Opción: Recoger en tienda */}
        <Label
          htmlFor="pickup"
          className={cn(
            "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
            value === "PICKUP"
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <div className="flex items-start gap-3">
            <RadioGroupItem value="PICKUP" id="pickup" className="mt-1" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-semibold text-base">
                  Recoger en tienda
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                Recoge tu pedido sin costo de envío
              </p>
            </div>
          </div>
        </Label>
      </RadioGroup>

      {/* Información cuando se selecciona PICKUP */}
      {value === "PICKUP" && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="space-y-3">
            <h4 className="font-semibold text-green-800 flex items-center gap-2">
              <Store className="h-4 w-4" />
              Recogida en Local
            </h4>

            <p className="text-sm text-green-700 font-sans">
              Te contactaremos por WhatsApp para coordinar la recogida de tu pedido y darte la ubicación exacta.
            </p>

            <p className="text-xs text-green-600 font-sans pt-2 border-t border-green-200">
              Sin costo de envío
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
