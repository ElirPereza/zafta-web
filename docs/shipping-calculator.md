# Sistema de Cálculo Automático de Envío

Este documento explica cómo funciona el sistema de cálculo automático de costos de envío basado en la ubicación del cliente.

## 📦 Características

- ✅ Cálculo automático de costo de envío según departamento y ciudad
- ✅ Zonas de envío configurables
- ✅ Actualización en tiempo real del total
- ✅ Lista de departamentos y ciudades de Colombia
- ✅ Manejo de ubicaciones no configuradas con costos por defecto

## 🗺️ Zonas Configuradas

El sistema actualmente soporta envíos a las siguientes zonas:

### Cundinamarca
- **Bogotá:** $8,000
- **Soacha:** $10,000
- **Chía:** $12,000
- **Zipaquirá:** $15,000
- **Facatativá:** $15,000
- **Mosquera:** $10,000
- **Funza:** $10,000
- **Madrid:** $12,000
- **Otras ciudades:** $15,000

### Antioquia
- **Medellín:** $25,000
- **Envigado:** $25,000
- **Bello:** $25,000
- **Itagüí:** $25,000
- **Sabaneta:** $25,000
- **La Estrella:** $27,000
- **Rionegro:** $30,000
- **Otras ciudades:** $30,000

### Valle del Cauca
- **Cali:** $28,000
- **Palmira:** $30,000
- **Jamundí:** $30,000
- **Yumbo:** $30,000
- **Otras ciudades:** $32,000

### Atlántico
- **Barranquilla:** $30,000
- **Soledad:** $30,000
- **Malambo:** $32,000
- **Otras ciudades:** $35,000

### Bolívar
- **Cartagena:** $32,000
- **Otras ciudades:** $35,000

### Santander
- **Bucaramanga:** $25,000
- **Floridablanca:** $25,000
- **Girón:** $27,000
- **Piedecuesta:** $27,000
- **Otras ciudades:** $30,000

**Departamentos no configurados:** $40,000

## 🔧 Cómo Usar

### En el Checkout

```tsx
import { ShippingForm } from "@/components/checkout/ShippingForm";

function CheckoutPage() {
  const [shippingData, setShippingData] = useState(null);

  const handleShippingChange = (data) => {
    setShippingData(data);
    // Actualizar el total del pedido
    const newTotal = subtotal + data.shippingCost;
    setTotal(newTotal);
  };

  return (
    <div>
      <ShippingForm onShippingChange={handleShippingChange} />

      {/* Resumen del pedido */}
      <div>
        <p>Subtotal: ${subtotal}</p>
        {shippingData && (
          <p>Envío: ${shippingData.shippingCost}</p>
        )}
        <p>Total: ${total}</p>
      </div>
    </div>
  );
}
```

### Hooks Disponibles

#### `useShippingCalculator(department, city)`
Calcula el costo de envío basado en departamento y ciudad.

```tsx
import { useShippingCalculator } from "@/hooks/useShippingCalculator";

const calculation = useShippingCalculator("Cundinamarca", "Bogotá");

// calculation.cost → 8000
// calculation.formattedCost → "$8,000"
// calculation.loading → false
// calculation.error → null
```

#### `useDepartments()`
Obtiene la lista de departamentos disponibles.

```tsx
import { useDepartments } from "@/hooks/useShippingCalculator";

const { departments, loading } = useDepartments();
// departments → ["Antioquia", "Atlántico", "Bolívar", ...]
```

#### `useCities(department)`
Obtiene las ciudades de un departamento específico.

```tsx
import { useCities } from "@/hooks/useShippingCalculator";

const { cities, loading } = useCities("Cundinamarca");
// cities → ["Bogotá", "Soacha", "Chía", ...]
```

## 🌐 API Endpoints

### POST `/api/shipping/calculate`
Calcula el costo de envío.

**Request:**
```json
{
  "department": "Cundinamarca",
  "city": "Bogotá"
}
```

**Response:**
```json
{
  "department": "Cundinamarca",
  "city": "Bogotá",
  "cost": 8000,
  "formattedCost": "$8,000"
}
```

### GET `/api/shipping/calculate`
Obtiene departamentos disponibles.

**Response:**
```json
{
  "departments": ["Antioquia", "Atlántico", ...]
}
```

### GET `/api/shipping/calculate?department=Cundinamarca`
Obtiene ciudades de un departamento.

**Response:**
```json
{
  "cities": ["Bogotá", "Soacha", "Chía", ...]
}
```

## ⚙️ Configuración de Zonas

Para agregar o modificar zonas de envío, edita el archivo:
```
src/lib/shipping/zones.ts
```

### Agregar una Nueva Zona

```typescript
export const SHIPPING_ZONES: ShippingZone[] = [
  // ... zonas existentes
  {
    department: "Nuevo Departamento",
    cities: [
      { name: "Ciudad 1", cost: 20000 },
      { name: "Ciudad 2", cost: 25000 },
    ],
    defaultCost: 30000, // Para ciudades no listadas
  },
];
```

### Actualizar Costos

Simplemente modifica el valor `cost` de la ciudad correspondiente:

```typescript
{ name: "Bogotá", cost: 10000 }, // Cambiado de 8000 a 10000
```

## 🔒 Almacenamiento en Order

Cuando se crea un pedido, la dirección de envío se guarda en el campo `shippingAddress` como JSON:

```json
{
  "address": "Calle 123 #45-67, Apto 102",
  "department": "Cundinamarca",
  "city": "Bogotá",
  "notes": "Portería en el edificio"
}
```

El costo calculado se almacena en el campo `shippingCost` del pedido.

## 📝 Notas Importantes

1. **Normalización de strings:** El sistema normaliza automáticamente los nombres eliminando acentos y convirtiendo a minúsculas para evitar errores de matching.

2. **Ciudades no configuradas:** Si una ciudad no está en la lista, se usa el `defaultCost` del departamento.

3. **Departamentos no configurados:** Si un departamento no está en la lista, se usa un costo por defecto de $40,000.

4. **Actualización automática:** El costo se recalcula automáticamente cada vez que el usuario cambia el departamento o ciudad.

5. **Validación:** El formulario requiere que se seleccione tanto departamento como ciudad para calcular el costo.

## 🚀 Próximas Mejoras

- [ ] Panel de administración para gestionar zonas de envío
- [ ] Integración con API de Google Maps para cálculo por distancia
- [ ] Rangos de peso para productos pesados
- [ ] Promociones de envío gratis por monto mínimo
- [ ] Zonas con múltiples rangos de precios
- [ ] Envío express con costo adicional
