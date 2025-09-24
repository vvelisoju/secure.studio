/*
  Warnings:

  - The values [FIVE_TO_TEN,TEN_TO_TWENTY] on the enum `EmployeeRange` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeRange_new" AS ENUM ('ONE_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_TO_TWENTY', 'TWENTY_PLUS');
ALTER TABLE "Company" ALTER COLUMN "employeeRange" DROP DEFAULT;
ALTER TABLE "Company" ALTER COLUMN "employeeRange" TYPE "EmployeeRange_new" USING ("employeeRange"::text::"EmployeeRange_new");
ALTER TYPE "EmployeeRange" RENAME TO "EmployeeRange_old";
ALTER TYPE "EmployeeRange_new" RENAME TO "EmployeeRange";
DROP TYPE "EmployeeRange_old";
ALTER TABLE "Company" ALTER COLUMN "employeeRange" SET DEFAULT 'ONE_TO_FIVE';
COMMIT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "advance" DOUBLE PRECISION,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "PAN" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "HSN" TEXT,
ADD COLUMN     "SAC" TEXT;
