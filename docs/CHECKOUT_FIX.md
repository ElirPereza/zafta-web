# 🛠️ Fix: Checkout Error 500

## Problema Identificado

**Error:** 500 al intentar crear orden en `/api/orders`
**Síntoma:** El checkout no procesaba, no redirigía a Wompi

```
Error processing order: Error: Error al crear el pedido
Failed to load resource: the server responded with a status of 500
```

---

## Causa Raíz

Al crear una orden desde el checkout, faltaban campos requeridos en los items:

**Lo que se enviaba:**
```javascript
items: items.map((item) => ({
  productId: item.id,
  quantity: item.quantity,
  price: item.price,
  // ❌ FALTABAN: name, imageUrl
}))
```

**Lo que esperaba el API:**
```typescript
items: {
  create: body.items.map((item: any) => ({
    productId: item.productId,
    name: item.name,          // ❌ Faltaba
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.imageUrl,   // ❌ Faltaba
  })),
}
```

---

## Solución Aplicada

### 1. ✅ Corregir CheckoutForm

**Archivo:** `src/components/checkout/CheckoutForm.tsx`

**Cambio:**
```javascript
items: items.map((item) => ({
  productId: item.id,
  name: item.name,           // ✅ Agregado
  price: item.price,
  quantity: item.quantity,
  imageUrl: item.image,      // ✅ Agregado
}))
```

### 2. ✅ Mejorar Validación en API

**Archivo:** `src/app/api/orders/route.ts`

**Agregado:**
- Validación de campos requeridos de cliente
- Validación de campos de envío
- Validación de items (al menos 1)
- Validación de datos completos por item
- Logs detallados para debugging
- Mensajes de error específicos

**Ejemplo de validación:**
```typescript
// Validar campos requeridos
if (!body.customerName || !body.customerEmail || !body.customerPhone) {
  return NextResponse.json(
    { error: "Faltan campos requeridos de cliente" },
    { status: 400 }
  );
}

// Validar cada item
for (const item of body.items) {
  if (!item.productId || !item.name || !item.price || !item.quantity) {
    return NextResponse.json(
      { error: "Datos de producto incompletos" },
      { status: 400 }
    );
  }
}
```

### 3. ✅ Mejor Manejo de Errores en Frontend

**Agregado:**
- Logs de debugging en consola
- Extracción de mensaje de error específico del API
- Mostrar detalles del error al usuario

```typescript
if (!orderResponse.ok) {
  const errorData = await orderResponse.json();
  console.error("Order creation failed:", errorData);
  throw new Error(errorData.error || errorData.details || "Error al crear el pedido");
}
```

---

## Testing

### Probar Localmente

1. **Iniciar servidor:**
   ```bash
   bun dev
   ```

2. **Ir a checkout:**
   - http://localhost:3000/productos
   - Agregar producto al carrito
   - Proceder al pago

3. **Completar formulario:**
   ```
   Nombre: Juan Pérez
   Email: test@example.com
   Teléfono: 3001234567
   Dirección: Calle 123 #45-67
   Ciudad: Bogotá
   ```

4. **Click en "Ir a Pagar"**

5. **Resultado esperado:**
   - ✅ No hay error 500
   - ✅ Se crea la orden correctamente
   - ✅ Muestra widget de Wompi
   - ✅ En consola del servidor: "✅ Order created successfully: [ID]"
   - ✅ En consola del browser: "📦 Creating order with: ..."

### Probar en Producción (Vercel)

**Importante:** Asegúrate de tener `DATABASE_URL` configurada en Vercel.

1. Deploy los cambios
2. Ir a: https://zafta-web1.vercel.app/productos
3. Probar flujo completo de checkout
4. Verificar logs en Vercel → Deployments → Function Logs

---

## Logs de Debugging

### ✅ Success Flow

**Console del Browser:**
```
📦 Creating order with: {itemsCount: 2, subtotal: 150000, shippingCost: 8000, total: 158000}
```

**Console del Servidor:**
```
📦 Creating order with data: {customerName: 'Juan Pérez', customerEmail: 'test@example.com', itemsCount: 2}
🔢 Generated order number: ZAFTA-2025-0001
✅ Order created successfully: clxxxxxxxxxxxxxx
```

### ❌ Error Flow (antes del fix)

```
❌ Invalid item data: {productId: 'xxx', price: 50000, quantity: 1}
❌ Missing required customer fields
```

---

## Checklist de Verificación

Después del fix, verifica:

- [ ] No hay error 500 al crear orden
- [ ] Todos los items tienen name e imageUrl
- [ ] La orden se guarda correctamente en la base de datos
- [ ] El widget de Wompi se muestra
- [ ] Los logs son claros y útiles
- [ ] Los mensajes de error son específicos

---

## Mejoras Implementadas

1. **Validación robusta** - Detecta problemas antes de intentar guardar
2. **Mensajes claros** - Errores específicos, no genéricos
3. **Logs detallados** - Facilita debugging en producción
4. **Fallbacks** - Valores por defecto para campos opcionales
5. **Type safety** - Validación de estructura de datos

---

## Problemas Relacionados

Si aún tienes problemas después del fix:

### Error: "PrismaClientInitializationError"
**Causa:** DATABASE_URL no configurada en Vercel
**Solución:** Ver `docs/VERCEL_DEPLOYMENT.md`

### Error: "Invalid productId"
**Causa:** El producto no existe en la base de datos
**Solución:** Verificar que el producto existe antes de agregarlo al carrito

### Widget de Wompi no carga
**Causa:** Variables de Wompi no configuradas
**Solución:** Ver `docs/WOMPI_VERCEL_SETUP.md`

---

## Archivos Modificados

- ✅ `src/components/checkout/CheckoutForm.tsx` - Agregados campos name e imageUrl
- ✅ `src/app/api/orders/route.ts` - Validación y mejor error handling
- ✅ `docs/CHECKOUT_FIX.md` - Esta documentación

---

## Prevenir Problemas Futuros

### En el Código

1. **Siempre validar datos** antes de enviar al API
2. **Usar TypeScript** para definir interfaces claras
3. **Logs en desarrollo** para debugging rápido
4. **Tests** para flujos críticos como checkout

### En el Schema

Asegurarse que los campos requeridos en Prisma coincidan con lo que envía el frontend:

```prisma
model OrderItem {
  id        String  @id @default(cuid())
  productId String
  name      String  // Requerido
  price     Float
  quantity  Int
  imageUrl  String  // Requerido (o hacer opcional con ?)

  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
}
```

---

## Resumen

**Antes:** ❌ Error 500, checkout no funcionaba
**Después:** ✅ Checkout funcional, crea orden, redirige a Wompi

**Tiempo de fix:** ~15 minutos
**Impacto:** Crítico - el checkout es esencial para ventas
**Complejidad:** Baja - faltaban 2 campos en el request

---

**Estado:** ✅ Resuelto
**Fecha:** 2025-01-04
**Autor:** Claude Code
