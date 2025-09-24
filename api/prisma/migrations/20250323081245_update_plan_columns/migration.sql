-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "defaultSelect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recommended" BOOLEAN NOT NULL DEFAULT false;
