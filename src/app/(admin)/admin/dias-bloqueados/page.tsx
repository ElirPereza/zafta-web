"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { format, isSameDay, startOfDay, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
  createdAt: string;
}

export default function BlockedDatesPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reason, setReason] = useState("");

  const fetchBlockedDates = useCallback(async () => {
    try {
      const response = await fetch("/api/blocked-dates");
      const data = await response.json();
      setBlockedDates(data.blockedDates || []);
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockedDates();
  }, [fetchBlockedDates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateRange?.from) return;

    setSaving(true);

    try {
      // Generate array of dates in range
      const dates: string[] = [];
      const startDate = startOfDay(dateRange.from);
      const endDate = dateRange.to ? startOfDay(dateRange.to) : startDate;

      const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
      for (const day of daysInRange) {
        dates.push(day.toISOString());
      }

      const response = await fetch("/api/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates, reason: reason || null }),
      });

      if (response.ok) {
        await fetchBlockedDates();
        setDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving blocked dates:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este día bloqueado?")) return;

    try {
      const response = await fetch(`/api/blocked-dates/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBlockedDates();
      }
    } catch (error) {
      console.error("Error deleting blocked date:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("¿Estás seguro de eliminar TODOS los días bloqueados?")) return;

    try {
      for (const blockedDate of blockedDates) {
        await fetch(`/api/blocked-dates/${blockedDate.id}`, {
          method: "DELETE",
        });
      }
      await fetchBlockedDates();
    } catch (error) {
      console.error("Error deleting all blocked dates:", error);
    }
  };

  const resetForm = () => {
    setDateRange(undefined);
    setReason("");
  };

  // Convert blocked dates to Date objects for calendar highlighting
  const blockedDateObjects = blockedDates.map((bd) => new Date(bd.date));

  // Group blocked dates by reason
  const groupedByReason = blockedDates.reduce(
    (acc, bd) => {
      const key = bd.reason || "Sin motivo";
      if (!acc[key]) acc[key] = [];
      acc[key].push(bd);
      return acc;
    },
    {} as Record<string, BlockedDate[]>,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[hsl(var(--rose-gold))]/30 border-t-[hsl(var(--rose-gold))] rounded-full animate-spin" />
          <p className="text-[hsl(var(--midnight-navy))]/70 font-sans">
            Cargando días bloqueados...
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
            Días Bloqueados
          </h1>
          <p className="text-[hsl(var(--midnight-navy))]/70 font-sans text-lg">
            Define los días en que no se realizan entregas (vacaciones, inventario, etc.)
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="gap-2 bg-[hsl(var(--rose-gold))] hover:bg-[hsl(var(--rose-gold))]/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-4 w-4" />
              Bloquear Días
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-gotham text-2xl text-[hsl(var(--midnight-navy))]">
                Bloquear Días
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 block">Selecciona fecha o rango de fechas</Label>
                <div className="flex justify-center border rounded-lg p-2 bg-white">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={es}
                    disabled={(date) => date < new Date()}
                    modifiers={{
                      blocked: blockedDateObjects,
                    }}
                    modifiersStyles={{
                      blocked: {
                        backgroundColor: "hsl(346, 98%, 25%)",
                        color: "white",
                      },
                    }}
                    className="rounded-md"
                  />
                </div>
                {dateRange?.from && (
                  <p className="text-sm text-[hsl(var(--midnight-navy))]/70 mt-2">
                    {dateRange.to
                      ? `${format(dateRange.from, "d 'de' MMMM", { locale: es })} - ${format(dateRange.to, "d 'de' MMMM 'de' yyyy", { locale: es })}`
                      : format(dateRange.from, "EEEE, d 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="reason">Motivo (opcional)</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Vacaciones de fin de año"
                />
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
                  disabled={!dateRange?.from || saving}
                  className="bg-[hsl(var(--rose-gold))] hover:bg-[hsl(var(--rose-gold))]/90 text-white"
                >
                  {saving ? "Guardando..." : "Bloquear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card className="border-[hsl(var(--beige-400))] border-2">
          <CardHeader>
            <CardTitle className="font-gotham text-lg text-[hsl(var(--midnight-navy))]">
              Vista de Calendario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              selected={blockedDateObjects}
              locale={es}
              numberOfMonths={1}
              disabled={(date) => {
                // Show blocked dates highlighted but not selectable
                return !blockedDateObjects.some((bd) => isSameDay(bd, date));
              }}
              modifiers={{
                blocked: blockedDateObjects,
              }}
              modifiersStyles={{
                blocked: {
                  backgroundColor: "hsl(346, 98%, 25%)",
                  color: "white",
                  fontWeight: "bold",
                },
              }}
              className="rounded-md mx-auto"
            />
            <div className="mt-4 flex items-center gap-2 text-sm text-[hsl(var(--midnight-navy))]/70">
              <div className="w-4 h-4 rounded bg-[hsl(346,98%,25%)]" />
              <span>Días bloqueados para entrega</span>
            </div>
          </CardContent>
        </Card>

        {/* List View */}
        <Card className="border-[hsl(var(--beige-400))] border-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-gotham text-lg text-[hsl(var(--midnight-navy))]">
              Lista de Días Bloqueados ({blockedDates.length})
            </CardTitle>
            {blockedDates.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar todos
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {blockedDates.length === 0 ? (
              <div className="text-center py-8">
                <CalendarOff className="h-12 w-12 text-[hsl(var(--midnight-navy))]/30 mx-auto mb-4" />
                <p className="text-[hsl(var(--midnight-navy))]/60 font-sans">
                  No hay días bloqueados
                </p>
                <p className="text-sm text-[hsl(var(--midnight-navy))]/40 font-sans">
                  Los clientes pueden seleccionar cualquier día hábil
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(groupedByReason).map(([reason, dates]) => (
                  <div key={reason} className="space-y-2">
                    <h4 className="font-semibold text-sm text-[hsl(var(--midnight-navy))] border-b pb-1">
                      {reason}
                    </h4>
                    <div className="space-y-1">
                      {dates
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() - new Date(b.date).getTime(),
                        )
                        .map((blockedDate) => (
                          <div
                            key={blockedDate.id}
                            className="flex items-center justify-between py-2 px-3 bg-[hsl(var(--beige-100))] rounded-lg"
                          >
                            <span className="font-sans text-sm text-[hsl(var(--midnight-navy))]">
                              {format(
                                new Date(blockedDate.date),
                                "EEEE, d 'de' MMMM 'de' yyyy",
                                { locale: es },
                              )}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(blockedDate.id)}
                              className="h-8 w-8 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="border-[hsl(var(--beige-400))] border bg-[hsl(var(--beige-100))]">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <CalendarOff className="h-5 w-5 text-[hsl(var(--midnight-navy))]/70 mt-0.5" />
            <div className="text-sm text-[hsl(var(--midnight-navy))]/80 font-sans">
              <p className="font-medium mb-1">Como funciona:</p>
              <ul className="list-disc list-inside space-y-1 text-[hsl(var(--midnight-navy))]/60">
                <li>Los días bloqueados no estarán disponibles para los clientes al seleccionar fecha de entrega</li>
                <li>Domingos y festivos colombianos ya están bloqueados automáticamente</li>
                <li>Usa esta herramienta para vacaciones, inventario u otros cierres temporales</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
