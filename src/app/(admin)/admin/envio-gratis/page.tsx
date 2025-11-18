"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Truck, Plus, Pencil, Trash2, DollarSign } from "lucide-react";

interface FreeShippingRule {
  id: string;
  name: string;
  type: "MINIMUM_PURCHASE" | "SPECIFIC_LOCATION" | "ALWAYS_FREE";
  minimumAmount: number | null;
  cities: string[];
  departments: string[];
  isActive: boolean;
  priority: number;
}

export default function FreeShippingPage() {
  const [rules, setRules] = useState<FreeShippingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FreeShippingRule | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "MINIMUM_PURCHASE" as FreeShippingRule["type"],
    minimumAmount: "",
    cities: "",
    departments: "",
    isActive: true,
    priority: "0",
  });

  const fetchRules = useCallback(async () => {
    try {
      const response = await fetch("/api/free-shipping");
      const data = await response.json();
      setRules(data.rules || []);
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const body = {
        name: formData.name,
        type: formData.type,
        minimumAmount:
          formData.type === "MINIMUM_PURCHASE" ? formData.minimumAmount : null,
        cities: formData.cities
          ? formData.cities.split(",").map((c) => c.trim())
          : [],
        departments: formData.departments
          ? formData.departments.split(",").map((d) => d.trim())
          : [],
        isActive: formData.isActive,
        priority: parseInt(formData.priority),
      };

      const url = editingRule
        ? `/api/free-shipping/${editingRule.id}`
        : "/api/free-shipping";

      const response = await fetch(url, {
        method: editingRule ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchRules();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving rule:", error);
    }
  };

  const handleEdit = (rule: FreeShippingRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      type: rule.type,
      minimumAmount: rule.minimumAmount?.toString() || "",
      cities: rule.cities.join(", "),
      departments: rule.departments.join(", "),
      isActive: rule.isActive,
      priority: rule.priority.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta regla?")) return;

    try {
      const response = await fetch(`/api/free-shipping/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRules();
      }
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "MINIMUM_PURCHASE",
      minimumAmount: "",
      cities: "",
      departments: "",
      isActive: true,
      priority: "0",
    });
    setEditingRule(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getRuleTypeLabel = (type: FreeShippingRule["type"]) => {
    const labels = {
      MINIMUM_PURCHASE: "Monto Mínimo",
      SPECIFIC_LOCATION: "Ubicación Específica",
      ALWAYS_FREE: "Siempre Gratis",
    };
    return labels[type];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[hsl(var(--rose-gold))]/30 border-t-[hsl(var(--rose-gold))] rounded-full animate-spin" />
          <p className="text-[hsl(var(--midnight-navy))]/70 font-sans">
            Cargando reglas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-gotham font-bold text-[hsl(var(--midnight-navy))] mb-2">
            Envío Gratis
          </h1>
          <p className="text-[hsl(var(--midnight-navy))]/70 font-sans text-lg">
            Configura las reglas de envío gratuito
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="gap-2 bg-[hsl(var(--rose-gold))] hover:bg-[hsl(var(--rose-gold))]/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-4 w-4" />
              Nueva Regla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-gotham text-2xl text-[hsl(var(--midnight-navy))]">
                {editingRule ? "Editar Regla" : "Nueva Regla de Envío Gratis"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Regla</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Envío gratis por compra mayor a $50.000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de Regla</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: FreeShippingRule["type"]) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MINIMUM_PURCHASE">
                      Monto Mínimo de Compra
                    </SelectItem>
                    <SelectItem value="SPECIFIC_LOCATION">
                      Ubicación Específica
                    </SelectItem>
                    <SelectItem value="ALWAYS_FREE">
                      Siempre Gratis
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "MINIMUM_PURCHASE" && (
                <div>
                  <Label htmlFor="minimumAmount">
                    Monto Mínimo (COP)
                  </Label>
                  <Input
                    id="minimumAmount"
                    type="number"
                    value={formData.minimumAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumAmount: e.target.value,
                      })
                    }
                    placeholder="50000"
                    required={formData.type === "MINIMUM_PURCHASE"}
                  />
                </div>
              )}

              {formData.type === "SPECIFIC_LOCATION" && (
                <>
                  <div>
                    <Label htmlFor="cities">
                      Ciudades (separadas por comas)
                    </Label>
                    <Input
                      id="cities"
                      value={formData.cities}
                      onChange={(e) =>
                        setFormData({ ...formData, cities: e.target.value })
                      }
                      placeholder="Bogotá, Medellín, Cali"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Dejar vacío para aplicar a todas las ciudades
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="departments">
                      Departamentos (separados por comas)
                    </Label>
                    <Input
                      id="departments"
                      value={formData.departments}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departments: e.target.value,
                        })
                      }
                      placeholder="Cundinamarca, Antioquia, Valle del Cauca"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Dejar vacío para aplicar a todos los departamentos
                    </p>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="priority">
                  Prioridad (mayor = más prioridad)
                </Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Regla activa</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[hsl(var(--rose-gold))] hover:bg-[hsl(var(--rose-gold))]/90 text-white"
                >
                  {editingRule ? "Guardar Cambios" : "Crear Regla"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      {rules.length === 0 ? (
        <Card className="border-2 border-dashed border-[hsl(var(--beige-400))]">
          <CardContent className="py-12 text-center">
            <Truck className="h-12 w-12 text-[hsl(var(--midnight-navy))]/50 mx-auto mb-4" />
            <h3 className="text-lg font-gotham font-semibold text-[hsl(var(--midnight-navy))] mb-2">
              No hay reglas de envío gratis
            </h3>
            <p className="text-sm text-[hsl(var(--midnight-navy))]/60 font-sans">
              Crea tu primera regla para ofrecer envío gratuito a tus clientes
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rules.map((rule) => (
            <Card
              key={rule.id}
              className="border-[hsl(var(--beige-400))] border-2"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="font-gotham text-lg text-[hsl(var(--midnight-navy))]">
                        {rule.name}
                      </CardTitle>
                      <Badge
                        variant={rule.isActive ? "default" : "secondary"}
                        className={`font-sans text-xs ${
                          rule.isActive
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {rule.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="font-sans text-xs bg-[hsl(var(--beige-100))] text-[hsl(var(--midnight-navy))] border-[hsl(var(--midnight-navy))]/30"
                      >
                        {getRuleTypeLabel(rule.type)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(rule)}
                      className="hover:bg-[hsl(var(--midnight-navy))]/20"
                    >
                      <Pencil className="h-4 w-4 text-[hsl(var(--midnight-navy))]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rule.id)}
                      className="hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm font-sans">
                  {rule.type === "MINIMUM_PURCHASE" && rule.minimumAmount && (
                    <div className="flex items-center gap-2 text-[hsl(var(--midnight-navy))]/70">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        Compra mínima:{" "}
                        <strong className="text-[hsl(var(--midnight-navy))]">
                          {formatPrice(Number(rule.minimumAmount))}
                        </strong>
                      </span>
                    </div>
                  )}

                  {rule.type === "SPECIFIC_LOCATION" && (
                    <>
                      {rule.cities.length > 0 && (
                        <div className="text-[hsl(var(--midnight-navy))]/70">
                          Ciudades:{" "}
                          <strong className="text-[hsl(var(--midnight-navy))]">
                            {rule.cities.join(", ")}
                          </strong>
                        </div>
                      )}
                      {rule.departments.length > 0 && (
                        <div className="text-[hsl(var(--midnight-navy))]/70">
                          Departamentos:{" "}
                          <strong className="text-[hsl(var(--midnight-navy))]">
                            {rule.departments.join(", ")}
                          </strong>
                        </div>
                      )}
                    </>
                  )}

                  <div className="text-[hsl(var(--midnight-navy))]/70">
                    Prioridad:{" "}
                    <strong className="text-[hsl(var(--midnight-navy))]">
                      {rule.priority}
                    </strong>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
