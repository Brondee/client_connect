/*
  Warnings:

  - Added the required column `billId` to the `AdminInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminInfo" ADD COLUMN     "billId" TEXT NOT NULL;
