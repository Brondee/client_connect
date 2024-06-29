-- AlterTable
ALTER TABLE "Specialist" ALTER COLUMN "photoUrl" DROP NOT NULL,
ALTER COLUMN "photoUrl" SET DEFAULT '../../../assets/img/default-avatar.png';
