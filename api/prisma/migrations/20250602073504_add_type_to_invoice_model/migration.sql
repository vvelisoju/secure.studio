-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('TAXABLE', 'NON_TAXABLE');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "type" "InvoiceType" NOT NULL DEFAULT 'NON_TAXABLE';
