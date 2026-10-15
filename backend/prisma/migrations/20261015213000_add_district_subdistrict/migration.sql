-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "district" TEXT,
ADD COLUMN IF NOT EXISTS "subDistrict" TEXT;

