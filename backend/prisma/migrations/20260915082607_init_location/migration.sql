/*
  Warnings:

  - A unique constraint covering the columns `[trackerId]` on the table `pets` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "trackerId" TEXT;

-- CreateTable
CREATE TABLE "location_logs" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petId" TEXT NOT NULL,

    CONSTRAINT "location_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "location_logs_petId_createdAt_idx" ON "location_logs"("petId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "pets_trackerId_key" ON "pets"("trackerId");

-- CreateIndex
CREATE INDEX "pets_trackerId_idx" ON "pets"("trackerId");

-- AddForeignKey
ALTER TABLE "location_logs" ADD CONSTRAINT "location_logs_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
