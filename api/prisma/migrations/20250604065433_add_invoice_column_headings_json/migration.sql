-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "headingsJson" JSONB NOT NULL DEFAULT '{}';
