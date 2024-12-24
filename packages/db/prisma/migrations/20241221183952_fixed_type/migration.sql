/*
  Warnings:

  - Changed the type of `epoch` on the `CurrentRoomState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CurrentRoomState" DROP COLUMN "epoch",
ADD COLUMN     "epoch" INTEGER NOT NULL;
