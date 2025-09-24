/*
  Warnings:

  - You are about to drop the column `gst` on the `AppSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppSetting" DROP COLUMN "gst",
ADD COLUMN     "cgst" DOUBLE PRECISION DEFAULT 9,
ADD COLUMN     "sgst" DOUBLE PRECISION DEFAULT 9;
