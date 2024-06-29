/*
  Warnings:

  - You are about to drop the column `isWorkingDate` on the `CategoriesOnSpecialists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CategoriesOnSpecialists" DROP COLUMN "isWorkingDate";

-- AlterTable
ALTER TABLE "DatesOnSpecialists" ADD COLUMN     "isWorkingDate" BOOLEAN NOT NULL DEFAULT false;
