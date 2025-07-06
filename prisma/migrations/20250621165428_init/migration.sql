-- CreateTable
CREATE TABLE "NomorLogin" (
    "id" TEXT NOT NULL,
    "nomorHp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "NomorLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NomorLogin_nomorHp_key" ON "NomorLogin"("nomorHp");
