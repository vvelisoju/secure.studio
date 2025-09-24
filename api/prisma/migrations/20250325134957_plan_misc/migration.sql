/*
  Warnings:

  - You are about to drop the column `durationValueSelect` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `savePercentage` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "durationValueSelect",
DROP COLUMN "savePercentage",
ADD COLUMN     "defaultPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "DurationValueSelect";
