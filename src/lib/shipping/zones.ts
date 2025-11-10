// Configuración de zonas de envío para Colombia
// Los costos están en COP (Pesos Colombianos)

export interface ShippingZone {
  department: string;
  cities: {
    name: string;
    cost: number;
  }[];
  defaultCost: number; // Costo para ciudades no listadas en ese departamento
}

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    department: "Antioquia",
    cities: [
      { name: "Medellín", cost: 10000 }, // Dentro de la ciudad
      { name: "Envigado", cost: 12000 }, // Área metropolitana cercana
      { name: "Bello", cost: 12000 }, // Área metropolitana cercana
      { name: "Itagüí", cost: 12000 }, // Área metropolitana cercana
      { name: "Sabaneta", cost: 12000 }, // Área metropolitana cercana
      { name: "La Estrella", cost: 15000 }, // Un poco más lejos
      { name: "Caldas", cost: 15000 }, // Un poco más lejos
      { name: "Copacabana", cost: 15000 }, // Un poco más lejos
      { name: "Girardota", cost: 18000 }, // Más lejos
      { name: "Barbosa", cost: 20000 }, // Más lejos
      { name: "Rionegro", cost: 20000 }, // Oriente cercano
      { name: "Marinilla", cost: 25000 }, // Oriente
      { name: "El Retiro", cost: 25000 }, // Oriente
      { name: "Guarne", cost: 25000 }, // Oriente
    ],
    defaultCost: 30000, // Otras ciudades de Antioquia
  },
];

export interface ShippingCalculation {
  department: string;
  city: string;
  cost: number;
  zone: ShippingZone | null;
}

/**
 * Calcula el costo de envío basado en el departamento y ciudad
 */
export function calculateShippingCost(
  department: string,
  city: string,
): ShippingCalculation {
  // Normalizar strings (quitar acentos, mayúsculas, espacios extra)
  const normalizedDepartment = normalizeString(department);
  const normalizedCity = normalizeString(city);

  // Buscar la zona que corresponde al departamento
  const zone = SHIPPING_ZONES.find(
    (z) => normalizeString(z.department) === normalizedDepartment,
  );

  if (!zone) {
    // Departamento no encontrado, usar costo por defecto alto
    return {
      department,
      city,
      cost: 40000, // Costo para zonas no configuradas
      zone: null,
    };
  }

  // Buscar la ciudad específica dentro de la zona
  const cityConfig = zone.cities.find(
    (c) => normalizeString(c.name) === normalizedCity,
  );

  const cost = cityConfig ? cityConfig.cost : zone.defaultCost;

  return {
    department,
    city,
    cost,
    zone,
  };
}

/**
 * Normaliza un string para comparación (sin acentos, minúsculas, sin espacios extra)
 */
function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " "); // Normalizar espacios
}

/**
 * Obtiene la lista de departamentos disponibles
 */
export function getDepartments(): string[] {
  return SHIPPING_ZONES.map((zone) => zone.department).sort();
}

/**
 * Obtiene la lista de ciudades para un departamento específico
 */
export function getCitiesForDepartment(department: string): string[] {
  const normalizedDepartment = normalizeString(department);
  const zone = SHIPPING_ZONES.find(
    (z) => normalizeString(z.department) === normalizedDepartment,
  );

  if (!zone) {
    return [];
  }

  return zone.cities.map((city) => city.name).sort();
}

/**
 * Verifica si hay envío disponible para una ubicación
 */
export function isShippingAvailable(department: string, city: string): boolean {
  const calculation = calculateShippingCost(department, city);
  return calculation.cost > 0;
}
