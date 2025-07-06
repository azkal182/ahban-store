-- AlterTable
ALTER TABLE "NomorLogin" ADD COLUMN     "kategoriId" TEXT;

-- CreateTable
CREATE TABLE "SlotAkrab" (
    "id" TEXT NOT NULL,
    "nomorLoginId" TEXT NOT NULL,
    "slotKe" INTEGER NOT NULL,
    "alias" TEXT NOT NULL,
    "nomor" TEXT NOT NULL,
    "sisaAdd" INTEGER NOT NULL,
    "slotId" INTEGER NOT NULL,
    "familyMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlotAkrab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_nama_key" ON "Kategori"("nama");

-- AddForeignKey
ALTER TABLE "NomorLogin" ADD CONSTRAINT "NomorLogin_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotAkrab" ADD CONSTRAINT "SlotAkrab_nomorLoginId_fkey" FOREIGN KEY ("nomorLoginId") REFERENCES "NomorLogin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
