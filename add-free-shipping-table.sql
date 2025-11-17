-- Free Shipping System Migration for Supabase
-- Execute this SQL in Supabase SQL Editor

-- 1. Create the ShippingRuleType enum
CREATE TYPE "ShippingRuleType" AS ENUM ('MINIMUM_PURCHASE', 'SPECIFIC_LOCATION', 'ALWAYS_FREE');

-- 2. Create the FreeShippingRule table
CREATE TABLE "FreeShippingRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ShippingRuleType" NOT NULL DEFAULT 'MINIMUM_PURCHASE',
    "minimumAmount" DECIMAL(10,2),
    "cities" TEXT[],
    "departments" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreeShippingRule_pkey" PRIMARY KEY ("id")
);

-- 3. Create indexes for better performance
CREATE INDEX "FreeShippingRule_isActive_idx" ON "FreeShippingRule"("isActive");
CREATE INDEX "FreeShippingRule_priority_idx" ON "FreeShippingRule"("priority");

-- 4. Verify the table was created
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'FreeShippingRule'
ORDER BY ordinal_position;
