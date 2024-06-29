/*
  Warnings:

  - You are about to drop the column `isWorkingDate` on the `Date` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CategoriesOnSpecialists" ADD COLUMN     "isWorkingDate" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Date" DROP COLUMN "isWorkingDate";
