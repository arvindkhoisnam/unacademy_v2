/*
  Warnings:

  - Made the column `session_Id` on table `CurrentRoomState` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CurrentRoomState" DROP CONSTRAINT "CurrentRoomState_session_Id_fkey";

-- AlterTable
ALTER TABLE "CurrentRoomState" ALTER COLUMN "session_Id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CurrentRoomState" ADD CONSTRAINT "CurrentRoomState_session_Id_fkey" FOREIGN KEY ("session_Id") REFERENCES "Session"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
