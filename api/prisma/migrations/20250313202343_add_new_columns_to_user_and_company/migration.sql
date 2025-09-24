-- CreateEnum
CREATE TYPE "EmployeeRange" AS ENUM ('ONE_TO_FIVE', 'FIVE_TO_TEN', 'TEN_TO_TWENTY', 'TWENTY_PLUS');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "employeeRange" "EmployeeRange" NOT NULL DEFAULT 'ONE_TO_FIVE',
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "imageUrl" TEXT;
