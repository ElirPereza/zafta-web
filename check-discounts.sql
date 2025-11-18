-- Verificar todos los descuentos en la base de datos
SELECT
  id,
  title,
  "discountCode",
  "discountPercent",
  "isActive",
  "startDate",
  "endDate",
  "createdAt"
FROM "DiscountPopup"
ORDER BY "createdAt" DESC;

-- Verificar si hay descuentos activos
SELECT COUNT(*) as active_discounts
FROM "DiscountPopup"
WHERE "isActive" = true;
