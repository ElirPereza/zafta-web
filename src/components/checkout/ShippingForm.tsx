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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Dirección Completa *</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            handleChange();
          }}
          placeholder="Calle 123 #45-67, Apto 102, Torre 3"
          rows={2}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Departamento *</Label>
          <Select value={department} disabled>
            <SelectTrigger>
              <SelectValue placeholder="Antioquia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Antioquia">Antioquia</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Por ahora solo entregas en Antioquia
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad/Municipio *</Label>
          <Select
            value={city || ""}
            onValueChange={handleCityChange}
            disabled={!department || loadingCities}
          >
            <SelectTrigger>
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
        <Label htmlFor="notes">Notas de Entrega (Opcional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            handleChange();
          }}
          placeholder="Ej: Portería en el edificio, timbre 302, etc."
          rows={2}
        />
      </div>

      {/* Shipping Cost Display */}
      {shippingCalculation.loading && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 shrink-0" />
          <p className="text-sm font-sans text-blue-900">
            Calculando costo de envío...
          </p>
        </div>
      )}

      {shippingCalculation.cost > 0 && !shippingCalculation.loading && (
        <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-sans font-semibold text-green-900">
                  Costo de envío a {city}, {department}:
                </p>
                <p className="text-2xl font-bold text-green-700 font-sans">
                  {shippingCalculation.formattedCost}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {shippingCalculation.error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm font-sans text-red-900">
            {shippingCalculation.error}
          </div>
        </div>
      )}
    </div>
  );
}
