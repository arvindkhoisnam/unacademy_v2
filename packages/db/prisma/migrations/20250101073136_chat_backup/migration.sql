-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "epoch" BIGINT NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "session_Id" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_session_Id_fkey" FOREIGN KEY ("session_Id") REFERENCES "Session"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
