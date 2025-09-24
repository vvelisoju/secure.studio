/*
  Warnings:

  - You are about to drop the column `advance` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "advance",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0.00;
