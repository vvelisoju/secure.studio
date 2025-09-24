-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "itemsJson" JSONB NOT NULL DEFAULT '[]';
