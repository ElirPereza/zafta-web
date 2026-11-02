// Configuración de zonas de envío para Colombia
// Los costos están en COP (Pesos Colombianos)
// Tarifario de destinos 2026-2027.
//
// OJO: las reglas de envío gratis (admin > Envío gratis) comparan por nombre
// de zona. Si renombras una zona, revisa también esas reglas.

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
      // Zona Palmas y El Poblado
      { name: "Alto de Palmas", cost: 20000 }, // No está en el tarifario 2026-2027; se mantiene
      { name: "Indiana (y un kilómetro a la redonda)", cost: 22000 },
      { name: "Palmas hasta la cola del zorro", cost: 14000 },
      {
        name: "Palmas de la cola del zorro hasta la bomba Texaco",
        cost: 18000,
      },
      { name: "Poblado superior hacia abajo", cost: 12000 },
      { name: "Poblado superior hacia arriba", cost: 13000 },
      // Medellín barrios
      // El tarifario trae "Medellín BB" ($15.000) y "Medellín BA" ($16.000);
      // se unifican en una sola zona con el precio más alto.
      { name: "Medellín", cost: 16000 },
      { name: "Robledo", cost: 16000 },
      { name: "Castilla", cost: 16000 },
      { name: "Manrique", cost: 16000 },
      { name: "Villa Hermosa", cost: 16000 },
      { name: "Aranjuez", cost: 16000 },
      { name: "Loreto", cost: 16000 },
      { name: "La Milagrosa", cost: 16000 },
      { name: "Buenos Aires", cost: 16000 },
      { name: "Rodeo Alto", cost: 16000 },
      { name: "Belén Las Violetas", cost: 16000 },
      { name: "Robledo La Colina", cost: 16000 },
      // Área metropolitana
      { name: "Envigado", cost: 15000 },
      { name: "Escobero", cost: 18000 },
      { name: "Sabaneta", cost: 16000 },
      { name: "Itagüí", cost: 17000 },
      { name: "La Estrella", cost: 19000 },
      { name: "San Antonio", cost: 20000 },
      { name: "Bello", cost: 21000 },
      { name: "Copacabana", cost: 25000 },
      { name: "Caldas", cost: 25000 },
      // Oriente y zonas alejadas
      { name: "Rotonda del aeropuerto JMC", cost: 40000 },
      { name: "Rionegro", cost: 60000 },
      { name: "El Retiro", cost: 45000 },
      { name: "Santa Elena", cost: 45000 },
      { name: "Llano Grande", cost: 48000 },
      { name: "La Ceja", cost: 48000 },
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
