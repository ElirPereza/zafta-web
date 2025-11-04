-- Migration to fix Order table column names
-- This renames old columns to match the new schema

-- Check if old columns exist and rename them
DO $$
BEGIN
    -- Rename userName to customerName if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Order' AND column_name = 'userName'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "userName" TO "customerName";
        RAISE NOTICE 'Renamed userName to customerName';
    END IF;

    -- Rename userEmail to customerEmail if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Order' AND column_name = 'userEmail'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "userEmail" TO "customerEmail";
        RAISE NOTICE 'Renamed userEmail to customerEmail';
    END IF;

    -- Rename userPhone to customerPhone if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Order' AND column_name = 'userPhone'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "userPhone" TO "customerPhone";
        RAISE NOTICE 'Renamed userPhone to customerPhone';
    END IF;

    -- If columns don't exist, create them
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Order' AND column_name = 'customerName'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerName" TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Created customerName column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Order' AND column_name = 'customerEmail'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Created customerEmail column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Order' AND column_name = 'customerPhone'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Created customerPhone column';
    END IF;

END $$;

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Order'
AND column_name IN ('customerName', 'customerEmail', 'customerPhone')
ORDER BY column_name;
