/*
  Warnings:

  - You are about to drop the `Dates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Dates";

-- CreateTable
CREATE TABLE "Date" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isWorkingDate" BOOLEAN NOT NULL,

    CONSTRAINT "Date_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time" (
    "id" SERIAL NOT NULL,
    "morningTime" TEXT[] DEFAULT ARRAY['9:00', '9:30', '10:00', '10:30', '11:00', '11:30']::TEXT[],
    "afternoonTime" TEXT[] DEFAULT ARRAY['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']::TEXT[],
    "eveningTime" TEXT[] DEFAULT ARRAY['18:00', '18:30', '19:00', '19:30', '20:00', '20:30']::TEXT[],
    "dateId" INTEGER NOT NULL,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Time_dateId_key" ON "Time"("dateId");

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Date"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
