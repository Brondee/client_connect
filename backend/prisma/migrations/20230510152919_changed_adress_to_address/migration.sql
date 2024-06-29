/*
  Warnings:

  - You are about to drop the column `companyAdress` on the `General` table. All the data in the column will be lost.
  - Added the required column `companyAddress` to the `General` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "General" DROP COLUMN "companyAdress",
ADD COLUMN     "companyAddress" TEXT NOT NULL;
