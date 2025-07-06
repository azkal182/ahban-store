-- AlterTable
ALTER TABLE "NomorLogin" ADD COLUMN     "expired" TEXT;

-- AlterTable
ALTER TABLE "SlotAkrab" ADD COLUMN     "kuota_bersama" INTEGER DEFAULT 0,
ADD COLUMN     "pemakaian_kuota_bersama" INTEGER DEFAULT 0,
ADD COLUMN     "sisa-kuota-benefit" INTEGER DEFAULT 0,
ADD COLUMN     "total-kuota-benefit" INTEGER DEFAULT 0,
ALTER COLUMN "familyMemberId" DROP NOT NULL;
