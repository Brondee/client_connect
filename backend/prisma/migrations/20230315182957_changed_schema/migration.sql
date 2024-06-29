/*
  Warnings:

  - You are about to drop the column `time` on the `Dates` table. All the data in the column will be lost.
  - Added the required column `isWorkingDate` to the `Dates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dates" DROP COLUMN "time",
ADD COLUMN     "freeTime" TEXT[] DEFAULT ARRAY['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']::TEXT[],
ADD COLUMN     "isWorkingDate" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "time" SET DATA TYPE TEXT;
