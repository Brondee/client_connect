/*
  Warnings:

  - You are about to drop the column `walletAmount` on the `AdminInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdminInfo" DROP COLUMN "walletAmount",
ALTER COLUMN "BotPaid" SET DEFAULT 'false',
ALTER COLUMN "BotPaid" SET DATA TYPE TEXT;
