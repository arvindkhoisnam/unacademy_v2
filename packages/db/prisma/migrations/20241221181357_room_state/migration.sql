-- CreateTable
CREATE TABLE "CurrentRoomState" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB,
    "epoch" TEXT NOT NULL,

    CONSTRAINT "CurrentRoomState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrentRoomState_id_key" ON "CurrentRoomState"("id");
