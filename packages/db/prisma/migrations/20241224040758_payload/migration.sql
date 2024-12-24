/*
  Warnings:

  - You are about to drop the column `payload` on the `CurrentRoomState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CurrentRoomState" DROP COLUMN "payload";

-- CreateTable
CREATE TABLE "Payload" (
    "id" TEXT NOT NULL,
    "imgUrl" TEXT,
    "currPage" INTEGER,
    "x" TEXT,
    "y" TEXT,
    "adminHeight" TEXT,
    "adminWidth" TEXT,
    "currRoomStateId" TEXT NOT NULL,

    CONSTRAINT "Payload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payload_id_key" ON "Payload"("id");

-- AddForeignKey
ALTER TABLE "Payload" ADD CONSTRAINT "Payload_currRoomStateId_fkey" FOREIGN KEY ("currRoomStateId") REFERENCES "CurrentRoomState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
