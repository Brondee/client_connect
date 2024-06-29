-- DropForeignKey
ALTER TABLE "ServicesOnSpecialists" DROP CONSTRAINT "ServicesOnSpecialists_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ServicesOnSpecialists" DROP CONSTRAINT "ServicesOnSpecialists_specialistId_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_dateId_fkey";

-- AddForeignKey
ALTER TABLE "ServicesOnSpecialists" ADD CONSTRAINT "ServicesOnSpecialists_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesOnSpecialists" ADD CONSTRAINT "ServicesOnSpecialists_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Date"("id") ON DELETE CASCADE ON UPDATE CASCADE;
