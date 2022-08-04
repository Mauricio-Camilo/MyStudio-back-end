/*
  Warnings:

  - You are about to drop the column `annual` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `monthly` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `quarterly` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `semiannual` on the `payments` table. All the data in the column will be lost.
  - Added the required column `period` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "annual",
DROP COLUMN "monthly",
DROP COLUMN "quarterly",
DROP COLUMN "semiannual",
ADD COLUMN     "period" TEXT NOT NULL;
