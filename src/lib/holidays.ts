// Colombian holidays for delivery date validation
// Includes fixed holidays and movable holidays (Ley Emiliani)

// Fixed holidays that always fall on the same date
const FIXED_HOLIDAYS: { month: number; day: number }[] = [
  { month: 1, day: 1 }, // Año Nuevo
  { month: 5, day: 1 }, // Día del Trabajo
  { month: 7, day: 20 }, // Día de la Independencia
  { month: 8, day: 7 }, // Batalla de Boyacá
  { month: 12, day: 8 }, // Inmaculada Concepción
  { month: 12, day: 25 }, // Navidad
];

// Movable holidays for specific years (moved to next Monday - Ley Emiliani)
// These need to be updated yearly
const MOVABLE_HOLIDAYS: Record<number, string[]> = {
  2024: [
    "2024-01-08", // Reyes Magos (moved from Jan 6)
    "2024-03-25", // San José (moved from Mar 19)
    "2024-03-28", // Jueves Santo
    "2024-03-29", // Viernes Santo
    "2024-05-13", // Ascensión del Señor
    "2024-06-03", // Corpus Christi
    "2024-06-10", // Sagrado Corazón
    "2024-07-01", // San Pedro y San Pablo (moved from Jun 29)
    "2024-08-19", // Asunción de la Virgen (moved from Aug 15)
    "2024-10-14", // Día de la Raza (moved from Oct 12)
    "2024-11-04", // Todos los Santos (moved from Nov 1)
    "2024-11-11", // Independencia de Cartagena
  ],
  2025: [
    "2025-01-06", // Reyes Magos
    "2025-03-24", // San José (moved from Mar 19)
    "2025-04-17", // Jueves Santo
    "2025-04-18", // Viernes Santo
    "2025-06-02", // Ascensión del Señor
    "2025-06-23", // Corpus Christi
    "2025-06-30", // Sagrado Corazón
    "2025-06-30", // San Pedro y San Pablo (moved from Jun 29)
    "2025-08-18", // Asunción de la Virgen (moved from Aug 15)
    "2025-10-13", // Día de la Raza (moved from Oct 12)
    "2025-11-03", // Todos los Santos (moved from Nov 1)
    "2025-11-17", // Independencia de Cartagena (moved from Nov 11)
  ],
  2026: [
    "2026-01-12", // Reyes Magos (moved from Jan 6)
    "2026-03-23", // San José (moved from Mar 19)
    "2026-04-02", // Jueves Santo
    "2026-04-03", // Viernes Santo
    "2026-05-18", // Ascensión del Señor
    "2026-06-08", // Corpus Christi
    "2026-06-15", // Sagrado Corazón
    "2026-06-29", // San Pedro y San Pablo
    "2026-08-17", // Asunción de la Virgen (moved from Aug 15)
    "2026-10-12", // Día de la Raza
    "2026-11-02", // Todos los Santos (moved from Nov 1)
    "2026-11-16", // Independencia de Cartagena (moved from Nov 11)
  ],
};

/**
 * Check if a date is a Colombian holiday
 */
export function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Check fixed holidays
  for (const holiday of FIXED_HOLIDAYS) {
    if (holiday.month === month && holiday.day === day) {
      return true;
    }
  }

  // Check movable holidays
  const dateString = date.toISOString().split("T")[0];
  const yearHolidays = MOVABLE_HOLIDAYS[year] || [];

  return yearHolidays.includes(dateString);
}

/**
 * Check if a date is a Sunday
 */
export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

/**
 * Check if a date is valid for delivery (not Sunday, not holiday)
 */
export function isValidDeliveryDate(date: Date): boolean {
  return !isSunday(date) && !isHoliday(date);
}

/**
 * Get the minimum delivery date (at least 1 day from now, skipping invalid dates)
 */
export function getMinDeliveryDate(): Date {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1); // At least tomorrow
  minDate.setHours(0, 0, 0, 0);

  // Skip to next valid date if needed
  while (!isValidDeliveryDate(minDate)) {
    minDate.setDate(minDate.getDate() + 1);
  }

  return minDate;
}

/**
 * Get the maximum delivery date (30 days from now)
 */
export function getMaxDeliveryDate(): Date {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  maxDate.setHours(23, 59, 59, 999);
  return maxDate;
}
