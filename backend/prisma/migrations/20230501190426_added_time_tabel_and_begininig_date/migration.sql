/*
  Warnings:

  - Added the required column `beginingDate` to the `Specialist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTable` to the `Specialist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Specialist" ADD COLUMN     "beginingDate" TEXT NOT NULL,
ADD COLUMN     "timeTable" TEXT NOT NULL;
