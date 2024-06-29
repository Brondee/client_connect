/*
  Warnings:

  - Added the required column `companyDescription` to the `General` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "General" ADD COLUMN     "companyDescription" TEXT NOT NULL;
