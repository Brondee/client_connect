/*
  Warnings:

  - Added the required column `masterId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "masterId" INTEGER NOT NULL;
