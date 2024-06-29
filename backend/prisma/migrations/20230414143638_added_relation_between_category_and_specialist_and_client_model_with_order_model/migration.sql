/*
  Warnings:

  - You are about to drop the `ServicesOnSpecialists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServicesOnSpecialists" DROP CONSTRAINT "ServicesOnSpecialists_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ServicesOnSpecialists" DROP CONSTRAINT "ServicesOnSpecialists_specialistId_fkey";

-- DropTable
DROP TABLE "ServicesOnSpecialists";

-- CreateTable
CREATE TABLE "CategoriesOnSpecialists" (
    "specialistId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "CategoriesOnSpecialists_pkey" PRIMARY KEY ("specialistId","categoryId")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "masterName" TEXT NOT NULL,
    "dateTime" TEXT NOT NULL,
    "servicesInfo" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "servicesCount" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnSpecialists" ADD CONSTRAINT "CategoriesOnSpecialists_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnSpecialists" ADD CONSTRAINT "CategoriesOnSpecialists_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
