-- AlterTable
ALTER TABLE "CurrentRoomState" ADD COLUMN     "session_Id" TEXT,
ALTER COLUMN "epoch" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "CurrentRoomState" ADD CONSTRAINT "CurrentRoomState_session_Id_fkey" FOREIGN KEY ("session_Id") REFERENCES "Session"("sessionId") ON DELETE SET NULL ON UPDATE CASCADE;
