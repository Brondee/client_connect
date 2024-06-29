/*
  Warnings:

  - You are about to drop the column `isBotPaid` on the `General` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "General" DROP COLUMN "isBotPaid";

-- CreateTable
CREATE TABLE "AdminInfo" (
    "id" SERIAL NOT NULL,
    "BotPaid" BOOLEAN NOT NULL DEFAULT false,
    "payDate" TEXT NOT NULL,
    "walletAmount" INTEGER NOT NULL,

    CONSTRAINT "AdminInfo_pkey" PRIMARY KEY ("id")
);
