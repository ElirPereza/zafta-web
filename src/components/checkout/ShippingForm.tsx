"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import {
  useCities,
  useShippingCalculator,
} from "@/hooks/useShippingCalculator";

interface ShippingFormProps {
  onShippingChange: (data: {
    address: string;
    department: string;
    city: string;
    notes: string;
    shippingCost: number;
  }) => void;
}

export function ShippingForm({ onShippingChange }: ShippingFormProps) {
  const [address, setAddress] = useState("");
  // Antioquia fijo por ahora - solo entregas en Antioquia
  const [department] = useState<string>("Antioquia");
  const [city, setCity] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const { cities, loading: loadingCities } = useCities(department);
  const shippingCalculation = useShippingCalculator(department, city);

  // Notificar al padre cuando cambien los datos
  const handleChange = () => {
    if (department && city && address) {
      onShippingChange({
        address,
        department,
        city,
        notes,
        shippingCost: shippingCalculation.cost,
      });
    }
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setTimeout(handleChange, 100); // Esperar a que se calcule el costo
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm">
          Dirección Completa *
        </Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            handleChange();
          }}
          placeholder="Calle 123 #45-67, Apto 102, Torre 3"
          rows={2}
          className="text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm">
            Departamento *
          </Label>
          <Select value={department} disabled>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Antioquia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Antioquia">Antioquia</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Por ahora solo entregas en Antioquia
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm">
            Ciudad/Municipio *
          </Label>
          <Select
            value={city || ""}
            onValueChange={handleCityChange}
            disabled={!department || loadingCities}
          >
            <SelectTrigger className="text-sm">
              <SelectValue
                placeholder={
                  department
                    ? "Selecciona ciudad"
                    : "Primero selecciona departamento"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
              {cities.length === 0 && department && !loadingCities && (
                <SelectItem value="other" disabled>
                  No hay ciudades configuradas
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm">
          Notas de Entrega (Opcional)
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            handleChange();
          }}
          placeholder="Ej: Portería en el edificio, timbre 302, etc."
          rows={2}
          className="text-sm"
        />
      </div>

      {/* Shipping Cost Display */}
      {shippingCalculation.loading && (
        <Alert className="py-2 sm:py-3">
          <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
          <AlertDescription className="text-xs sm:text-sm">
            Calculando costo de envío...
          </AlertDescription>
        </Alert>
      )}

      {shippingCalculation.cost > 0 && !shippingCalculation.loading && (
        <div className="flex items-start sm:items-center gap-2 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-xs sm:text-sm">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            Costo de envío a{" "}
            <strong>
              {city}, {department}:
            </strong>{" "}
            <strong className="text-sm sm:text-base">
              ${new Intl.NumberFormat("es-CO").format(shippingCalculation.cost)}
            </strong>
          </span>
        </div>
      )}

      {shippingCalculation.error && (
        <Alert variant="destructive" className="py-2 sm:py-3">
          <AlertDescription className="text-xs sm:text-sm">
            {shippingCalculation.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
