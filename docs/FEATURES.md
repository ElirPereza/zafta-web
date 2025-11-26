# Zafta - Features & Integración Alegra

## Features Implementadas

### E-commerce
| Feature | Estado | Descripción |
|---------|--------|-------------|
| Catálogo de productos | ✅ | Grid con filtros, variantes de tamaño, precios dinámicos |
| Carrito de compras | ✅ | Persistencia con Zustand, gestión de cantidades |
| Checkout | ✅ | Flujo completo con datos de envío y pago |
| Pagos Wompi | ✅ | Integración pasarela de pagos Colombia |
| Cálculo de envío | ✅ | Por ciudad/departamento, reglas de envío gratis |
| Códigos de descuento | ✅ | Descuentos porcentuales por código |
| Confirmación de pedido | ✅ | Página post-compra con resumen |

### Panel de Administración
| Feature | Estado | Descripción |
|---------|--------|-------------|
| Dashboard | ✅ | Stats de productos, pedidos, ingresos |
| CRUD Productos | ✅ | Crear, editar, eliminar, reordenar (drag & drop) |
| Gestión de pedidos | ✅ | Ver, cambiar estado, detalles |
| Galería de imágenes | ✅ | Subida a Supabase Storage |
| Gestión de facturas | ✅ | Listado y visualización |
| Popup de descuentos | ✅ | Configurar popups promocionales |
| Reglas de envío gratis | ✅ | Por monto mínimo, ubicación o siempre gratis |

### Autenticación
| Feature | Estado | Descripción |
|---------|--------|-------------|
| Login/Registro | ✅ | Clerk integration |
| Roles | ✅ | SUPER_ADMIN, ADMIN, CUSTOMER |
| Protección de rutas | ✅ | Middleware con verificación de rol |

---

## Integración con Alegra (Facturación Electrónica)

### ¿Qué es Alegra?
Sistema de facturación electrónica autorizado por la DIAN para Colombia. Permite emitir facturas electrónicas válidas legalmente.

### Modelo de Datos Actual (Invoice)
```prisma
model Invoice {
  id              String
  invoiceNumber   String   @unique
  orderId         String   @unique
  userId          String
  customerName    String
  customerEmail   String
  customerPhone   String
  customerAddress Json
  taxId           String?       // NIT/CC del cliente
  companyName     String?       // Razón social (si aplica)
  items           Json
  subtotal        Decimal
  tax             Decimal       // IVA
  shippingCost    Decimal
  total           Decimal
  issuedAt        DateTime
  dueDate         DateTime?
  paidAt          DateTime?
  pdfUrl          String?       // URL del PDF generado
}
```

### Campos a Agregar para Alegra
```prisma
// Agregar al modelo Invoice
alegraId          String?   @unique  // ID de factura en Alegra
alegraNumber      String?            // Número DIAN
cufePdf           String?            // CUFE (código único factura electrónica)
alegraStatus      String?            // PENDING, SENT, APPROVED, REJECTED
alegraXmlUrl      String?            // URL del XML DIAN
dianResponse      Json?              // Respuesta completa de la DIAN
```

### Endpoints API Requeridos

#### 1. Crear Factura en Alegra
```
POST /api/alegra/invoices
```
- Toma datos del pedido confirmado
- Crea contacto en Alegra (si no existe)
- Genera factura electrónica
- Guarda respuesta DIAN

#### 2. Consultar Estado
```
GET /api/alegra/invoices/[id]/status
```
- Verifica estado en DIAN
- Actualiza status local

#### 3. Descargar PDF/XML
```
GET /api/alegra/invoices/[id]/download?type=pdf|xml
```
- Obtiene documentos de Alegra

#### 4. Webhook de Alegra
```
POST /api/webhooks/alegra
```
- Recibe notificaciones de cambio de estado

### Flujo de Integración

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Pedido Pagado  │────▶│  Crear Factura  │────▶│  Enviar Alegra  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Guardar CUFE   │◀────│  Respuesta DIAN │◀────│  Alegra API     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│  Email Cliente  │
│  (PDF adjunto)  │
└─────────────────┘
```

### Variables de Entorno Requeridas
```env
ALEGRA_EMAIL=tu-email@empresa.com
ALEGRA_TOKEN=tu-api-token
ALEGRA_COMPANY_ID=tu-company-id
ALEGRA_ENVIRONMENT=sandbox|production
```

### Estructura de Archivos Sugerida
```
src/
├── lib/
│   └── alegra/
│       ├── client.ts        # Cliente API Alegra
│       ├── types.ts         # Tipos TypeScript
│       └── utils.ts         # Helpers
├── app/
│   └── api/
│       └── alegra/
│           ├── invoices/
│           │   ├── route.ts         # POST crear factura
│           │   └── [id]/
│           │       ├── route.ts     # GET factura
│           │       └── status/
│           │           └── route.ts # GET estado DIAN
│           └── contacts/
│               └── route.ts         # CRUD contactos
```

### Datos del Cliente para Factura Electrónica

Campos requeridos por DIAN:
- **Tipo documento:** CC, NIT, CE, Pasaporte
- **Número documento:** Número de identificación
- **Nombre/Razón social:** Nombre completo o empresa
- **Email:** Para envío de factura
- **Dirección:** Dirección completa
- **Ciudad/Departamento:** Código DANE
- **Teléfono:** Contacto

### Consideraciones Importantes

1. **Ambiente de pruebas:** Alegra tiene sandbox para desarrollo
2. **Numeración DIAN:** Requiere resolución de facturación
3. **Tiempos:** DIAN puede tardar hasta 24h en aprobar
4. **Notas crédito:** Implementar para devoluciones
5. **Retenciones:** IVA, ICA si aplica

---

## Próximos Pasos

### Prioridad Alta
1. [ ] Configurar cuenta Alegra
2. [ ] Obtener resolución DIAN
3. [ ] Implementar cliente API Alegra
4. [ ] Agregar campos formulario checkout (tipo/número documento)
5. [ ] Crear endpoint creación de factura

### Prioridad Media
6. [ ] Webhook para estados DIAN
7. [ ] Envío automático email con PDF
8. [ ] Vista de factura en admin con estado DIAN

### Prioridad Baja
9. [ ] Notas crédito
10. [ ] Reportes contables
11. [ ] Exportación para contador
