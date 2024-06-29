/*
  Warnings:

  - Added the required column `specialistId` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Time" ADD COLUMN     "specialistId" INTEGER NOT NULL;
