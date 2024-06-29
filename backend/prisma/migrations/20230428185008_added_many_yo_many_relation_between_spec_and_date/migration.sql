-- CreateTable
CREATE TABLE "DatesOnSpecialists" (
    "specialistId" INTEGER NOT NULL,
    "dateId" INTEGER NOT NULL,

    CONSTRAINT "DatesOnSpecialists_pkey" PRIMARY KEY ("specialistId","dateId")
);

-- AddForeignKey
ALTER TABLE "DatesOnSpecialists" ADD CONSTRAINT "DatesOnSpecialists_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatesOnSpecialists" ADD CONSTRAINT "DatesOnSpecialists_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Date"("id") ON DELETE CASCADE ON UPDATE CASCADE;
