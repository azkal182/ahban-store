-- DropForeignKey
ALTER TABLE "SlotAkrab" DROP CONSTRAINT "SlotAkrab_nomorLoginId_fkey";

-- AddForeignKey
ALTER TABLE "SlotAkrab" ADD CONSTRAINT "SlotAkrab_nomorLoginId_fkey" FOREIGN KEY ("nomorLoginId") REFERENCES "NomorLogin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
