# ⚠️ MIGRACIÓN DE BASE DE DATOS REQUERIDA PARA PRODUCCIÓN

## 🚨 IMPORTANTE

Antes de que el checkout funcione en producción (Vercel), **DEBES ejecutar las migraciones SQL en tu base de datos de producción en Supabase**.

---

## 🎯 Qué Paso

La base de datos estaba desactualizada con el código. El schema de Prisma usa nombres de columnas diferentes a los que existían en la base de datos:

**Schema (código):**
- `customerName`, `customerEmail`, `customerPhone`
- `shippingAddress` (TEXT)
- `shippingCity`, `shippingDepartment`
- `userId` (opcional/nullable)

**Base de datos (antes):**
- `userName`, `userEmail`, `userPhone`
- `shippingAddress` (JSONB)
- Faltaban varias columnas
- `userId` (NOT NULL)

---

## 🔧 Solución Aplicada en Local

Se ejecutaron manualmente estas migraciones SQL en Supabase (desarrollo):

```sql
-- 1. Renombrar columnas viejas
ALTER TABLE "Order" RENAME COLUMN "userName" TO "customerName";
ALTER TABLE "Order" RENAME COLUMN "userEmail" TO "customerEmail";
ALTER TABLE "Order" RENAME COLUMN "userPhone" TO "customerPhone";

-- 2. Agregar columnas faltantes
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "shippingCity" TEXT NOT NULL DEFAULT 'Bogotá',
ADD COLUMN IF NOT EXISTS "shippingDepartment" TEXT NOT NULL DEFAULT 'Cundinamarca',
ADD COLUMN IF NOT EXISTS "deliveryNotes" TEXT,
ADD COLUMN IF NOT EXISTS "paymentTransactionId" TEXT;

-- 3. Convertir shippingAddress de jsonb a text
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingAddress";
ALTER TABLE "Order" ADD COLUMN "shippingAddress" TEXT NOT NULL DEFAULT '';

-- 4. Hacer userId opcional (para guest checkout)
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;
```

---

## 🚀 Para Aplicar en Producción (Vercel)

### Opción 1: Ejecutar SQL Manualmente (Recomendado)

1. **Ir a Supabase Dashboard de PRODUCCIÓN:**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto de producción

2. **SQL Editor:**
   - Click en "SQL Editor" en el menú lateral

3. **Ejecutar este script completo:**
   ```sql
   -- Script completo de migración para producción
   -- Ejecutar en Supabase SQL Editor

   -- 1. Renombrar columnas viejas (si existen)
   DO $$
   BEGIN
       IF EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_name = 'Order' AND column_name = 'userName'
       ) THEN
           ALTER TABLE "Order" RENAME COLUMN "userName" TO "customerName";
       END IF;

       IF EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_name = 'Order' AND column_name = 'userEmail'
       ) THEN
           ALTER TABLE "Order" RENAME COLUMN "userEmail" TO "customerEmail";
       END IF;

       IF EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_name = 'Order' AND column_name = 'userPhone'
       ) THEN
           ALTER TABLE "Order" RENAME COLUMN "userPhone" TO "customerPhone";
       END IF;
   END $$;

   -- 2. Agregar columnas nuevas que faltan
   ALTER TABLE "Order"
   ADD COLUMN IF NOT EXISTS "customerName" TEXT NOT NULL DEFAULT '',
   ADD COLUMN IF NOT EXISTS "customerEmail" TEXT NOT NULL DEFAULT '',
   ADD COLUMN IF NOT EXISTS "customerPhone" TEXT NOT NULL DEFAULT '',
   ADD COLUMN IF NOT EXISTS "shippingCity" TEXT NOT NULL DEFAULT 'Bogotá',
   ADD COLUMN IF NOT EXISTS "shippingDepartment" TEXT NOT NULL DEFAULT 'Cundinamarca',
   ADD COLUMN IF NOT EXISTS "deliveryNotes" TEXT,
   ADD COLUMN IF NOT EXISTS "paymentTransactionId" TEXT;

   -- 3. Convertir shippingAddress de jsonb a text
   ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingAddress";
   ALTER TABLE "Order" ADD COLUMN "shippingAddress" TEXT NOT NULL DEFAULT '';

   -- 4. Hacer userId opcional (para guest checkout)
   ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

   -- 5. Verificar las columnas
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'Order'
   ORDER BY column_name;
   ```

