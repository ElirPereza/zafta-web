-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "category" DROP NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_displayOrder_idx" ON "Product"("displayOrder");
