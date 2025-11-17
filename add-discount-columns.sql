-- Add discount tracking columns to Order table
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "discountCode" TEXT,
ADD COLUMN IF NOT EXISTS "discountAmount" DECIMAL(10,2) DEFAULT 0;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS "Order_customerEmail_idx" ON "Order"("customerEmail");

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Order'
AND column_name IN ('discountCode', 'discountAmount');
