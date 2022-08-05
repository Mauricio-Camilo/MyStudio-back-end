/*
  Warnings:

  - You are about to drop the column `cpf` on the `clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "clients_cpf_key";

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "cpf";

-- CreateIndex
CREATE UNIQUE INDEX "clients_name_key" ON "clients"("name");
