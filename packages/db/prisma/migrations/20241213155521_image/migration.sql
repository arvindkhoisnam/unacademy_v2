-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "session_Id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_session_Id_fkey" FOREIGN KEY ("session_Id") REFERENCES "Session"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
