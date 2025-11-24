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
 * Get the minimum delivery date based on current time and delivery rules
 * Rules:
 * - Pedido mañana (antes 12pm) → entrega mañana día siguiente
 * - Pedido tarde (después 12pm) → entrega tarde día siguiente
 * - Sábados solo hasta 12pm
 * - No entregas domingos ni festivos
 */
export function getMinDeliveryDate(): Date {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

  let minDate = new Date(now);
  minDate.setHours(0, 0, 0, 0);

  // Si es sábado después de las 12pm, saltar al lunes
  if (currentDay === 6 && currentHour >= 12) {
    // Sábado tarde → próximo lunes o siguiente día hábil
    minDate.setDate(minDate.getDate() + 2); // Saltar domingo
  } else if (currentDay === 0) {
    // Si es domingo, saltar al lunes
    minDate.setDate(minDate.getDate() + 1);
  } else {
    // Cualquier otro día → al menos mañana
    minDate.setDate(minDate.getDate() + 1);
  }

  // Skip to next valid date if needed (skip holidays and Sundays)
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

/**
 * Get info about when order can be delivered based on current time
 */
export function getDeliveryTimeInfo(): {
  canOrderToday: boolean;
  message: string;
  isSaturdayAfternoon: boolean;
} {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Domingo - no hay despachos
  if (currentDay === 0) {
    return {
      canOrderToday: false,
      message: "No realizamos despachos los domingos. Tu pedido se procesará el lunes.",
      isSaturdayAfternoon: false,
    };
  }

  // Sábado después de 12pm
  if (currentDay === 6 && currentHour >= 12) {
    return {
      canOrderToday: false,
      message: "Los sábados despachamos hasta las 12:00 p.m. Tu pedido se procesará el lunes.",
      isSaturdayAfternoon: true,
    };
  }

  // Pedido en la mañana (antes de 12pm)
  if (currentHour < 12) {
    return {
      canOrderToday: true,
      message: "Pedido realizado en la mañana - Entrega mañana en la mañana.",
      isSaturdayAfternoon: false,
    };
  }

  // Pedido en la tarde (después de 12pm)
  return {
    canOrderToday: true,
    message: "Pedido realizado en la tarde - Entrega mañana en la tarde.",
    isSaturdayAfternoon: false,
  };
}
