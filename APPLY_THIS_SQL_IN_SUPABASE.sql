-- ============================================================================
-- IMPORTANTE: Ejecuta este SQL en Supabase SQL Editor
-- ============================================================================
-- Este SQL agrega la columna displayOrder a la tabla Product
-- y hace que category sea opcional
-- ============================================================================

-- 1. Agregar columna displayOrder si no existe
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- 2. Hacer category opcional (permitir NULL)
ALTER TABLE "Product"
ALTER COLUMN "category" DROP NOT NULL;

-- 3. Crear índice en displayOrder si no existe
CREATE INDEX IF NOT EXISTS "Product_displayOrder_idx" ON "Product"("displayOrder");

-- 4. Actualizar displayOrder de productos existentes basado en createdAt
-- (Los más antiguos primero)
UPDATE "Product"
SET "displayOrder" = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) - 1 as row_num
  FROM "Product"
) AS subquery
WHERE "Product".id = subquery.id;

-- ============================================================================
-- VERIFICACIÓN: Ejecuta esto después para confirmar que funcionó
-- ============================================================================
-- SELECT id, name, "displayOrder", "category", "createdAt"
-- FROM "Product"
-- ORDER BY "displayOrder" ASC;
