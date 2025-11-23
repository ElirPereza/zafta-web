"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  isValidDeliveryDate,
  getMinDeliveryDate,
  getMaxDeliveryDate,
} from "@/lib/holidays";

interface DeliveryDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  error?: string;
}

export function DeliveryDatePicker({
  value,
  onChange,
  error,
}: DeliveryDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());

  useEffect(() => {
    setMinDate(getMinDeliveryDate());
    setMaxDate(getMaxDeliveryDate());
  }, []);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  // Disable invalid dates (Sundays and holidays)
  const disabledDays = (date: Date) => {
    // Before minimum date
    if (date < minDate) return true;
    // After maximum date
    if (date > maxDate) return true;
    // Invalid delivery date (Sunday or holiday)
    if (!isValidDeliveryDate(date)) return true;
    return false;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="delivery-date" className="text-sm font-medium">
        Fecha de entrega <span className="text-red-500">*</span>
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="delivery-date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={disabledDays}
            initialFocus
            locale={es}
            fromDate={minDate}
            toDate={maxDate}
          />
          <div className="p-3 border-t text-xs text-muted-foreground">
            <p>No realizamos entregas los domingos ni días festivos.</p>
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
