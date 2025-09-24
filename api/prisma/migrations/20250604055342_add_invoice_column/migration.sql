/*
  Warnings:

  - You are about to drop the column `gst` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `taxAmount` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "gst",
DROP COLUMN "taxAmount",
ADD COLUMN     "cgst" DOUBLE PRECISION,
ADD COLUMN     "cgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "sgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00;