4. **Click "Run"**

5. **Verificar resultado:**
   - Deberías ver una tabla con todas las columnas actualizadas

---

### Opción 2: Usar Prisma Migrate (Alternativa)

**⚠️ NOTA:** Esto puede requerir downtime y es más complicado.

```bash
# En tu máquina local, con DATABASE_URL apuntando a producción
DATABASE_URL="postgresql://..." bunx prisma db push --accept-data-loss
```

**Riesgos:**
- Puede eliminar datos si hay inconsistencias
- Requiere acceso directo a la base de datos de producción

---

## ✅ Verificar que Funcionó

Después de ejecutar las migraciones en producción:

1. **Vercel redeploy automático** - Espera 1-2 minutos

2. **Probar checkout:**
   - Ve a: https://zafta-web1.vercel.app/productos
   - Agregar producto al carrito
   - Proceder al checkout
   - Llenar formulario
   - Click "Ir a Pagar"

3. **Resultado esperado:**
   - ✅ No hay error 500
   - ✅ Widget de Wompi carga
   - ✅ Puedes completar el pago

---

## 🐛 Si Algo Sale Mal

### Error: "Column customerName does not exist"
**Causa:** Las migraciones no se ejecutaron
**Solución:** Ejecutar el script SQL completo de arriba

### Error: "Null constraint violation on userId"
**Causa:** El campo `userId` no se hizo nullable
**Solución:**
```sql
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;
```

### Error 500 en checkout
**Causa:** Alguna columna sigue faltando
**Solución:**
1. Ver logs en Vercel → Deployments → Function Logs
2. Identificar qué columna falta
3. Agregarla manualmente en Supabase

---

## 📊 Estado Actual

**Local (Desarrollo):**
- ✅ Migraciones ejecutadas
- ✅ Checkout funcionando
- ✅ Test de creación de órdenes pasa

**Producción (Vercel):**
- ⏳ **PENDIENTE** - Ejecutar migraciones
- ❌ Checkout NO funcionará hasta ejecutar migraciones

---

## 🔍 Script de Verificación

Puedes ejecutar este script localmente para verificar la estructura:

```bash
bun run scripts/test-order-creation.ts
```

**Resultado esperado:**
```
✅ Order created successfully!
✅ Order verified in database
✅ All tests passed!
```

---

## 📁 Archivos Relacionados

- `prisma/schema.prisma` - Schema de Prisma (fuente de verdad)
- `prisma/migrations/fix_order_columns.sql` - Script SQL de migración
- `scripts/test-order-creation.ts` - Script de testing
- `docs/CHECKOUT_FIX.md` - Documentación del fix

---

## ⏱️ Tiempo Estimado

**Ejecutar migraciones:** 2-3 minutos
**Verificar checkout:** 2 minutos
**Total:** ~5 minutos

---

## 🆘 Soporte

Si tienes problemas ejecutando las migraciones:

1. **Copia el error exacto** que recibes en Supabase
2. **Verifica** qué columnas existen actualmente:
   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'Order'
   ORDER BY column_name;
   ```
3. **Ejecuta las migraciones** una por una (no todo el bloque)

---

## ✅ Checklist Final

Antes de considerar completado:

- [ ] Script SQL ejecutado en Supabase de producción
- [ ] Verificación SQL muestra todas las columnas correctas
- [ ] Vercel redeploy completado
- [ ] Checkout testeado en producción
- [ ] Pago de prueba funciona con Wompi

---

**Estado:** ⚠️ **ACCIÓN REQUERIDA** - Ejecutar migraciones en producción
**Prioridad:** 🔴 **CRÍTICA** - El checkout no funciona sin esto
**Tiempo:** ⏱️ 5 minutos
