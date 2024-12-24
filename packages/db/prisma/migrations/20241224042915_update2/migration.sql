/*
  Warnings:

  - The `imgUrl` column on the `Payload` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Payload" DROP COLUMN "imgUrl",
ADD COLUMN     "imgUrl" TEXT[];
