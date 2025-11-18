-- Fix negative discount percentages in DiscountPopup table
-- Update all negative values to positive
UPDATE "DiscountPopup"
SET "discountPercent" = ABS("discountPercent")
WHERE "discountPercent" < 0;

-- Verify the fix
SELECT id, title, "discountCode", "discountPercent" 
FROM "DiscountPopup";
