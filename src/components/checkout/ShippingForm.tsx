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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import {
  useDepartments,
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
  const [department, setDepartment] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const { departments, loading: loadingDepartments } = useDepartments();
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

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setCity(null); // Reset city when department changes
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
          <Select
            value={department || ""}
            onValueChange={handleDepartmentChange}
            disabled={loadingDepartments}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad/Municipio *</Label>
          <Select
            value={city || ""}
            onValueChange={handleCityChange}
            disabled={!department || loadingCities}
          >
            <SelectTrigger>
              <SelectValue placeholder={department ? "Selecciona ciudad" : "Primero selecciona departamento"} />
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
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Calculando costo de envío...</AlertDescription>
        </Alert>
      )}

      {shippingCalculation.cost > 0 && !shippingCalculation.loading && (
        <Alert className="bg-green-50 border-green-200">
          <MapPin className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <span className="font-semibold">Costo de envío a {city}, {department}:</span>{" "}
            <span className="text-lg font-bold">{shippingCalculation.formattedCost}</span>
          </AlertDescription>
        </Alert>
      )}

      {shippingCalculation.error && (
        <Alert variant="destructive">
          <AlertDescription>{shippingCalculation.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
