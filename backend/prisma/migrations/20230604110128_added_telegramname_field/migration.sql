/*
  Warnings:

  - A unique constraint covering the columns `[telegramName]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegramName` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "telegramName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_telegramName_key" ON "Client"("telegramName");
