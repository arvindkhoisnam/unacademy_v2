/*
  Warnings:

  - Changed the type of `imgUrl` on the `Payload` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Payload" DROP COLUMN "imgUrl",
ADD COLUMN     "imgUrl" JSONB NOT NULL;
