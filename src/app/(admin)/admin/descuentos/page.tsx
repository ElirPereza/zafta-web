"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Gift, ToggleLeft, ToggleRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface DiscountPopup {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  discountPercent: number;
  imageUrl: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DescuentosPage() {
  const [popups, setPopups] = useState<DiscountPopup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingPopup, setEditingPopup] = useState<DiscountPopup | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const response = await fetch("/api/discount-popup/all");
      const data = await response.json();

      if (response.ok) {
        setPopups(data.popups || []);
      } else {
        toast.error("Error al cargar los popups");
      }
    } catch (error) {
      toast.error("Error al cargar los popups");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDiscountCode("");
    setDiscountPercent("");
    setImageUrl("");
    setIsActive(false);
    setStartDate("");
    setEndDate("");
    setEditingPopup(null);
  };

  const handleOpenDialog = (popup?: DiscountPopup) => {
    if (popup) {
      setEditingPopup(popup);
      setTitle(popup.title);
      setDescription(popup.description);
      setDiscountCode(popup.discountCode);
      setDiscountPercent(popup.discountPercent.toString());
      setImageUrl(popup.imageUrl || "");
      setIsActive(popup.isActive);
      setStartDate(
        popup.startDate
          ? new Date(popup.startDate).toISOString().split("T")[0]
          : "",
      );
      setEndDate(
        popup.endDate
          ? new Date(popup.endDate).toISOString().split("T")[0]
          : "",
      );
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !discountCode ||
      !discountPercent ||
      Number.parseInt(discountPercent) <= 0
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setSubmitting(true);

    try {
      const url = editingPopup
        ? `/api/discount-popup/${editingPopup.id}`
        : "/api/discount-popup";
      const method = editingPopup ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          discountCode,
          discountPercent: Number.parseInt(discountPercent),
          imageUrl: imageUrl || null,
          isActive,
          startDate: startDate || null,
          endDate: endDate || null,
        }),
      });

      if (response.ok) {
        toast.success(
          editingPopup
            ? "Popup actualizado correctamente"
            : "Popup creado correctamente",
        );
        setIsDialogOpen(false);
        resetForm();
        fetchPopups();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar el popup");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el popup");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (popup: DiscountPopup) => {
    try {
      const response = await fetch(`/api/discount-popup/${popup.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !popup.isActive,
        }),
      });

      if (response.ok) {
        toast.success(
          popup.isActive
            ? "Popup desactivado correctamente"
            : "Popup activado correctamente",
        );
        fetchPopups();
      } else {
        toast.error("Error al cambiar el estado del popup");
      }
    } catch (error) {
      toast.error("Error al cambiar el estado del popup");
    }
  };

  const handleDelete = async (popup: DiscountPopup) => {
    if (!confirm("¿Estás seguro de eliminar este popup de descuento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/discount-popup/${popup.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Popup eliminado correctamente");
        fetchPopups();
      } else {
        toast.error("Error al eliminar el popup");
      }
    } catch (error) {
      toast.error("Error al eliminar el popup");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Gestión de Popups de Descuento
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Crea y gestiona los popups de descuento que aparecerán en el sitio
            web
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              Nuevo Popup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPopup ? "Editar Popup" : "Crear Nuevo Popup"}
              </DialogTitle>
              <DialogDescription>
                Configura el popup de descuento que aparecerá a los usuarios
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="¡Descuento especial!"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Obtén un 15% de descuento en tu primera compra..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountCode">Código de descuento *</Label>
                  <Input
                    id="discountCode"
                    value={discountCode}
                    onChange={(e) =>
                      setDiscountCode(e.target.value.toUpperCase())
                    }
                    placeholder="PRIMERA15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPercent">
                    Porcentaje de descuento *
                  </Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="15"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de imagen (opcional)</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de inicio (opcional)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de fin (opcional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Activar popup (solo uno puede estar activo)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting
                  ? "Guardando..."
                  : editingPopup
                    ? "Actualizar"
                    : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando popups...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && popups.length === 0 && (
        <Card className="border-[hsl(var(--beige-400))]">
          <CardContent className="text-center py-12">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-sans">
              No hay popups de descuento creados
            </p>
          </CardContent>
        </Card>
      )}

      {/* Popups List */}
      {!loading && popups.length > 0 && (
        <div className="grid gap-4">
          {popups.map((popup) => (
            <Card
              key={popup.id}
              className="border-[hsl(var(--beige-400))] relative"
            >
              {popup.isActive && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Activo
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-sans flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5" />
                      {popup.title}
                    </div>
                    <CardDescription className="font-sans text-sm">
                      Código:{" "}
                      <span className="font-bold">{popup.discountCode}</span> -{" "}
                      {popup.discountPercent}% de descuento
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {popup.description}
                </p>
                {(popup.startDate || popup.endDate) && (
                  <div className="text-xs text-muted-foreground mb-4">
                    {popup.startDate && (
                      <span>
                        Desde:{" "}
                        {new Date(popup.startDate).toLocaleDateString("es-CO")}
                      </span>
                    )}
                    {popup.startDate && popup.endDate && <span> - </span>}
                    {popup.endDate && (
                      <span>
                        Hasta:{" "}
                        {new Date(popup.endDate).toLocaleDateString("es-CO")}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(popup)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant={popup.isActive ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleToggleActive(popup)}
                    className="gap-2"
                  >
                    {popup.isActive ? (
                      <>
                        <ToggleLeft className="h-4 w-4" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <ToggleRight className="h-4 w-4" />
                        Activar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(popup)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
