/*
  Warnings:

  - You are about to drop the column `health_center_id` on the `villages` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VillageType" AS ENUM ('DESA', 'KELURAHAN');

-- DropForeignKey
ALTER TABLE "villages" DROP CONSTRAINT "villages_health_center_id_fkey";

-- DropIndex
DROP INDEX "villages_health_center_id_idx";

-- AlterTable
ALTER TABLE "villages" DROP COLUMN "health_center_id",
ADD COLUMN     "type" "VillageType" NOT NULL DEFAULT 'DESA';

-- CreateIndex
CREATE INDEX "villages_district_id_idx" ON "villages"("district_id");
