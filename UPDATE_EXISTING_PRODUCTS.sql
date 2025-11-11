-- ============================================================================
-- EJECUTA ESTE SQL EN SUPABASE SQL EDITOR
-- ============================================================================
-- Este script actualiza TODOS los productos existentes con valores de displayOrder
-- basados en su fecha de creación (más antiguos = displayOrder menor)
-- ============================================================================

-- Actualizar displayOrder de productos existentes basado en createdAt
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
SELECT id, name, "displayOrder", "createdAt"
FROM "Product"
ORDER BY "displayOrder" ASC;
